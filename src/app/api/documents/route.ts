/**
 * Nombre del archivo: src/app/api/documents/route.ts
 * Descripción: Endpoint REST para la carga, categorización y consulta de documentos clínicos.
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
    const category = searchParams.get('category');

    const where: any = {};
    if (user.role !== 'SUPER_ADMIN') {
      where.psychologistId = user.id;
    }
    if (patientId) where.patientId = patientId;
    if (category) where.category = category;

    const documents = await prisma.document.findMany({
      where,
      include: {
        ocrResult: true,
        patient: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ documents });
  } catch (error) {
    console.error('Error al consultar documentos:', error);
    return NextResponse.json({ error: 'Error al consultar documentos' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthSession();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await req.json();
    const { patientId, fileName, fileType, fileSize, fileUrl, category, description } = body;

    if (!patientId || !fileName || !fileUrl) {
      return NextResponse.json(
        { error: 'El paciente, nombre de archivo y enlace son obligatorios.' },
        { status: 400 }
      );
    }

    const document = await prisma.document.create({
      data: {
        patientId,
        psychologistId: user.id,
        fileName,
        fileType: fileType || 'application/pdf',
        fileSize: parseInt(fileSize || '1024', 10),
        fileUrl,
        category: category || 'OTHER',
        description: description || null,
        version: 1,
      },
    });

    await logAuditEvent({
      userId: user.id,
      targetPatientId: patientId,
      action: 'UPLOAD_DOCUMENT',
      resource: `/documentos/${document.id}`,
      details: `Subida de documento: ${fileName} (${category})`,
    });

    return NextResponse.json({ success: true, document }, { status: 201 });
  } catch (error) {
    console.error('Error al subir documento:', error);
    return NextResponse.json({ error: 'Error al registrar documento' }, { status: 500 });
  }
}
