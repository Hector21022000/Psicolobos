/**
 * Nombre del archivo: src/app/api/audit/route.ts
 * Descripción: Endpoint REST para la consulta del registro de auditoría clínica (Audit Trail) HIPAA/GDPR.
 * Fecha de última modificación: 2026-09-18
 * Autor: Psicolobos Development Team
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthSession();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const action = searchParams.get('action');

    const whereClause: any = user.role === 'SUPER_ADMIN' ? {} : { userId: user.id };
    if (action) {
      whereClause.action = action;
    }

    const auditLogs = await prisma.auditLog.findMany({
      where: whereClause,
      include: {
        user: {
          select: { firstName: true, lastName: true, role: true, email: true },
        },
        targetPatient: {
          select: { firstName: true, lastName: true },
        },
      },
      orderBy: { timestamp: 'desc' },
      take: limit,
    });

    return NextResponse.json({ success: true, auditLogs });
  } catch (error) {
    console.error('Error al consultar logs de auditoría:', error);
    return NextResponse.json({ error: 'Error al consultar logs de auditoría' }, { status: 500 });
  }
}
