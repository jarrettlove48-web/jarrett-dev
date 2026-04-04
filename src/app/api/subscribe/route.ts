import { NextResponse } from "next/server";

const SUPABASE_URL = "https://tfshawyalkvxmryjqbzh.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmc2hhd3lhbGt2eG1yeWpxYnpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4MTg2MTQsImV4cCI6MjA4NzM5NDYxNH0.0E2NliQRhELsKP7aggXGwJd_LtQcXlabXr4ft0paEtw";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/subscribers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ email: email.toLowerCase() }),
    });

    if (res.status === 409 || res.status === 409) {
      return NextResponse.json({ message: "You're already subscribed!" });
    }

    if (!res.ok) {
      const body = await res.text();
      if (body.includes("duplicate")) {
        return NextResponse.json({ message: "You're already subscribed!" });
      }
      return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }

    return NextResponse.json({ message: "You're in. Welcome to It's All Love Weekly." });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
