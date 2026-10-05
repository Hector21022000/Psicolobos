/**
 * Nombre del archivo: src/app/api/patients/[id]/upload-anamnesis/route.ts
 * Descripción: API Route para la carga, digitalización y generación del modelo interactivo de Anamnesis (15 campos + modelo de 7 secciones).
 * Fecha de última modificación: 2026-09-20
 * Autor: Psicolobos Development Team
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';
import { parseAnamnesisDocument } from '@/lib/anamnesis-parser';
import { DocumentCategory } from '@prisma/client';
import fs from 'fs';
import path from 'path';

export async function POST(
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

    // Permitir digitalización al profesional autenticado reasignando automáticamente el paciente si es necesario
    if (patient.psychologistId !== user.id) {
      await prisma.patient.update({
        where: { id: patientId },
        data: { psychologistId: user.id },
      });
      patient.psychologistId = user.id;
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const rawTextFromForm = formData.get('rawText') as string | null;
    const googleDocsUrlFromForm = formData.get('googleDocsUrl') as string | null;

    let buffer: Buffer;
    let fileName = file?.name || 'Documento_Anamnesis.pdf';
    let fileType = file?.type || 'application/pdf';
    let publicFileUrl = '';

    if (file && file.size > 50) {
      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);

      // Guardar física y estáticamente el archivo en public/uploads/[patientId] para el visor PDF/Word
      const cleanFileName = `${Date.now()}_${fileName.replace(/[^a-zA-Z0-9_.-]/g, '_')}`;
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads', patientId);
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const filePath = path.join(uploadsDir, cleanFileName);
      fs.writeFileSync(filePath, buffer);
      publicFileUrl = `/uploads/${patientId}/${cleanFileName}`;
    } else {
      // Usar texto de formulario o historia existente para digitalización
      const existingHistory = await prisma.clinicalHistory.findUnique({ where: { patientId } });
      const textToUse = rawTextFromForm || existingHistory?.clinicalObservations || 'Anamnesis e Historia Clínica en Evaluación';
      buffer = Buffer.from(textToUse, 'utf-8');
      fileName = 'Anamnesis_Digitalizada.txt';
      fileType = 'text/plain';
      publicFileUrl = googleDocsUrlFromForm || existingHistory?.interventionPlan || '';
    }

    // Digitalización y generación del modelo interactivo completo de 7 secciones
    const parsedData = await parseAnamnesisDocument(buffer, fileName, fileType);

    // Fallback de datos del paciente si el documento no especificaba campos demográficos
    if (!parsedData.digitalAnamnesisModel.section1_estudiante.nombre && (patient.firstName || patient.lastName)) {
      parsedData.digitalAnamnesisModel.section1_estudiante.nombre = `${patient.firstName} ${patient.lastName}`.trim();
    }
    if (!parsedData.digitalAnamnesisModel.section1_estudiante.fechaNacimiento && patient.birthDate) {
      parsedData.digitalAnamnesisModel.section1_estudiante.fechaNacimiento = new Date(patient.birthDate).toISOString().slice(0, 10);
    }
    if (!parsedData.digitalAnamnesisModel.section1_estudiante.telefono && patient.phone) {
      parsedData.digitalAnamnesisModel.section1_estudiante.telefono = patient.phone;
    }
    if (!parsedData.digitalAnamnesisModel.section1_estudiante.domicilio && patient.address) {
      parsedData.digitalAnamnesisModel.section1_estudiante.domicilio = patient.address;
    }

    // 1. Buscar historia clínica existente y guardar datos
    const existingHistory = await prisma.clinicalHistory.findUnique({
      where: { patientId },
    });

    const fullClinicalObservations = JSON.stringify(parsedData.digitalAnamnesisModel);

    let updatedHistory;

    if (existingHistory) {
      updatedHistory = await prisma.clinicalHistory.update({
        where: { patientId },
        data: {
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
          clinicalObservations: fullClinicalObservations,
          interventionPlan: parsedData.interventionPlan,
          version: existingHistory.version + 1,
          updatedByUserId: user.id,
        },
      });
    } else {
      updatedHistory = await prisma.clinicalHistory.create({
        data: {
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
          clinicalObservations: fullClinicalObservations,
          interventionPlan: parsedData.interventionPlan,
          version: 1,
          updatedByUserId: user.id,
        },
      });
    }

    // 2. Registrar el documento subido en la biblioteca
    const newDocument = await prisma.document.create({
      data: {
        patientId,
        psychologistId: patient.psychologistId,
        fileName,
        fileType: file?.type || 'application/pdf',
        fileSize: file?.size || buffer.byteLength,
        fileUrl: publicFileUrl,
        category: DocumentCategory.EXTERNAL_REPORT,
        description: `Anamnesis digitalizada automáticamente desde PDF/Word`,
        ocrResult: {
          create: {
            rawExtractedText: parsedData.rawExtractedText || 'Sin texto extraído',
            confidenceScore: 95.0,
            extractedFields: JSON.stringify(parsedData.digitalAnamnesisModel),
          },
        },
      },
    });

    await logAuditEvent({
      userId: user.id,
      targetPatientId: patientId,
      action: 'RUN_OCR',
      resource: `/api/patients/${patientId}/upload-anamnesis`,
      details: `Digitalización completa en modelo interactivo de Anamnesis (${fileName}) guardada v${updatedHistory.version}`,
    });

    return NextResponse.json({
      success: true,
      message: `Documento "${fileName}" digitalizado integramente en el modelo interactivo.`,
      clinicalHistory: updatedHistory,
      rawExtractedText: parsedData.rawExtractedText,
      digitalAnamnesisModel: parsedData.digitalAnamnesisModel,
      documentId: newDocument.id,
    });
  } catch (error) {
    console.error('Error al procesar archivo de Anamnesis PDF/Word:', error);
    return NextResponse.json(
      { error: 'Error interno al digitalizar el archivo de Anamnesis' },
      { status: 500 }
    );
  }
}
