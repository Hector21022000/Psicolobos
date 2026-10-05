/**
 * Nombre del archivo: src/lib/audit.ts
 * Descripción: Servicio para el registro de auditoría inmutable de acciones clínicas y administrativas.
 * Fecha de última modificación: 2026-09-19
 * Autor: Psicolobos Development Team
 */

import { prisma } from './prisma';

export interface AuditLogInput {
  userId: string;
  targetPatientId?: string | null;
  action:
    | 'LOGIN'
    | 'LOGOUT'
    | 'VIEW_PATIENT_RECORD'
    | 'CREATE_PATIENT'
    | 'UPDATE_PATIENT'
    | 'ARCHIVE_PATIENT'
    | 'CREATE_SESSION'
    | 'UPDATE_SESSION'
    | 'DELETE_SESSION'
    | 'UPDATE_DIAGNOSIS'
    | 'UPLOAD_DOCUMENT'
    | 'RUN_OCR'
    | 'GENERATE_REPORT'
    | 'CREATE_REPORT'
    | 'EXPORT_REPORT_PDF'
    | 'CREATE_APPOINTMENT'
    | 'UPDATE_APPOINTMENT'
    | 'CANCEL_APPOINTMENT'
    | 'UNBLOCK_APPOINTMENT'
    | 'SIGN_CONSENT'
    | 'CREATE_CONSENT'
    | 'AI_ASSISTANCE_GENERATED'
    | 'ADMIN_ACTIVATE_USER'
    | 'ADMIN_DEACTIVATE_USER'
    | 'ADMIN_VIEW_AUDIT'
    | 'APPLY_DOCUMENTATION_TEMPLATE';
  resource: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  details?: Record<string, unknown> | string | null;
  result?: 'SUCCESS' | 'DENIED' | 'ERROR';
}

export async function logAuditEvent(input: AuditLogInput) {
  try {
    const detailsString = typeof input.details === 'object' ? JSON.stringify(input.details) : input.details;

    await prisma.auditLog.create({
      data: {
        userId: input.userId,
        targetPatientId: input.targetPatientId || null,
        action: input.action,
        resource: input.resource,
        ipAddress: input.ipAddress || '127.0.0.1',
        userAgent: input.userAgent || 'Psicolobos Internal Client',
        details: detailsString || null,
        result: input.result || 'SUCCESS',
      },
    });
  } catch (error) {
    console.error('Error writing audit log:', error);
  }
}
