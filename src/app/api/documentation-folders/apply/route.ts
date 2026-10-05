/**
 * Nombre del archivo: src/app/api/documentation-folders/apply/route.ts
 * Descripción: API REST para vincular y aplicar guías/plantillas de documentación clínica al expediente de un paciente.
 * Fecha de última modificación: 2026-09-28
 * Autor: Psicolobos Development Team
 */

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';
import { getDocumentationFolderPath } from '@/lib/documentation-folders';
import { parseAnamnesisDocument, extractTextFromDocxBuffer } from '@/lib/anamnesis-parser';

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthSession();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await req.json();
    const { patientId, relativePath, applyTarget } = body; // applyTarget: 'anamnesis' | 'session' | 'document'

    if (!patientId || !relativePath) {
      return NextResponse.json(
        { error: 'El ID del paciente y la ruta relativa del archivo son requeridos' },
        { status: 400 }
      );
    }

    // Verificar que el paciente existe y el usuario tiene acceso
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
    });

    if (!patient) {
      return NextResponse.json({ error: 'Paciente no encontrado' }, { status: 404 });
    }

    if (user.role !== 'SUPER_ADMIN' && patient.psychologistId !== user.id) {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const basePath = getDocumentationFolderPath();
    const resolvedPath = path.resolve(basePath, relativePath);

    if (!resolvedPath.startsWith(path.resolve(basePath)) || !fs.existsSync(resolvedPath)) {
      return NextResponse.json({ error: 'Archivo no encontrado' }, { status: 404 });
    }

    const fileName = path.basename(resolvedPath);
    const buffer = fs.readFileSync(resolvedPath);
    const stats = fs.statSync(resolvedPath);

    let message = '';
    let resultData: any = {};

    if (applyTarget === 'anamnesis' || relativePath.toLowerCase().includes('anamnesis')) {
      // Digitalizar y aplicar como Anamnesis e Historia Clínica
      const parsedData = await parseAnamnesisDocument(buffer, fileName);

      const updatedHistory = await prisma.clinicalHistory.upsert({
        where: { patientId },
        create: {
          patientId,
          reasonForConsultation: parsedData.reasonForConsultation,
          currentProblemHistory: parsedData.currentProblemHistory,
          personalBackground: parsedData.personalBackground,
          familyBackground: parsedData.familyBackground,
          medicalBackground: parsedData.medicalBackground,
          psychologicalBackground: parsedData.psychologicalBackground,
          educationalHistory: parsedData.educationalHistory,
          workHistory: parsedData.workHistory,
          socialHistory: parsedData.socialHistory,
          familyRelationships: parsedData.familyRelationships,
          habits: parsedData.habits,
          riskFactors: parsedData.riskFactors,
          protectiveFactors: parsedData.protectiveFactors,
          clinicalObservations: parsedData.clinicalObservations,
          interventionPlan: parsedData.interventionPlan,
          updatedByUserId: user.id,
        },
        update: {
          reasonForConsultation: parsedData.reasonForConsultation || undefined,
          currentProblemHistory: parsedData.currentProblemHistory || undefined,
          personalBackground: parsedData.personalBackground || undefined,
          familyBackground: parsedData.familyBackground || undefined,
          medicalBackground: parsedData.medicalBackground || undefined,
          psychologicalBackground: parsedData.psychologicalBackground || undefined,
          educationalHistory: parsedData.educationalHistory || undefined,
          workHistory: parsedData.workHistory || undefined,
          socialHistory: parsedData.socialHistory || undefined,
          familyRelationships: parsedData.familyRelationships || undefined,
          habits: parsedData.habits || undefined,
          riskFactors: parsedData.riskFactors || undefined,
          protectiveFactors: parsedData.protectiveFactors || undefined,
          clinicalObservations: parsedData.clinicalObservations || undefined,
          interventionPlan: parsedData.interventionPlan || undefined,
          updatedByUserId: user.id,
          version: { increment: 1 },
        },
      });

      message = `Plantilla "${fileName}" aplicada exitosamente a la Anamnesis del expediente.`;
      resultData = { clinicalHistory: updatedHistory, digitalModel: parsedData.digitalAnamnesisModel };
    } else if (applyTarget === 'session' || relativePath.toLowerCase().includes('sesion') || relativePath.toLowerCase().includes('sesión')) {
      // Iniciar/crear borrador de sesión basado en la guía
      const ext = path.extname(fileName).toLowerCase();
      let guideText = '';
      if (ext === '.docx' || ext === '.doc') {
        guideText = extractTextFromDocxBuffer(buffer);
      } else {
        guideText = buffer.toString('utf-8');
      }

      const newSession = await prisma.session.create({
        data: {
          patientId,
          psychologistId: user.id,
          sessionDate: new Date(),
          modality: 'PRESENCIAL',
          status: 'SCHEDULED',
          objective: `Sesión guiada con plantilla: ${fileName}`,
          observations: guideText.slice(0, 1500),
          topicsAddressed: 'Aplicación de Guía Clínica para Primera Sesión',
          techniquesUsed: 'Entrevista estructurada / Protocolo de primera sesión',
          privateNotes: `[Texto de Guía de Referencia]:\n${guideText}`,
          isDraft: true,
        },
      });

      message = `Borrador de Sesión iniciado con la guía "${fileName}".`;
      resultData = { session: newSession };
    } else {
      // Registrar como documento institucional adjunto en la pestaña de Documentos
      const newDoc = await prisma.document.create({
        data: {
          patientId,
          psychologistId: user.id,
          fileName: `[Guía Institucional] ${fileName}`,
          fileType: 'application/octet-stream',
          fileSize: stats.size,
          fileUrl: `/api/documentation-folders/download?path=${encodeURIComponent(relativePath)}`,
          category: 'EVALUATION',
          description: `Documento clínico cargado desde la carpeta institucional '${path.dirname(relativePath)}'`,
        },
      });

      message = `Documento "${fileName}" adjuntado al expediente del paciente.`;
      resultData = { document: newDoc };
    }

    await logAuditEvent({
      userId: user.id,
      targetPatientId: patientId,
      action: 'APPLY_DOCUMENTATION_TEMPLATE',
      resource: `/pacientes/${patientId}`,
      details: `Aplicada plantilla institucional '${fileName}' al expediente (Modo: ${applyTarget || 'auto'})`,
    });

    return NextResponse.json({ success: true, message, data: resultData });
  } catch (error) {
    console.error('Error al aplicar plantilla al expediente:', error);
    return NextResponse.json(
      { error: 'Error interno al vincular la plantilla al expediente' },
      { status: 500 }
    );
  }
}
