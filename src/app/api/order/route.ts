import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // 🔴 Require login
    if (!session) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { details, plan, email } = await req.json();
    const orderId = crypto.randomUUID();

    // 🔴 Validation
    if (!details || !plan || !email) {
      return Response.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    // =========================
    // Pricing
    // =========================

    let price = "$0";
    let priceNumber = 0;

    if (plan === "basic") {
      price = "$50";
      priceNumber = 50;
    }

    if (plan === "advanced") {
      price = "$100";
      priceNumber = 100;
    }

    if (plan === "premium") {
      price = "$150";
      priceNumber = 150;
    }

    if (plan === "custom") {
      price = "Custom Quote";
    }

    const user = session.user;

    // =========================
    // Send Discord Webhook
    // =========================

    const webhookResponse = await fetch(
      process.env.DISCORD_WEBHOOK_URL!,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          embeds: [
            {
              title: "📥 New Bot Order",
              color: 0xff003c,

              fields: [
                {
                  name: "👤 Discord User",
                  value: user?.name || "Unknown",
                  inline: true,
                },

                {
                  name: "📧 Email",
                  value: email,
                  inline: true,
                },

                { name: "🆔 Order ID", 
                  value: orderId, 
                  inline: false},

                {
                  name: "💰 Plan",
                  value: `${plan.toUpperCase()} (${price})`,
                  inline: true,
                },

                {
                  name: "Invoice",
                  value: "Automatically sent",
                },

                {
                  name: "📝 Details",
                  value: details || "None",
                },
              ],

              footer: {
                text: "DevPulseStudio Orders",
              },

              timestamp: new Date().toISOString(),
            },
          ],
        }),
      }
    );

    if (!webhookResponse.ok) {
      return Response.json(
        { error: "Webhook failed" },
        { status: 500 }
      );
    }

    // =========================
    // Auto Send PayPal Invoice
    // =========================

    // 🔴 Skip custom quotes
    if (plan !== "custom") {
      console.log("Sending PayPal invoice...");

      const invoiceResponse = await fetch(
        `${process.env.NEXTAUTH_URL}/api/paypal/invoice`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            amount: priceNumber,
            description: `${plan.toUpperCase()} Bot Package | Order ID: ${orderId}`,
          }),
        }
      );

      const invoiceData = await invoiceResponse.json();

      console.log("Invoice Response:", invoiceData);

      if (!invoiceResponse.ok) {
        return Response.json(
          {
            error: "Invoice failed",
            details: invoiceData,
          },
          { status: 500 }
        );
      }
    }

    // =========================
    // Success Response
    // =========================

    return Response.json({
      success: true,

      message:
        plan === "custom"
          ? "Custom quote submitted successfully."
          : "Order submitted and invoice sent successfully.",
    });

  } catch (err) {
    console.error("ORDER ROUTE ERROR:", err);

    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}