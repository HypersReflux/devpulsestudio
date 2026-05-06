export async function POST(req: Request) {
  try {
    const { email, amount, description } = await req.json();

    console.log("Incoming Request:", {
      email,
      amount,
      description,
    });

    // =========================
    // Get PayPal OAuth Token
    // =========================

    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
    ).toString("base64");

    const tokenRes = await fetch(
      `${process.env.PAYPAL_BASE_URL}/v1/oauth2/token`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
      }
    );

    const tokenData = await tokenRes.json();

    console.log("TOKEN RESPONSE:", tokenData);

    if (!tokenRes.ok) {
      return Response.json(
        {
          error: "Token request failed",
          details: tokenData,
        },
        { status: 500 }
      );
    }

    const accessToken = tokenData.access_token;

    // =========================
    // Create Invoice
    // =========================

    const invoiceRes = await fetch(
      `${process.env.PAYPAL_BASE_URL}/v2/invoicing/invoices`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          detail: {
            currency_code: "USD",
            note: "Thank you for your order from DevPulseStudio.",
            term: "Due on receipt",
          },

          invoicer: {
            name: {
              given_name: "DevPulse",
              surname: "Studio",
            },
          },

          primary_recipients: [
            {
              billing_info: {
                email_address: email,
              },
            },
          ],

          items: [
            {
              name: description,
              quantity: "1",
              unit_amount: {
                currency_code: "USD",
                value: amount,
              },
            },
          ],
        }),
      }
    );

    const invoiceData = await invoiceRes.json();

    console.log("INVOICE RESPONSE:", invoiceData);

    if (!invoiceRes.ok) {
      return Response.json(
        {
          error: "Invoice creation failed",
          details: invoiceData,
        },
        { status: 500 }
      );
    }

    // =========================
    // Get Invoice ID from Header
    // =========================

    const invoiceUrl = invoiceRes.headers.get("location");

    console.log("LOCATION HEADER:", invoiceUrl);

    if (!invoiceUrl) {
      return Response.json(
        {
          error: "Missing invoice location header",
        },
        { status: 500 }
      );
    }

    const invoiceId = invoiceUrl.split("/").pop();

    console.log("INVOICE ID:", invoiceId);

    // =========================
    // Send Invoice
    // =========================

    const sendRes = await fetch(
      `${process.env.PAYPAL_BASE_URL}/v2/invoicing/invoices/${invoiceId}/send`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    let sendData = {};

    try {
      sendData = await sendRes.json();
    } catch {
      sendData = { message: "No response body" };
    }

    console.log("SEND RESPONSE:", sendData);

    if (!sendRes.ok) {
      return Response.json(
        {
          error: "Failed to send invoice",
          details: sendData,
        },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      invoiceId,
    });

  } catch (err) {
    console.error("SERVER ERROR:", err);

    return Response.json(
      {
        error: "Server error",
        details: String(err),
      },
      { status: 500 }
    );
  }
}