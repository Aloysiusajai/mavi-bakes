import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXT_PUBLIC_JWT_SECRET;

if (!JWT_SECRET) {
  // In server runtime this should be set; warn in dev
  if (process.env.NODE_ENV !== 'production') console.warn('JWT_SECRET is not set. Set JWT_SECRET in .env.local for production.');
}

export function signToken(payload, expiresIn = '1h') {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyToken(token) {
  try {
    const opts = {};
    return jwt.verify(token, JWT_SECRET, opts);
  } catch {
    return null;
  }
}
