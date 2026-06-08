import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body || {};
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    console.log('[admin/login] attempt for email:', email);

    if (!email || !password) {
      console.warn('[admin/login] missing email or password');
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      console.error('[admin/login] ADMIN_EMAIL or ADMIN_PASSWORD not set on server');
      return NextResponse.json({ error: 'Admin credentials not configured on server' }, { status: 500 });
    }

    // Compare normalized emails (case-insensitive) and exact password
    const okEmail = String(email).trim().toLowerCase() === String(ADMIN_EMAIL).trim().toLowerCase();
    const okPassword = String(password) === String(ADMIN_PASSWORD);
    if (!okEmail || !okPassword) {
      console.warn('[admin/login] invalid credentials for', email);
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // migrate to unified JWT session
    const { signToken } = await import('@/lib/jwt');
    const token = signToken({ email: ADMIN_EMAIL, role: 'admin' }, '4h');
    const isProd = process.env.NODE_ENV === 'production';
    const cookie = `session_token=${token}; Path=/; HttpOnly; Max-Age=14400; SameSite=Lax; ${isProd ? 'Secure;' : ''}`;
    const res = NextResponse.json({ success: true });
    res.headers.append('Set-Cookie', cookie);
    return res;
  } catch (e: unknown) {
    console.error(e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
