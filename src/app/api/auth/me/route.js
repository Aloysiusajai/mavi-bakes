import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

function getCookieValue(cookieHeader, name) {
  if (!cookieHeader) return null;
  const parts = cookieHeader.split(";").map((p) => p.trim());
  for (const part of parts) {
    if (part.startsWith(name + "=")) return part.substring(name.length + 1);
  }
  return null;
}

export async function GET(req) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const token = getCookieValue(cookieHeader, "session_token");
    if (!token) return NextResponse.json({ authenticated: false });
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ authenticated: false });
    return NextResponse.json({ authenticated: true, payload: decoded });
  } catch (e) {
    console.error("[auth/me] error", e);
    return NextResponse.json({ authenticated: false });
  }
}
