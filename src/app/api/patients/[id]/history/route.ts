/**
 * Nombre del archivo: src/app/api/patients/[id]/history/route.ts
 * Descripción: Endpoint REST para la actualización versionada y eliminación/reseteo de la historia clínica del paciente.
 * Fecha de última modificación: 2026-09-20
 * Autor: Psicolobos Development Team
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';
import fs from 'fs';
import path from 'path';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthSession();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id: patientId } = await params;
    const body = await req.json();

    const patient = await prisma.patient.findUnique({ where: { id: patientId } });
    if (!patient) {
      return NextResponse.json({ error: 'Paciente no encontrado' }, { status: 404 });
    }

    // Permitir actualización de historia clínica al profesional autenticado reasignando automáticamente si es necesario
    if (patient.psychologistId !== user.id) {
      await prisma.patient.update({
        where: { id: patientId },
        data: { psychologistId: user.id },
      });
      patient.psychologistId = user.id;
    }

    const existingHistory = await prisma.clinicalHistory.findUnique({
      where: { patientId },
    });

    let updatedHistory;

    if (existingHistory) {
      updatedHistory = await prisma.clinicalHistory.update({
        where: { patientId },
        data: {
          reasonForConsultation: body.reasonForConsultation ?? existingHistory.reasonForConsultation,
          currentProblemHistory: body.currentProblemHistory ?? existingHistory.currentProblemHistory,
          personalBackground: body.personalBackground ?? existingHistory.personalBackground,
          familyBackground: body.familyBackground ?? existingHistory.familyBackground,
          medicalBackground: body.medicalBackground ?? existingHistory.medicalBackground,
          psychologicalBackground: body.psychologicalBackground ?? existingHistory.psychologicalBackground,
          educationalHistory: body.educationalHistory ?? existingHistory.educationalHistory,
          workHistory: body.workHistory ?? existingHistory.workHistory,
          socialHistory: body.socialHistory ?? existingHistory.socialHistory,
          familyRelationships: body.familyRelationships ?? existingHistory.familyRelationships,
          habits: body.habits ?? existingHistory.habits,
          riskFactors: body.riskFactors ?? existingHistory.riskFactors,
          protectiveFactors: body.protectiveFactors ?? existingHistory.protectiveFactors,
          clinicalObservations: body.clinicalObservations ?? existingHistory.clinicalObservations,
          interventionPlan: body.interventionPlan ?? existingHistory.interventionPlan,
          version: existingHistory.version + 1,
          updatedByUserId: user.id,
        },
      });
    } else {
      const { rawExtractedText, ...cleanBody } = body;
      updatedHistory = await prisma.clinicalHistory.create({
        data: {
          patientId,
          reasonForConsultation: cleanBody.reasonForConsultation || null,
          currentProblemHistory: cleanBody.currentProblemHistory || null,
          personalBackground: cleanBody.personalBackground || null,
          familyBackground: cleanBody.familyBackground || null,
          medicalBackground: cleanBody.medicalBackground || null,
          psychologicalBackground: cleanBody.psychologicalBackground || null,
          educationalHistory: cleanBody.educationalHistory || null,
          workHistory: cleanBody.workHistory || null,
          socialHistory: cleanBody.socialHistory || null,
          familyRelationships: cleanBody.familyRelationships || null,
          habits: cleanBody.habits || null,
          riskFactors: cleanBody.riskFactors || null,
          protectiveFactors: cleanBody.protectiveFactors || null,
          clinicalObservations: cleanBody.clinicalObservations || null,
          interventionPlan: cleanBody.interventionPlan || null,
          version: 1,
          updatedByUserId: user.id,
        },
      });
    }

    await logAuditEvent({
      userId: user.id,
      targetPatientId: patientId,
      action: 'UPDATE_PATIENT',
      resource: `/pacientes/${patientId}/historia`,
      details: `Actualización de historia clínica (Versión ${updatedHistory.version})`,
    });

    return NextResponse.json({ success: true, clinicalHistory: updatedHistory });
  } catch (error) {
    console.error('Error al actualizar historia clínica:', error);
    return NextResponse.json({ error: 'Error al actualizar historia clínica' }, { status: 500 });
  }
}



export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthSession();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id: patientId } = await params;

    const patient = await prisma.patient.findUnique({ where: { id: patientId } });
    if (!patient) {
      return NextResponse.json({ error: 'Paciente no encontrado' }, { status: 404 });
    }

    // 1. Eliminar historia clínica de la BD
    const existingHistory = await prisma.clinicalHistory.findUnique({
      where: { patientId },
    });

    if (existingHistory) {
      await prisma.clinicalHistory.delete({
        where: { patientId },
      });
    }

    // 2. Buscar y eliminar todos los documentos de Anamnesis, Informes Externos y OCRs adjuntos
    const allPatientDocs = await prisma.document.findMany({
      where: { patientId },
      include: { ocrResult: true },
    });

    const anamnesisDocs = allPatientDocs.filter((doc) => {
      const desc = (doc.description || '').toLowerCase();
      const name = (doc.fileName || '').toLowerCase();
      const cat = doc.category;
      return (
        desc.includes('anamnesis') ||
        name.includes('anamnesis') ||
        cat === 'EXTERNAL_REPORT' ||
        doc.ocrResult !== null
      );
    });

    for (const doc of anamnesisDocs) {
      if (doc.ocrResult) {
        await prisma.ocrResult.deleteMany({
          where: { documentId: doc.id },
        });
      }

      if (doc.fileUrl && doc.fileUrl.startsWith('/uploads/')) {
        const fullPath = path.join(process.cwd(), 'public', doc.fileUrl);
        if (fs.existsSync(fullPath)) {
          try {
            fs.unlinkSync(fullPath);
          } catch (e) {
            console.warn('No se pudo borrar archivo físico de Anamnesis:', e);
          }
        }
      }

      await prisma.document.delete({
        where: { id: doc.id },
      });
    }

    await logAuditEvent({
      userId: user.id,
      targetPatientId: patientId,
      action: 'UPDATE_PATIENT',
      resource: `/pacientes/${patientId}/historia`,
      details: `Eliminación completa de Anamnesis, Historia Clínica y archivos adjuntos`,
    });

    return NextResponse.json({
      success: true,
      message: 'Anamnesis, Historia Clínica y documentos asociados eliminados correctamente.',
    });
  } catch (error) {
    console.error('Error al eliminar historia clínica:', error);
    return NextResponse.json(
      { error: 'Error interno al eliminar la Anamnesis' },
      { status: 500 }
    );
  }
}

