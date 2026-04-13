import { NextResponse } from "next/server";
import { Resend } from "resend";
import { renderWelcomeEmail } from "@/lib/welcome-email";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;
export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase();

    const res = await fetch(`${SUPABASE_URL}/rest/v1/subscribers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ email: normalizedEmail }),
    });

    if (!res.ok) {
      const body = await res.text();
      if (body.includes("duplicate") || res.status === 409) {
        return NextResponse.json({ message: "You're already subscribed!" });
      }
      return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }

    // Send welcome email
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const token = Buffer.from(normalizedEmail).toString("base64url");
      const unsubscribeUrl = `https://jarrett.love/api/unsubscribe?token=${token}`;

      await Promise.all([
        // Welcome email to subscriber
        resend.emails.send({
          from: "Jarrett Love <hello@jarrett.love>",
          to: normalizedEmail,
          subject: "Welcome to It's All Love Weekly",
          html: renderWelcomeEmail(unsubscribeUrl),
          headers: {
            "List-Unsubscribe": `<${unsubscribeUrl}>`,
          },
        }),
        // Alert to Jarrett
        resend.emails.send({
          from: "jarrett.love <hello@jarrett.love>",
          to: "hello@jarrett.love",
          subject: `New subscriber: ${normalizedEmail}`,
          html: `<div style="font-family:-apple-system,sans-serif;background:#0a0a0a;color:#fafafa;padding:32px;">
            <p style="font-size:13px;color:#525252;font-family:'JetBrains Mono',monospace;margin:0 0 16px 0;">jarrett<span style="color:#3b82f6;">.</span>love</p>
            <h2 style="margin:0 0 8px 0;font-size:20px;">New subscriber</h2>
            <p style="margin:0;font-size:16px;color:#a3a3a3;">${normalizedEmail}</p>
          </div>`,
        }),
      ]);
    }

    return NextResponse.json({ message: "You're in. Welcome to It's All Love Weekly." });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
