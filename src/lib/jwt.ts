import jwt from 'jsonwebtoken';
import type { JwtPayload, SignOptions, VerifyOptions } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXT_PUBLIC_JWT_SECRET;

if (!JWT_SECRET) {
  // In server runtime this should be set; warn in dev
  if (process.env.NODE_ENV !== 'production') console.warn('JWT_SECRET is not set. Set JWT_SECRET in .env.local for production.');
}

export function signToken(payload: JwtPayload, expiresIn: SignOptions['expiresIn'] = '1h') {
  return jwt.sign(payload, JWT_SECRET as jwt.Secret, { expiresIn });
}

export function verifyToken(token: string) {
  try {
    const opts: VerifyOptions = {};
    return jwt.verify(token, JWT_SECRET as jwt.Secret, opts) as JwtPayload | null;
  } catch {
    return null;
  }
}
