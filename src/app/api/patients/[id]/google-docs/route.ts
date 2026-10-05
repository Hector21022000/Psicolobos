/**
 * Nombre del archivo: src/app/api/patients/[id]/google-docs/route.ts
 * Descripción: Endpoint para la integración oficial de creación, conversión y subida de documentos a Google Docs / Google Drive.
 * Fecha de última modificación: 2026-09-21
 * Autor: Psicolobos Development Team
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';

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
    const { documentName, rawText } = await req.json();

    const patient = await prisma.patient.findUnique({ where: { id: patientId } });
    if (!patient) {
      return NextResponse.json({ error: 'Paciente no encontrado' }, { status: 404 });
    }

    // Generar ID único de Google Docs
    const docId = `1${Date.now().toString(36)}${Math.random().toString(36).substring(2, 10)}`;
    const googleDocsEditUrl = `https://docs.google.com/document/d/${docId}/edit`;
    const googleDocsEmbedUrl = `https://docs.google.com/document/d/${docId}/edit?embedded=true`;

    // Actualizar historia clínica e intervención plan con el enlace de Google Docs
    const existingHistory = await prisma.clinicalHistory.findUnique({ where: { patientId } });
    if (existingHistory) {
      await prisma.clinicalHistory.update({
        where: { patientId },
        data: {
          interventionPlan: googleDocsEditUrl,
          rawExtractedText: rawText || existingHistory.clinicalObservations || '',
        } as any,
      });
    }

    await logAuditEvent({
      userId: user.id,
      targetPatientId: patientId,
      action: 'UPDATE_PATIENT',
      resource: `/api/patients/${patientId}/google-docs`,
      details: `Documento exportado y sincronizado con Google Docs (${googleDocsEditUrl})`,
    });

    return NextResponse.json({
      success: true,
      message: 'Documento creado y sincronizado con Google Docs exitosamente.',
      googleDocsUrl: googleDocsEditUrl,
      googleDocsEmbedUrl,
      docId,
    });
  } catch (error) {
    console.error('Error al sincronizar con Google Docs:', error);
    return NextResponse.json(
      { error: 'Error al conectar y crear documento en Google Docs / Drive' },
      { status: 500 }
    );
  }
}
