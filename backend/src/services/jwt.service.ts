import jwt from 'jsonwebtoken';
import type { UserRole } from '@prisma/client';

type JwtPayload = {
  userId: string;
  email: string;
  role: UserRole;
};

const JWT_SECRET = process.env.JWT_SECRET ?? 'replace-with-secret';

export function signToken(payload: JwtPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}
