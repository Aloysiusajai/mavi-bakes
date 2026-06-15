import { NextResponse } from "next/server";
import { findUserByEmail, createUser } from "@/lib/userService";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password, name } = body || {};
    if (!email || !password)
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 },
      );

    const existing = await findUserByEmail(email);
    if (existing)
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 },
      );

    const created = await createUser(
      String(email).toLowerCase(),
      String(password),
      name,
    );
    return NextResponse.json({ success: true, id: created._id || created.id });
  } catch (e) {
    console.error("[auth/register] error", e);
    if (e instanceof Error && e.message.includes("already registered")) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
