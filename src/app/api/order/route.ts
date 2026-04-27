export async function POST(req: Request) {
  try {
    const { username, details, plan } = await req.json();

    // Basic validation
    if (!username || !details || !plan) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }

    // Plan → Price mapping
    let price = "$0";
    if (plan === "basic") price = "$50";
    if (plan === "advanced") price = "$100";
    if (plan === "premium") price = "$150";

    const response = await fetch(process.env.DISCORD_WEBHOOK_URL!, {
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
                name: "👤 User",
                value: username,
                inline: true,
              },
              {
                name: "💰 Plan",
                value: `${plan.toUpperCase()} (${price})`,
                inline: true,
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
    });

    if (!response.ok) {
      console.error("Discord webhook failed");
      return Response.json({ error: "Webhook failed" }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}