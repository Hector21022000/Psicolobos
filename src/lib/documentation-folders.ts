/**
 * Nombre del archivo: src/lib/documentation-folders.ts
 * Descripción: Servicio para escaneo dinámico, extracción de contenido y gestión de la carpeta 'Carpetas de documentación'.
 * Fecha de última modificación: 2026-09-28
 * Autor: Psicolobos Development Team
 */

import fs from 'fs';
import path from 'path';
import { extractTextFromDocxBuffer } from '@/lib/anamnesis-parser';

export interface DocumentationFileItem {
  id: string;
  fileName: string;
  folderName: string;
  relativePath: string;
  ext: string;
  sizeBytes: number;
  updatedAt: string;
  previewText: string;
}

export interface DocumentationCategoryItem {
  folderName: string;
  displayName: string;
  fileCount: number;
  files: DocumentationFileItem[];
}

export interface DocumentationScanResult {
  basePath: string;
  categories: DocumentationCategoryItem[];
  totalFiles: number;
}

/**
 * Encuentra de forma segura la ruta base de 'Carpetas de documentación'
 */
export function getDocumentationFolderPath(): string {
  const rootDir = process.cwd();
  
  try {
    const entries = fs.readdirSync(rootDir, { withFileTypes: true });
    const docFolder = entries.find(
      (entry) => entry.isDirectory() && entry.name.toLowerCase().trim().startsWith('carpetas de documentacio')
    );

    if (docFolder) {
      return path.join(rootDir, docFolder.name);
    }
  } catch (e) {
    console.error('Error al listar directorio raíz:', e);
  }

  return path.join(rootDir, 'Carpetas de documentación ');
}

/**
 * Escanea dinámicamente 'Carpetas de documentación' y extrae vista previa de texto
 */
export async function scanDocumentationFolders(): Promise<DocumentationScanResult> {
  const basePath = getDocumentationFolderPath();

  if (!fs.existsSync(basePath)) {
    return { basePath, categories: [], totalFiles: 0 };
  }

  const entries = fs.readdirSync(basePath, { withFileTypes: true });
  const categories: DocumentationCategoryItem[] = [];
  let totalFiles = 0;

  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;

    if (entry.isDirectory()) {
      const folderName = entry.name;
      const categoryPath = path.join(basePath, folderName);
      const filesInFolder = fs.readdirSync(categoryPath, { withFileTypes: true });
      const fileItems: DocumentationFileItem[] = [];

      for (const fileEntry of filesInFolder) {
        if (fileEntry.name.startsWith('.')) continue;
        if (fileEntry.isFile()) {
          const filePath = path.join(categoryPath, fileEntry.name);
          const stats = fs.statSync(filePath);
          const ext = path.extname(fileEntry.name).toLowerCase();
          const relativePath = path.join(folderName, fileEntry.name);

          let previewText = '';
          try {
            if (ext === '.docx' || ext === '.doc') {
              const buffer = fs.readFileSync(filePath);
              previewText = extractTextFromDocxBuffer(buffer);
            } else if (ext === '.txt' || ext === '.md' || ext === '.json' || ext === '.csv') {
              previewText = fs.readFileSync(filePath, 'utf-8');
            } else if (ext === '.pdf') {
              previewText = `[Documento PDF: ${fileEntry.name}] - Documento oficial disponible para visualización y descarga.`;
            }
          } catch (e) {
            console.warn(`Error al leer archivo ${filePath}:`, e);
          }

          if (previewText.length > 5000) {
            previewText = previewText.slice(0, 5000) + '... [Texto truncado en vista previa]';
          }

          fileItems.push({
            id: Buffer.from(relativePath).toString('base64url'),
            fileName: fileEntry.name,
            folderName,
            relativePath,
            ext,
            sizeBytes: stats.size,
            updatedAt: stats.mtime.toISOString(),
            previewText,
          });

          totalFiles++;
        }
      }

      categories.push({
        folderName,
        displayName: folderName.trim(),
        fileCount: fileItems.length,
        files: fileItems,
      });
    } else if (entry.isFile()) {
      const filePath = path.join(basePath, entry.name);
      const stats = fs.statSync(filePath);
      const ext = path.extname(entry.name).toLowerCase();
      const relativePath = entry.name;

      let previewText = '';
      try {
        if (ext === '.docx' || ext === '.doc') {
          const buffer = fs.readFileSync(filePath);
          previewText = extractTextFromDocxBuffer(buffer);
        } else if (ext === '.txt' || ext === '.md') {
          previewText = fs.readFileSync(filePath, 'utf-8');
        }
      } catch (e) {}

      let rootCat = categories.find((c) => c.folderName === 'General');
      if (!rootCat) {
        rootCat = {
          folderName: 'General',
          displayName: 'Documentos Generales',
          fileCount: 0,
          files: [],
        };
        categories.unshift(rootCat);
      }

      rootCat.files.push({
        id: Buffer.from(relativePath).toString('base64url'),
        fileName: entry.name,
        folderName: 'General',
        relativePath,
        ext,
        sizeBytes: stats.size,
        updatedAt: stats.mtime.toISOString(),
        previewText,
      });
      rootCat.fileCount = rootCat.files.length;
      totalFiles++;
    }
  }

  return { basePath, categories, totalFiles };
}
