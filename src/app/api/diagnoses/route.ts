/**
 * Nombre del archivo: src/app/api/diagnoses/route.ts
 * Descripción: Endpoint REST para la asignación y versionado de diagnósticos CIE-11 y DSM-5-TR.
 * Fecha de última modificación: 2026-09-18
 * Autor: Psicolobos Development Team
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';
import { searchDiagnosticCatalog } from '@/lib/catalog-data';

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthSession();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const catalogSearch = searchParams.get('catalogSearch');
    const systemFilter = searchParams.get('system') as 'CIE_11' | 'DSM_5_TR' | undefined;
    const patientId = searchParams.get('patientId');

    // Búsqueda en catálogo oficial autorizaciones
    if (catalogSearch !== null) {
      const results = searchDiagnosticCatalog(catalogSearch || '', systemFilter);
      return NextResponse.json({ catalog: results });
    }

    const where: any = {};
    if (user.role !== 'SUPER_ADMIN') {
      where.psychologistId = user.id;
    }
    if (patientId) where.patientId = patientId;

    const diagnoses = await prisma.diagnosis.findMany({
      where,
      include: {
        patient: { select: { id: true, firstName: true, lastName: true } },
        history: { orderBy: { createdAt: 'desc' } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ diagnoses });
  } catch (error) {
    console.error('Error al obtener diagnósticos:', error);
    return NextResponse.json({ error: 'Error al consultar diagnósticos' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthSession();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await req.json();
    const { patientId, system, code, name, description, status, isPrimary, clinicalNotes } = body;

    if (!patientId || !code || !name) {
      return NextResponse.json(
        { error: 'Debe especificar el paciente, el código y la denominación del diagnóstico.' },
        { status: 400 }
      );
    }

    // Si este diagnóstico se establece como principal, quitar la marca de principal a los previos
    if (isPrimary) {
      await prisma.diagnosis.updateMany({
        where: { patientId, isPrimary: true },
        data: { isPrimary: false },
      });
    }

    const diagnosis = await prisma.diagnosis.create({
      data: {
        patientId,
        psychologistId: user.id,
        system: system || 'CIE_11',
        code,
        name,
        description: description || null,
        status: status || 'HYPOTHESIS',
        isPrimary: Boolean(isPrimary),
        clinicalNotes: clinicalNotes || null,
        history: {
          create: {
            previousStatus: status || 'HYPOTHESIS',
            newStatus: status || 'HYPOTHESIS',
            changedByUserId: user.id,
            reason: 'Registro inicial de diagnóstico.',
          },
        },
      },
    });

    await logAuditEvent({
      userId: user.id,
      targetPatientId: patientId,
      action: 'UPDATE_DIAGNOSIS',
      resource: `/diagnosticos/${diagnosis.id}`,
      details: `Registro de diagnóstico: ${code} - ${name} (${status})`,
    });

    return NextResponse.json({ success: true, diagnosis }, { status: 201 });
  } catch (error) {
    console.error('Error al registrar diagnóstico:', error);
    return NextResponse.json({ error: 'Error al registrar diagnóstico' }, { status: 500 });
  }
}
