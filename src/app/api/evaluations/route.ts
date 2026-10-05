/**
 * Nombre del archivo: src/app/api/evaluations/route.ts
 * Descripción: Endpoint REST para la creación y consulta de evaluaciones e instrumentos psicológicos.
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

    const where: any = {};
    if (user.role !== 'SUPER_ADMIN') {
      where.psychologistId = user.id;
    }
    if (patientId) where.patientId = patientId;

    const evaluations = await prisma.evaluation.findMany({
      where,
      include: {
        patient: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
      orderBy: { evaluationDate: 'desc' },
    });

    return NextResponse.json({ evaluations });
  } catch (error) {
    console.error('Error al obtener evaluaciones:', error);
    return NextResponse.json({ error: 'Error al consultar evaluaciones' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthSession();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await req.json();
    const {
      patientId,
      evaluationName,
      instrumentName,
      version,
      evaluationDate,
      evaluatorName,
      reason,
      scoresJson,
      percentilesJson,
      scalesJson,
      qualitativeObservations,
      clinicalInterpretation,
    } = body;

    if (!patientId || !evaluationName || !instrumentName) {
      return NextResponse.json(
        { error: 'Debe especificar el paciente, el nombre de la evaluación y el instrumento.' },
        { status: 400 }
      );
    }

    const evaluation = await prisma.evaluation.create({
      data: {
        patientId,
        psychologistId: user.id,
        evaluationName,
        instrumentName,
        version: version || '1.0',
        evaluationDate: evaluationDate ? new Date(evaluationDate) : new Date(),
        evaluatorName: evaluatorName || `${user.firstName} ${user.lastName}`,
        reason: reason || null,
        scoresJson: typeof scoresJson === 'object' ? JSON.stringify(scoresJson) : scoresJson || null,
        percentilesJson: typeof percentilesJson === 'object' ? JSON.stringify(percentilesJson) : percentilesJson || null,
        scalesJson: typeof scalesJson === 'object' ? JSON.stringify(scalesJson) : scalesJson || null,
        qualitativeObservations: qualitativeObservations || null,
        clinicalInterpretation: clinicalInterpretation || null,
      },
    });

    await logAuditEvent({
      userId: user.id,
      targetPatientId: patientId,
      action: 'CREATE_SESSION',
      resource: `/evaluaciones/${evaluation.id}`,
      details: `Registro de evaluación: ${evaluationName} (${instrumentName})`,
    });

    return NextResponse.json({ success: true, evaluation }, { status: 201 });
  } catch (error) {
    console.error('Error al guardar evaluación:', error);
    return NextResponse.json({ error: 'Error al registrar evaluación' }, { status: 500 });
  }
}
