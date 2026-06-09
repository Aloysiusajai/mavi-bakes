import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
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

    await connectToDatabase();

    // Admin special-case
    if (
      ADMIN_EMAIL &&
      String(email).trim().toLowerCase() ===
        String(ADMIN_EMAIL).trim().toLowerCase()
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

    const user = await User.findOne({ email: String(email).toLowerCase() });
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
