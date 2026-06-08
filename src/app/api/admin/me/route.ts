import { NextResponse } from 'next/server';

function getCookieValue(cookieHeader: string | null, name: string) {
  if (!cookieHeader) return null;
  const parts = cookieHeader.split(';').map(p => p.trim());
  for (const part of parts) {
    if (part.startsWith(name + '=')) return part.substring(name.length + 1);
  }
  return null;
}

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
      const token = getCookieValue(cookieHeader, 'session_token');
    console.log('[admin/me] token present?', Boolean(token));
    if (!token) return NextResponse.json({ authenticated: false });

    // verify JWT
    try {
      const { verifyToken } = await import('@/lib/jwt');
      const decoded = verifyToken(token as string);
      if (decoded && decoded.email === process.env.ADMIN_EMAIL && decoded.role === 'admin') {
        console.log('[admin/me] authenticated as', decoded.email);
        return NextResponse.json({ authenticated: true, email: decoded.email });
      }
    } catch (e) {
      console.error('[admin/me] verify failed', e);
    }

    return NextResponse.json({ authenticated: false });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ authenticated: false });
  }
}
