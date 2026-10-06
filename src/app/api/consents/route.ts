/**
 * Nombre del archivo: src/app/api/consents/route.ts
 * Descripción: Endpoint REST para la gestión y firma digital de consentimientos informados de pacientes.
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

    const consents = await prisma.consent.findMany({
      where: whereClause,
      include: {
        patient: { select: { firstName: true, lastName: true, identityDoc: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, consents });
  } catch (error) {
    console.error('Error al obtener consentimientos:', error);
    return NextResponse.json({ error: 'Error al consultar consentimientos' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthSession();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await req.json();
    const { patientId, title, consentType, contentText, signatureDataUrl } = body;

    if (!patientId || !title || !contentText) {
      return NextResponse.json({ error: 'Faltan campos obligatorios para el consentimiento' }, { status: 400 });
    }

    const consent = await prisma.consent.create({
      data: {
        patientId,
        psychologistId: user.id,
        title,
        consentType: consentType || 'TELEPSYCHOLOGY_CONSENT',
        contentText,
        status: signatureDataUrl ? 'SIGNED' : 'PENDING',
        signedAt: signatureDataUrl ? new Date() : null,
        signatureDataUrl: signatureDataUrl || null,
      },
      include: { patient: true },
    });

    await logAuditEvent({
      userId: user.id,
      targetPatientId: patientId,
      action: signatureDataUrl ? 'SIGN_CONSENT' : 'CREATE_CONSENT',
      resource: `/api/consents`,
      details: `Consentimiento informado "${title}" registrado para ${consent.patient.firstName} ${consent.patient.lastName}`,
    });

    return NextResponse.json({ success: true, consent }, { status: 201 });
  } catch (error) {
    console.error('Error al registrar consentimiento:', error);
    return NextResponse.json({ error: 'Error al guardar consentimiento' }, { status: 500 });
  }
}
