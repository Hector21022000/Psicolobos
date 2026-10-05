/**
 * Nombre del archivo: src/app/api/ai/assistant/route.ts
 * Descripción: Endpoint REST para la generación asistida por IA de resúmenes, preguntas y borradores.
 * Fecha de última modificación: 2026-09-18
 * Autor: Psicolobos Development Team
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';
import { generateClinicalAiAssistance } from '@/lib/ai-engine';
import { logAuditEvent } from '@/lib/audit';

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthSession();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await req.json();
    const { patientId } = body;

    if (!patientId) {
      return NextResponse.json({ error: 'Debe especificar el ID del paciente' }, { status: 400 });
    }

    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      include: {
        clinicalHistory: true,
        sessions: { orderBy: { sessionDate: 'desc' }, take: 5 },
        evaluations: { orderBy: { evaluationDate: 'desc' }, take: 3 },
        diagnoses: { where: { isPrimary: true }, take: 2 },
      },
    });

    if (!patient) {
      return NextResponse.json({ error: 'Paciente no encontrado' }, { status: 404 });
    }

    if (user.role !== 'SUPER_ADMIN' && patient.psychologistId !== user.id) {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    // Calcular edad
    const age = patient.birthDate
      ? new Date().getFullYear() - new Date(patient.birthDate).getFullYear()
      : 30;

    const aiResult = await generateClinicalAiAssistance({
      patientName: `${patient.firstName} ${patient.lastName}`,
      age,
      clinicalHistory: patient.clinicalHistory,
      sessions: patient.sessions.map((s) => ({
        sessionDate: s.sessionDate.toISOString().split('T')[0],
        objective: s.objective,
        evolution: s.evolution,
        interventions: s.interventions,
      })),
      evaluations: patient.evaluations.map((e) => ({
        evaluationName: e.evaluationName,
        scoresJson: e.scoresJson,
        clinicalInterpretation: e.clinicalInterpretation,
      })),
      diagnoses: patient.diagnoses.map((d) => ({
        code: d.code,
        name: d.name,
        system: d.system,
        status: d.status,
      })),
    });

    await logAuditEvent({
      userId: user.id,
      targetPatientId: patientId,
      action: 'VIEW_PATIENT_RECORD',
      resource: `/asistente-ia/${patientId}`,
      details: 'Generación de resumen clínico asistido por IA',
    });

    return NextResponse.json({ success: true, aiResult });
  } catch (error) {
    console.error('Error en Asistente de IA:', error);
    return NextResponse.json(
      { error: 'No se pudo generar la asistencia de IA en este momento' },
      { status: 500 }
    );
  }
}
