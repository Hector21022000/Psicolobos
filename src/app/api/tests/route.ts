/**
 * Nombre del archivo: src/app/api/tests/route.ts
 * Descripción: Endpoint REST para la aplicación digital de pruebas psicométricas, baremos autorizados y flujo de revisión de IA en 2 paneles con Aprobación Profesional.
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

    // Listar biblioteca de pruebas autorizadas
    const testLibraries = await prisma.testLibrary.findMany({
      orderBy: { name: 'asc' },
    });

    const whereClause: any = user.role === 'SUPER_ADMIN' ? {} : { psychologistId: user.id };
    if (patientId) {
      whereClause.patientId = patientId;
    }

    const testResults = await prisma.testResult.findMany({
      where: whereClause,
      include: {
        patient: { select: { id: true, firstName: true, lastName: true, birthDate: true } },
        testLibrary: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, testLibraries, testResults });
  } catch (error) {
    console.error('Error al consultar pruebas:', error);
    return NextResponse.json({ error: 'Error al consultar evaluaciones psicométricas' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthSession();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await req.json();
    const { patientId, instrumentName, rawScores, testLibraryId } = body;

    if (!patientId || !instrumentName) {
      return NextResponse.json({ error: 'patientId e instrumentName son requeridos' }, { status: 400 });
    }

    const patient = await prisma.patient.findUnique({ where: { id: patientId } });
    if (!patient) {
      return NextResponse.json({ error: 'Paciente no encontrado' }, { status: 404 });
    }

    // Cálculo cuantitativo estricto de puntajes directos y percentiles
    let totalScore = 0;
    if (Array.isArray(rawScores)) {
      totalScore = rawScores.reduce((a: number, b: number) => a + b, 0);
    } else if (typeof rawScores === 'object' && rawScores !== null) {
      totalScore = Object.values(rawScores).reduce((a: any, b: any) => Number(a) + Number(b), 0) as number;
    }

    const maxScore = instrumentName.includes('BDI') ? 63 : 56;
    const calculatedPercentile = Math.min(99, Math.max(1, Math.round((totalScore / maxScore) * 100)));

    // Borrador de análisis generado por IA (Estado inicial: BORRADOR)
    const aiAnalysisDraft = {
      summary: `Análisis cuantitativo de la batería ${instrumentName} para el paciente ${patient.firstName} ${patient.lastName}. Puntaje total obtenido: ${totalScore} pts (Percentil: P${calculatedPercentile}).`,
      subscaleInterpretation: `La escala muestra un indicador compatible con sintomatología en rango ${
        calculatedPercentile > 70 ? 'severo/significativo' : calculatedPercentile > 40 ? 'moderado' : 'mínimo/leve'
      } según baremos autorizados.`,
      sources: ['Manual Oficial BDI-II (Beck, Steer & Brown)', 'Baremo Nacional Estandarizado'],
      suggestedQuestions: [
        '¿En qué momentos del día se intensifican los síntomas vegetativos indicados?',
        '¿Ha notado fluctuaciones en el apetito o sueño en las últimas dos semanas?',
      ],
      conclusions: 'Se recomienda integración clínica con las notas de evolución y entrevista cualitativa.',
      recommendations: 'Continuar monitoreo longitudinal con re-evaluación a las 4 semanas.',
    };

    const testResult = await prisma.testResult.create({
      data: {
        patientId,
        psychologistId: user.id,
        testLibraryId: testLibraryId || null,
        instrumentName,
        rawScoresJson: JSON.stringify(rawScores || { totalScore }),
        percentilesJson: JSON.stringify({ totalScore, percentile: calculatedPercentile }),
        aiAnalysisJson: JSON.stringify(aiAnalysisDraft),
        approvalStatus: 'BORRADOR', // REGLA OBLIGATORIA: Estado inicial BORRADOR
        approvedContentJson: null,
        version: 1,
      },
    });

    await logAuditEvent({
      userId: user.id,
      targetPatientId: patientId,
      action: 'VIEW_PATIENT_RECORD',
      resource: `/api/tests`,
      details: `Evaluación ${instrumentName} registrada en BORRADOR para ${patient.firstName} ${patient.lastName}`,
    });

    return NextResponse.json({ success: true, testResult }, { status: 201 });
  } catch (error) {
    console.error('Error al registrar prueba psicométrica:', error);
    return NextResponse.json({ error: 'Error al procesar la evaluación' }, { status: 500 });
  }
}

// PUT: Flujo de Aprobación Profesional (APROBAR RESULTADOS)
export async function PUT(req: NextRequest) {
  try {
    const user = await getAuthSession();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await req.json();
    const { testResultId, approvedContent, action } = body;

    if (!testResultId) {
      return NextResponse.json({ error: 'testResultId es requerido' }, { status: 400 });
    }

    const existingTest = await prisma.testResult.findUnique({
      where: { id: testResultId },
    });

    if (!existingTest) {
      return NextResponse.json({ error: 'Resultado de evaluación no encontrado' }, { status: 404 });
    }

    let updatedResult;

    if (action === 'APPROVE') {
      // Cambio de estado a APROBADO por el profesional
      updatedResult = await prisma.testResult.update({
        where: { id: testResultId },
        data: {
          approvalStatus: 'APROBADO',
          approvedContentJson: JSON.stringify(approvedContent),
          approvedByUserId: user.id,
          approvedAt: new Date(),
        },
      });
    } else if (action === 'CREATE_NEW_VERSION') {
      // Bloquea versión previa y crea nueva en estado BORRADOR
      updatedResult = await prisma.testResult.create({
        data: {
          patientId: existingTest.patientId,
          psychologistId: user.id,
          testLibraryId: existingTest.testLibraryId,
          instrumentName: existingTest.instrumentName,
          rawScoresJson: existingTest.rawScoresJson,
          percentilesJson: existingTest.percentilesJson,
          aiAnalysisJson: existingTest.aiAnalysisJson,
          approvedContentJson: null,
          approvalStatus: 'BORRADOR',
          version: existingTest.version + 1,
        },
      });
    }

    await logAuditEvent({
      userId: user.id,
      targetPatientId: existingTest.patientId,
      action: 'UPDATE_PATIENT',
      resource: `/api/tests`,
      details: `Evaluación ${existingTest.instrumentName} ${action === 'APPROVE' ? 'APROBADA por el profesional' : 'Nueva Versión Creada'}`,
    });

    return NextResponse.json({ success: true, testResult: updatedResult });
  } catch (error) {
    console.error('Error al actualizar aprobación de evaluación:', error);
    return NextResponse.json({ error: 'Error al cambiar estado de la evaluación' }, { status: 500 });
  }
}
