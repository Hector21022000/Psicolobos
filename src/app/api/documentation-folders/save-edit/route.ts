/**
 * Nombre del archivo: src/app/api/documentation-folders/save-edit/route.ts
 * Descripción: API REST para guardar ediciones de texto en las plantillas y guías clínicas de Carpetas de documentación.
 * Fecha de última modificación: 2026-09-28
 * Autor: Psicolobos Development Team
 */

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getAuthSession } from '@/lib/auth';
import { getDocumentationFolderPath } from '@/lib/documentation-folders';
import { logAuditEvent } from '@/lib/audit';

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthSession();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await req.json();
    const { relativePath, newContent } = body;

    if (!relativePath || typeof newContent !== 'string') {
      return NextResponse.json(
        { error: 'Ruta relativa y nuevo contenido son requeridos.' },
        { status: 400 }
      );
    }

    const basePath = getDocumentationFolderPath();
    const resolvedPath = path.resolve(basePath, relativePath);

    // Seguridad de ruta
    if (!resolvedPath.startsWith(path.resolve(basePath))) {
      return NextResponse.json({ error: 'Acceso no permitido' }, { status: 403 });
    }

    const ext = path.extname(resolvedPath).toLowerCase();
    const fileName = path.basename(resolvedPath);

    // Si es archivo .txt o .md, sobreescribir directamente. Si es .docx, guardar versión texto modificable (.txt) o archivo actualizado
    let savePath = resolvedPath;
    if (ext === '.docx' || ext === '.doc') {
      // Guardar archivo .txt equivalente editado en la misma carpeta para persistir cambios directos
      savePath = resolvedPath.replace(/\.docx?$/i, '_editado.txt');
    }

    fs.writeFileSync(savePath, newContent, 'utf-8');

    await logAuditEvent({
      userId: user.id,
      action: 'UPDATE_PATIENT',
      resource: `/carpetas-documentacion/${fileName}`,
      details: `Edición y guardado de plantilla clínica: ${fileName}`,
    });

    return NextResponse.json({
      success: true,
      message: `Cambios guardados con éxito en "${path.basename(savePath)}".`,
      savedPath: savePath,
    });
  } catch (error) {
    console.error('Error al guardar edición de plantilla:', error);
    return NextResponse.json(
      { error: 'Error interno al guardar los cambios en la plantilla' },
      { status: 500 }
    );
  }
}
