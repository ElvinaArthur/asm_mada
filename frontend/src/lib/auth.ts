import { SignJWT, jwtVerify } from 'jose';
import { NextRequest } from 'next/server';
import type { JWTPayload, AuthUser } from '@/types';

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'asm-alumni-secret-key-change-in-production'
);

export async function signToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): Promise<string> {
  return await new SignJWT(payload as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(secret);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

export async function getAuthUser(req: NextRequest): Promise<AuthUser | null> {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;

  const token = authHeader.slice(7);
  const payload = await verifyToken(token);
  if (!payload) return null;

  const { sql } = await import('./db');
  const result = await sql`
    SELECT id, email, "firstName", "lastName", role, "isVerified", "photoUrl"
    FROM users WHERE id = ${payload.id} AND "isActive" = true
  `;

  if (result.rows.length === 0) return null;
  const user = result.rows[0];
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    isVerified: Boolean(user.isVerified),
    photoUrl: user.photoUrl,
  };
}

export function requireAuth() {
  return { status: 401, body: { success: false, message: 'Non autorisé' } };
}

export function requireAdmin(user: AuthUser | null) {
  if (!user) return { status: 401, body: { success: false, message: 'Non autorisé' } };
  if (user.role !== 'admin') return { status: 403, body: { success: false, message: 'Accès refusé' } };
  return null;
}
