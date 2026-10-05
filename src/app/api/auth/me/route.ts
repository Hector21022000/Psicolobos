/**
 * Nombre del archivo: src/app/api/auth/me/route.ts
 * Descripción: Endpoint para obtener la información de la sesión activa del usuario.
 * Fecha de última modificación: 2026-09-18
 * Autor: Psicolobos Development Team
 */

import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';

export async function GET() {
  const user = await getAuthSession();
  if (!user) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, user });
}
