import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // 🔴 Require login
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { details, plan, email } = await req.json();

    // Basic validation
    if (!details || !plan || !email) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }

    // Plan → Price mapping
    let price = "$0";
    if (plan === "basic") price = "$50";
    if (plan === "advanced") price = "$100";
    if (plan === "premium") price = "$150";

    const user = session.user;

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
                name: "👤 Discord User",
                value: user?.name || "Unknown",
                inline: true,
              },
              {
                name: "📧 Email",
                value: email,
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
      return Response.json({ error: "Webhook failed" }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}