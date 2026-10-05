/**
 * Nombre del archivo: src/app/api/ocr/route.ts
 * Descripción: Endpoint REST para procesamiento OCR con Tesseract en documentos clínicos.
 * Fecha de última modificación: 2026-09-18
 * Autor: Psicolobos Development Team
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';
import { processDocumentOcr } from '@/lib/ocr';
import { logAuditEvent } from '@/lib/audit';

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthSession();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { documentId, imageBase64, imageUrl } = await req.json();

    if (!documentId) {
      return NextResponse.json({ error: 'documentId es requerido' }, { status: 400 });
    }

    const doc = await prisma.document.findUnique({
      where: { id: documentId },
      include: { patient: true },
    });

    if (!doc) {
      return NextResponse.json({ error: 'Documento no encontrado' }, { status: 404 });
    }

    const imageSource = imageBase64 || imageUrl || doc.fileUrl;
    if (!imageSource) {
      return NextResponse.json({ error: 'No hay URL o archivo de imagen válido para procesar OCR' }, { status: 400 });
    }

    const ocrExtraction = await processDocumentOcr(imageSource);

    const ocrResult = await prisma.ocrResult.upsert({
      where: { documentId },
      update: {
        rawExtractedText: ocrExtraction.text,
        confidenceScore: ocrExtraction.confidence * 100,
        extractedFields: JSON.stringify(ocrExtraction.extractedFields),
      },
      create: {
        documentId,
        rawExtractedText: ocrExtraction.text,
        confidenceScore: ocrExtraction.confidence * 100,
        extractedFields: JSON.stringify(ocrExtraction.extractedFields),
      },
    });

    await logAuditEvent({
      userId: user.id,
      targetPatientId: doc.patientId,
      action: 'RUN_OCR',
      resource: `/api/ocr`,
      details: `OCR completado para documento ${doc.fileName} (Confianza: ${(ocrExtraction.confidence * 100).toFixed(1)}%)`,
    });

    return NextResponse.json({
      success: true,
      ocrResult: {
        ...ocrResult,
        extractedFields: ocrExtraction.extractedFields,
      },
    });
  } catch (error) {
    console.error('Error en servicio OCR:', error);
    return NextResponse.json({ error: 'Error al procesar extracción OCR' }, { status: 500 });
  }
}
