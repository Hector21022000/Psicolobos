/**
 * Nombre del archivo: src/lib/auth.ts
 * Descripción: Manejo de autenticación, hash de contraseñas bcrypt, tokens JWT y verificación de roles.
 * Fecha de última modificación: 2026-09-18
 * Autor: Psicolobos Development Team
 */

import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { prisma } from './prisma';

const JWT_SECRET_BYTES = new TextEncoder().encode(
  process.env.JWT_SECRET || 'psicolobos_secure_jwt_token_key_clinical_2026_antigravity'
);

export interface AuthUser {
  id: string;
  email: string;
  role: 'SUPER_ADMIN' | 'PSYCHOLOGIST' | 'ASSISTANT';
  firstName: string;
  lastName: string;
  colegiatura?: string | null;
  specialty?: string | null;
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export async function signToken(payload: AuthUser): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET_BYTES);
}

export async function verifyToken(token: string): Promise<AuthUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET_BYTES);
    return payload as unknown as AuthUser;
  } catch {
    return null;
  }
}

export async function getAuthSession(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('psicolobos_session')?.value;
    if (!token) return null;

    const userPayload = await verifyToken(token);
    if (!userPayload) return null;

    // Verificar en la base de datos que la cuenta siga activa
    const dbUser = await prisma.user.findUnique({
      where: { id: userPayload.id },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        colegiatura: true,
        specialty: true,
        isActive: true,
      },
    });

    if (!dbUser || !dbUser.isActive) return null;

    return {
      id: dbUser.id,
      email: dbUser.email,
      role: dbUser.role as AuthUser['role'],
      firstName: dbUser.firstName,
      lastName: dbUser.lastName,
      colegiatura: dbUser.colegiatura,
      specialty: dbUser.specialty,
    };
  } catch {
    return null;
  }
}
