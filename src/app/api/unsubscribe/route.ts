import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return new NextResponse("Missing token", { status: 400 });
  }

  let email: string;
  try {
    email = Buffer.from(token, "base64url").toString("utf-8");
  } catch {
    return new NextResponse("Invalid token", { status: 400 });
  }

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/subscribers?email=eq.${encodeURIComponent(email)}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ active: false }),
    }
  );

  if (!res.ok) {
    return new NextResponse("Something went wrong", { status: 500 });
  }

  return new NextResponse(
    `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Unsubscribed</title></head>
<body style="margin:0;padding:0;background:#0a0a0a;color:#fafafa;font-family:-apple-system,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;">
  <div style="text-align:center;padding:2rem;">
    <h1 style="font-size:1.5rem;margin-bottom:0.5rem;">You've been unsubscribed</h1>
    <p style="color:#a3a3a3;">No hard feelings. You can always resubscribe at <a href="https://jarrett.love/weekly-drop" style="color:#3b82f6;">jarrett.love/weekly-drop</a></p>
  </div>
</body>
</html>`,
    { status: 200, headers: { "Content-Type": "text/html" } }
  );
}
