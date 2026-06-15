import { NextResponse } from "next/server";
import { findUserByEmail } from "@/lib/userService";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/jwt";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body || {};
    if (!email || !password)
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 },
      );

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    // Admin special-case — checked BEFORE connecting to DB so admin login
    // works even when MongoDB Atlas IP is not whitelisted.
    const isEmailMatch = String(email).trim().toLowerCase() === String(ADMIN_EMAIL).trim().toLowerCase();
    const isUsernameMatch = String(email).trim().toLowerCase() === "admin";
    if (
      ADMIN_EMAIL &&
      (isEmailMatch || isUsernameMatch)
    ) {
      if (String(password) !== String(ADMIN_PASSWORD))
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 },
        );
      const token = signToken({ email: ADMIN_EMAIL, role: "admin" }, "4h");
      const res = NextResponse.json({ success: true, role: "admin" });
      res.headers.append(
        "Set-Cookie",
        `session_token=${token}; Path=/; HttpOnly; Max-Age=14400; SameSite=Lax; ${process.env.NODE_ENV === "production" ? "Secure;" : ""}`,
      );
      return res;
    }

    // Regular user login — uses userService with local JSON fallback
    const user = await findUserByEmail(email);
    if (!user)
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );

    const ok = await bcrypt.compare(String(password), user.passwordHash);
    if (!ok)
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );

    const token = signToken(
      { email: user.email, role: "user", userId: String(user._id) },
      "8h",
    );
    const res = NextResponse.json({
      success: true,
      role: "user",
      user: { id: user._id, email: user.email, name: user.name },
    });
    res.headers.append(
      "Set-Cookie",
      `session_token=${token}; Path=/; HttpOnly; Max-Age=28800; SameSite=Lax; ${process.env.NODE_ENV === "production" ? "Secure;" : ""}`,
    );
    return res;
  } catch (e) {
    console.error("[auth/login] error", e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
