import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  let body: { name?: string; email?: string };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = body.name?.trim();
  const email = body.email?.trim().toLowerCase();

  if (!name || name.length < 1) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }

  const { error } = await supabase
    .from("waitlist")
    .insert([{ name, email }]);

  if (error) {
    if (error.code === "23505") {
      // unique constraint violation
      return NextResponse.json(
        { error: "This email is already on the waitlist." },
        { status: 409 }
      );
    }
    console.error("Supabase insert error:", error);
    return NextResponse.json({ error: "Failed to save. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ message: "Success" }, { status: 201 });
}
