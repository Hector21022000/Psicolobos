/**
 * Nombre del archivo: src/app/api/ai/route.ts
 * Descripción: Endpoint REST para la generación de resúmenes clínicos e interacción en vivo con la Terminal de IA.
 * Fecha de última modificación: 2026-09-18
 * Autor: Psicolobos Development Team
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';
import { generateClinicalAiAssistance, processInteractiveAiPrompt } from '@/lib/ai-engine';
import { logAuditEvent } from '@/lib/audit';

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthSession();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { patientId, prompt } = await req.json();

    let patient: any = null;

    if (patientId) {
      patient = await prisma.patient.findUnique({
        where: { id: patientId },
        include: {
          clinicalHistory: true,
          sessions: {
            orderBy: { sessionDate: 'desc' },
            take: 5,
          },
          evaluations: {
            orderBy: { evaluationDate: 'desc' },
            take: 5,
          },
          diagnoses: true,
        },
      });
    }

    // Si viene un prompt interactivo para la Terminal
    if (prompt) {
      const patientContext = patient ? {
        patientName: `${patient.firstName} ${patient.lastName}`,
        age: patient.birthDate ? new Date().getFullYear() - new Date(patient.birthDate).getFullYear() : 30,
        clinicalHistory: patient.clinicalHistory,
      } : null;

      const { text, engineUsed } = await processInteractiveAiPrompt(prompt, patientContext);

      await logAuditEvent({
        userId: user.id,
        targetPatientId: patient?.id,
        action: 'AI_ASSISTANCE_GENERATED',
        resource: `/api/ai`,
        details: `Comando ejecutado en Terminal IA (Gemini): "${prompt.slice(0, 50)}"`,
      });

      return NextResponse.json({ success: true, interactiveResponse: text, engineUsed });
    }

    if (!patientId) {
      return NextResponse.json({ error: 'patientId o prompt es requerido' }, { status: 400 });
    }

    if (!patient) {
      return NextResponse.json({ error: 'Paciente no encontrado' }, { status: 404 });
    }

    // Calcular edad aproximada
    let age = 30;
    if (patient.birthDate) {
      const birth = new Date(patient.birthDate);
      const now = new Date();
      age = now.getFullYear() - birth.getFullYear();
    }

    const aiResult = await generateClinicalAiAssistance({
      patientName: `${patient.firstName} ${patient.lastName}`,
      age,
      clinicalHistory: patient.clinicalHistory ? {
        reasonForConsultation: patient.clinicalHistory.reasonForConsultation,
        currentProblemHistory: patient.clinicalHistory.currentProblemHistory,
        riskFactors: patient.clinicalHistory.riskFactors,
        protectiveFactors: patient.clinicalHistory.protectiveFactors,
      } : null,
      sessions: patient.sessions.map((s: any) => ({
        sessionDate: new Date(s.sessionDate).toLocaleDateString('es-ES'),
        objective: s.objective,
        evolution: s.evolution,
        interventions: s.interventions,
      })),
      evaluations: patient.evaluations.map((e: any) => ({
        evaluationName: e.evaluationName,
        scoresJson: e.scoresJson,
        clinicalInterpretation: e.clinicalInterpretation,
      })),
      diagnoses: patient.diagnoses.map((d: any) => ({
        code: d.code,
        name: d.name,
        system: d.system,
        status: d.status,
      })),
    });

    await logAuditEvent({
      userId: user.id,
      targetPatientId: patient.id,
      action: 'AI_ASSISTANCE_GENERATED',
      resource: `/api/ai`,
      details: `Resumen de IA generado para el paciente ${patient.firstName} ${patient.lastName}`,
    });

    return NextResponse.json({ success: true, aiResult });
  } catch (error) {
    console.error('Error en motor de IA:', error);
    return NextResponse.json({ error: 'Error al procesar la asistencia por IA' }, { status: 500 });
  }
}

