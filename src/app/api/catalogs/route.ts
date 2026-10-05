/**
 * Nombre del archivo: src/app/api/catalogs/route.ts
 * Descripción: Endpoint REST para la búsqueda y carga/indexación de documentos oficiales CIE-11, DSM-5-TR y manuales clínicos.
 * Fecha de última modificación: 2026-09-18
 * Autor: Psicolobos Development Team
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { searchDiagnosticCatalog } from '@/lib/catalog-data';
import { getAuthSession } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthSession();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';
    const system = (searchParams.get('system') as 'CIE_11' | 'DSM_5_TR') || undefined;

    // 1. Códigos del catálogo estandarizado
    const results = searchDiagnosticCatalog(query, system);

    // 2. Documentos indexados cargados por el profesional
    const indexedDocuments = await prisma.clinicalDocumentIndex.findMany({
      where: system ? { system } : undefined,
      orderBy: { indexedAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      count: results.length,
      catalog: results,
      indexedDocuments,
    });
  } catch (error) {
    console.error('Error al consultar catálogo de diagnósticos:', error);
    return NextResponse.json({ error: 'Error al consultar catálogo' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthSession();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await req.json();
    const { title, system, author, rawContent } = body;

    if (!title || !rawContent) {
      return NextResponse.json({ error: 'Título y contenido del documento son requeridos' }, { status: 400 });
    }

    const indexedDoc = await prisma.clinicalDocumentIndex.create({
      data: {
        title,
        system: system || 'CIE_11',
        author: author || 'OMS / APA',
        rawContent,
      },
    });

    await logAuditEvent({
      userId: user.id,
      action: 'UPLOAD_DOCUMENT',
      resource: `/api/catalogs`,
      details: `Documento clínico indexado: "${title}" (${system || 'CIE_11'})`,
    });

    return NextResponse.json({ success: true, indexedDocument: indexedDoc }, { status: 201 });
  } catch (error) {
    console.error('Error al indexar documento clínico:', error);
    return NextResponse.json({ error: 'Error al cargar documento clínico' }, { status: 500 });
  }
}
