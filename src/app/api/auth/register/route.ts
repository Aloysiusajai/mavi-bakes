import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name } = body || {};
    if (!email || !password) return NextResponse.json({ error: 'Email and password required' }, { status: 400 });

    await connectToDatabase();
    const existing = await User.findOne({ email: String(email).toLowerCase() });
    if (existing) return NextResponse.json({ error: 'Email already registered' }, { status: 409 });

    const created = await User.createUser(String(email).toLowerCase(), String(password), name);
    return NextResponse.json({ success: true, id: created._id });
  } catch (e) {
    console.error('[auth/register] error', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
