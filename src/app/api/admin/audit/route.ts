/**
 * Nombre del archivo: src/app/api/admin/audit/route.ts
 * Descripción: Endpoint REST para la consulta del registro inmutable de auditoría (Super Admin).
 * Fecha de última modificación: 2026-09-18
 * Autor: Psicolobos Development Team
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';

export async function GET() {
  try {
    const user = await getAuthSession();
    if (!user || user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Acceso restringido a Administradores del Sistema.' },
        { status: 403 }
      );
    }

    const auditLogs = await prisma.auditLog.findMany({
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true, role: true },
        },
        targetPatient: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
      orderBy: { timestamp: 'desc' },
      take: 100,
    });

    await logAuditEvent({
      userId: user.id,
      action: 'ADMIN_VIEW_AUDIT',
      resource: '/admin/audit',
      details: 'Super Admin consultó la bitácora general de auditoría',
    });

    return NextResponse.json({ auditLogs });
  } catch (error) {
    console.error('Error al obtener registros de auditoría:', error);
    return NextResponse.json({ error: 'Error al consultar auditoría' }, { status: 500 });
  }
}
