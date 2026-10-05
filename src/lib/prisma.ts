/**
 * Nombre del archivo: src/lib/prisma.ts
 * Descripción: Singleton para el cliente de Prisma ORM en Next.js.
 * Fecha de última modificación: 2026-09-18
 * Autor: Psicolobos Development Team
 */

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
