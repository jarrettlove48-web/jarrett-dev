import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getPost } from "@/lib/blog";
import { renderEmail } from "@/lib/email-template";

const SUPABASE_URL = "https://tfshawyalkvxmryjqbzh.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmc2hhd3lhbGt2eG1yeWpxYnpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4MTg2MTQsImV4cCI6MjA4NzM5NDYxNH0.0E2NliQRhELsKP7aggXGwJd_LtQcXlabXr4ft0paEtw";

const SEND_SECRET = process.env.SEND_SECRET;

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!SEND_SECRET || authHeader !== `Bearer ${SEND_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await req.json();
  if (!slug) {
    return NextResponse.json({ error: "slug required" }, { status: 400 });
  }

  const post = getPost(slug);
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  // Fetch active subscribers
  const subRes = await fetch(
    `${SUPABASE_URL}/rest/v1/subscribers?active=eq.true&select=email`,
    {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    }
  );

  if (!subRes.ok) {
    return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 });
  }

  const subscribers: { email: string }[] = await subRes.json();

  if (subscribers.length === 0) {
    return NextResponse.json({ message: "No active subscribers", sent: 0 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const baseUrl = "https://jarrett.love";

  let sent = 0;
  const errors: string[] = [];

  for (const sub of subscribers) {
    const token = Buffer.from(sub.email).toString("base64url");
    const unsubscribeUrl = `${baseUrl}/api/unsubscribe?token=${token}`;
    const html = renderEmail(post, unsubscribeUrl);

    try {
      await resend.emails.send({
        from: "Jarrett Love <hello@jarrett.love>",
        to: sub.email,
        subject: `It's All Love Weekly #${String(post.issue).padStart(3, "0")} — ${post.title.split("\n")[0]}`,
        html,
        headers: {
          "List-Unsubscribe": `<${unsubscribeUrl}>`,
        },
      });
      sent++;
    } catch (err) {
      errors.push(`${sub.email}: ${err instanceof Error ? err.message : "unknown error"}`);
    }
  }

  return NextResponse.json({ sent, total: subscribers.length, errors });
}
