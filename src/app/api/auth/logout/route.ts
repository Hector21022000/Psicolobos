/**
 * Nombre del archivo: src/app/api/auth/logout/route.ts
 * Descripción: Endpoint para el cierre de sesión seguro.
 * Fecha de última modificación: 2026-09-18
 * Autor: Psicolobos Development Team
 */

import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set('psicolobos_session', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });
  return response;
}
