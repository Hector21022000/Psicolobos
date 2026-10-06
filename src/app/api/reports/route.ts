/**
 * Nombre del archivo: src/app/api/reports/route.ts
 * Descripción: Endpoint REST para la gestión de informes clínicos (Crear, Listar, Actualizar).
 * Fecha de última modificación: 2026-09-18
 * Autor: Psicolobos Development Team
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthSession();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get('patientId');

    // Aislamiento ESTRICTO: Cada usuario ve SOLO sus registros
    const whereClause: any = { psychologistId: user.id };
    if (patientId) {
      whereClause.patientId = patientId;
    }

    const reports = await prisma.report.findMany({
      where: whereClause,
      include: {
        patient: {
          select: { firstName: true, lastName: true, identityDoc: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, reports });
  } catch (error) {
    console.error('Error al listar informes:', error);
    return NextResponse.json({ error: 'Error al obtener informes' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthSession();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await req.json();
    const { patientId, title, reportType, contentHtml, status } = body;

    if (!patientId || !title || !contentHtml) {
      return NextResponse.json({ error: 'Faltan campos requeridos para el informe' }, { status: 400 });
    }

    const reportCount = await prisma.report.count({ where: { psychologistId: user.id } });
    const reportNumber = `INF-${new Date().getFullYear()}-${(reportCount + 1).toString().padStart(4, '0')}`;

    const report = await prisma.report.create({
      data: {
        patientId,
        psychologistId: user.id,
        reportNumber,
        title,
        reportType: reportType || 'CLINICAL_SUMMARY',
        contentHtml,
        status: status || 'DRAFT',
      },
      include: {
        patient: true,
      },
    });

    await logAuditEvent({
      userId: user.id,
      targetPatientId: patientId,
      action: 'CREATE_REPORT',
      resource: `/api/reports`,
      details: `Informe ${report.reportNumber} (${title}) creado para el paciente ${report.patient.firstName} ${report.patient.lastName}`,
    });

    return NextResponse.json({ success: true, report }, { status: 201 });
  } catch (error) {
    console.error('Error al crear informe:', error);
    return NextResponse.json({ error: 'Error al registrar el informe' }, { status: 500 });
  }
}
