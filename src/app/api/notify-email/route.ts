import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const body = await req.json();
  const { to, item, stock } = body;

  if (!to || !item || stock === undefined) {
    return new Response("Missing required fields", { status: 400 });
  }

  try {
    const { error } = await resend.emails.send({
      from: "在庫アラート <onboarding@resend.dev>", // ドメイン設定しない場合はテンプレート名のみ可
      to,
      subject: `【在庫警告】${item} が少なくなっています`,
      text: `${item} の在庫が ${stock} 個に減りました。\n早めに補充してください。`,
    });

    if (error) {
      console.error("Resend error:", error);
      return new Response("Failed to send email", { status: 500 });
    }

    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error("Error sending email:", err);
    return new Response("Unexpected error", { status: 500 });
  }
}
