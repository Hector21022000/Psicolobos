/**
 * Nombre del archivo: src/app/api/documentation-folders/route.ts
 * Descripción: API REST para listar y escanear dinámicamente las carpetas de documentación clínica.
 * Fecha de última modificación: 2026-09-28
 * Autor: Psicolobos Development Team
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { scanDocumentationFolders } from '@/lib/documentation-folders';

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthSession();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const result = await scanDocumentationFolders();
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('Error al escanear carpetas de documentación:', error);
    return NextResponse.json(
      { error: 'Error al escanear carpetas de documentación' },
      { status: 500 }
    );
  }
}
