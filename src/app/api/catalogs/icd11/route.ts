/**
 * Nombre del archivo: src/app/api/catalogs/icd11/route.ts
 * Descripción: API endpoint para buscar diagnósticos CIE-11 usando la API oficial de la OMS.
 * Fecha de última modificación: 2026-10-02
 * Autor: Psicolobos Development Team
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { searchIcd11 } from '@/lib/who-icd-api';

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthSession();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ error: 'Debes proporcionar un término de búsqueda (q)' }, { status: 400 });
    }

    const results = await searchIcd11(query);

    return NextResponse.json({ results });
  } catch (error: any) {
    console.error('Error en API proxy de CIE-11:', error);
    
    // Identificamos el error de credenciales faltantes
    if (error.message && error.message.includes('credenciales')) {
      return NextResponse.json({ 
        error: 'Las credenciales de la API de la OMS no están configuradas.',
        setupRequired: true
      }, { status: 500 });
    }

    return NextResponse.json({ error: 'Error al consultar la CIE-11 oficial' }, { status: 500 });
  }
}
