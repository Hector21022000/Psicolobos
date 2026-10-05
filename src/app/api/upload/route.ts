/**
 * Nombre del archivo: src/app/api/upload/route.ts
 * Descripción: Endpoint REST para la carga de archivos adjuntos (PDF, DOCX, imágenes) vinculados a sesiones y expedientes de pacientes.
 * Fecha de última modificación: 2026-09-30
 * Autor: Psicolobos Development Team
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthSession();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const patientId = (formData.get('patientId') as string) || '';
    const category = (formData.get('category') as string) || 'SESSION_ATTACHMENT';

    if (!file) {
      return NextResponse.json({ error: 'No se recibió ningún archivo.' }, { status: 400 });
    }

    const fileName = file.name;
    const fileType = file.type || 'application/pdf';
    const fileSize = file.size;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Subdirectorio de destino en public/uploads/
    const subFolder = patientId ? patientId : 'general';
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', subFolder);
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const cleanFileName = `${Date.now()}_${fileName.replace(/[^a-zA-Z0-9_.-]/g, '_')}`;
    const filePath = path.join(uploadsDir, cleanFileName);
    fs.writeFileSync(filePath, buffer);

    const publicFileUrl = `/uploads/${subFolder}/${cleanFileName}`;

    // Intentar extraer texto simple si el archivo es texto
    let extractedText = '';
    if (fileType.includes('text') || fileName.endsWith('.txt')) {
      extractedText = buffer.toString('utf-8');
    }

    // Si tenemos un patientId, guardar como Documento en la BD
    let documentId = '';
    if (patientId) {
      try {
        const document = await prisma.document.create({
          data: {
            patientId,
            psychologistId: user.id,
            fileName,
            fileType,
            fileSize,
            fileUrl: publicFileUrl,
            category: 'OTHER',
            description: `Documento adjunto a sesión clínica (${fileName})`,
            version: 1,
          },
        });
        documentId = document.id;

        await logAuditEvent({
          userId: user.id,
          targetPatientId: patientId,
          action: 'UPLOAD_DOCUMENT',
          resource: `/documentos/${document.id}`,
          details: `Carga de archivo adjunto a sesión: ${fileName}`,
        });
      } catch (err) {
        console.error('Error al registrar documento en BD:', err);
      }
    }

    return NextResponse.json({
      success: true,
      fileUrl: publicFileUrl,
      fileName,
      fileSize,
      fileType,
      documentId,
      extractedText,
    });
  } catch (error) {
    console.error('Error en el servicio de carga de archivos:', error);
    return NextResponse.json({ error: 'Error al procesar la carga del archivo' }, { status: 500 });
  }
}
