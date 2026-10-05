/**
 * Nombre del archivo: src/app/api/documentation-folders/download/route.ts
 * Descripción: API REST para descargar archivos binarios (DOCX, PDF, etc.) desde las Carpetas de documentación.
 * Fecha de última modificación: 2026-09-28
 * Autor: Psicolobos Development Team
 */

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getAuthSession } from '@/lib/auth';
import { getDocumentationFolderPath } from '@/lib/documentation-folders';

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthSession();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get('id');
    const relativePath = searchParams.get('path');

    let targetRelativePath = '';
    if (relativePath) {
      targetRelativePath = relativePath;
    } else if (fileId) {
      targetRelativePath = Buffer.from(fileId, 'base64url').toString('utf-8');
    }

    if (!targetRelativePath) {
      return NextResponse.json({ error: 'Identificador de archivo requerido' }, { status: 400 });
    }

    const basePath = getDocumentationFolderPath();
    const resolvedPath = path.resolve(basePath, targetRelativePath);

    // Verificación de seguridad de ruta (prevenir path traversal)
    if (!resolvedPath.startsWith(path.resolve(basePath))) {
      return NextResponse.json({ error: 'Acceso no permitido' }, { status: 403 });
    }

    if (!fs.existsSync(resolvedPath)) {
      return NextResponse.json({ error: 'Archivo no encontrado' }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(resolvedPath);
    const fileName = path.basename(resolvedPath);
    const ext = path.extname(fileName).toLowerCase();

    let contentType = 'application/octet-stream';
    if (ext === '.docx') contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    else if (ext === '.doc') contentType = 'application/msword';
    else if (ext === '.pdf') contentType = 'application/pdf';
    else if (ext === '.txt') contentType = 'text/plain; charset=utf-8';

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${encodeURIComponent(fileName)}"`,
      },
    });
  } catch (error) {
    console.error('Error al descargar archivo:', error);
    return NextResponse.json({ error: 'Error al procesar la descarga' }, { status: 500 });
  }
}
