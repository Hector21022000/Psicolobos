/**
 * Nombre del archivo: src/app/api/admin/users/route.ts
 * Descripción: Endpoint REST para la administración de cuentas de usuario de psicólogos (Super Admin).
 * Fecha de última modificación: 2026-09-18
 * Autor: Psicolobos Development Team
 */

import { NextRequest, NextResponse } from 'next/server';
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

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        colegiatura: true,
        specialty: true,
        phone: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            patients: true,
            sessions: true,
            reports: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error al obtener usuarios admin:', error);
    return NextResponse.json({ error: 'Error al consultar usuarios' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getAuthSession();
    if (!user || user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Acceso restringido a Super Admin' }, { status: 403 });
    }

    const body = await req.json();
    const { targetUserId, isActive, role } = body;

    if (!targetUserId) {
      return NextResponse.json({ error: 'Falta el ID del usuario objetivo' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: {
        isActive: isActive !== undefined ? Boolean(isActive) : undefined,
        role: role || undefined,
      },
    });

    await logAuditEvent({
      userId: user.id,
      action: isActive ? 'ADMIN_ACTIVATE_USER' : 'ADMIN_DEACTIVATE_USER',
      resource: `/admin/users/${targetUserId}`,
      details: `Cambio de estado de usuario ${updatedUser.email} a ${isActive ? 'ACTIVO' : 'INACTIVO'}`,
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Error al actualizar usuario admin:', error);
    return NextResponse.json({ error: 'Error al modificar usuario' }, { status: 500 });
  }
}
