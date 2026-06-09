import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true });
  // clear unified session cookie
  res.headers.append(
    "Set-Cookie",
    `session_token=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax;`,
  );
  return res;
}
