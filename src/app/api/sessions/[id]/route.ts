/**
 * Nombre del archivo: src/app/api/sessions/[id]/route.ts
 * Descripción: API route para obtener, actualizar y eliminar un registro de sesión clínica por su ID.
 * Fecha de última modificación: 2026-09-30
 * Autor: Psicolobos Development Team
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthSession();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;

    const session = await prisma.session.findUnique({
      where: { id },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            identityDoc: true,
          },
        },
      },
    });

    if (!session) {
      return NextResponse.json({ error: 'Sesión no encontrada' }, { status: 404 });
    }

    if (user.role !== 'SUPER_ADMIN' && session.psychologistId !== user.id) {
      return NextResponse.json({ error: 'No tienes permiso para ver esta sesión' }, { status: 403 });
    }

    return NextResponse.json({ session });
  } catch (error) {
    console.error('Error al obtener sesión:', error);
    return NextResponse.json({ error: 'Error interno al consultar la sesión' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthSession();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;

    const existingSession = await prisma.session.findUnique({
      where: { id },
    });

    if (!existingSession) {
      return NextResponse.json({ error: 'Sesión no encontrada' }, { status: 404 });
    }

    if (user.role !== 'SUPER_ADMIN' && existingSession.psychologistId !== user.id) {
      return NextResponse.json({ error: 'No tienes permiso para editar esta sesión' }, { status: 403 });
    }

    const body = await req.json();
    const {
      sessionDate,
      startTime,
      endTime,
      durationMinutes,
      modality,
      status,
      sessionNumber,
      objective,
      observations,
      topicsAddressed,
      observedBehaviors,
      interventions,
      techniquesUsed,
      patientResponse,
      evolution,
      agreements,
      assignedHomework,
      nextSessionPlan,
      privateNotes,
      nextSessionDate,
      isDraft,
    } = body;

    const updatedSession = await prisma.session.update({
      where: { id },
      data: {
        ...(sessionDate && { sessionDate: new Date(sessionDate) }),
        ...(startTime !== undefined && { startTime }),
        ...(endTime !== undefined && { endTime }),
        ...(durationMinutes !== undefined && { durationMinutes: Number(durationMinutes) }),
        ...(modality && { modality }),
        ...(status && { status }),
        ...(sessionNumber !== undefined && { sessionNumber: Number(sessionNumber) }),
        ...(objective !== undefined && { objective }),
        ...(observations !== undefined && { observations }),
        ...(topicsAddressed !== undefined && { topicsAddressed }),
        ...(observedBehaviors !== undefined && { observedBehaviors }),
        ...(interventions !== undefined && { interventions }),
        ...(techniquesUsed !== undefined && { techniquesUsed }),
        ...(patientResponse !== undefined && { patientResponse }),
        ...(evolution !== undefined && { evolution }),
        ...(agreements !== undefined && { agreements }),
        ...(assignedHomework !== undefined && { assignedHomework }),
        ...(nextSessionPlan !== undefined && { nextSessionPlan }),
        ...(privateNotes !== undefined && { privateNotes }),
        ...(nextSessionDate !== undefined && {
          nextSessionDate: nextSessionDate ? new Date(nextSessionDate) : null,
        }),
        ...(isDraft !== undefined && { isDraft }),
        version: { increment: 1 },
      },
      include: { patient: true },
    });

    await logAuditEvent({
      userId: user.id,
      targetPatientId: updatedSession.patientId,
      action: 'UPDATE_SESSION',
      resource: `/sesiones/${updatedSession.id}`,
      details: `Edición de registro clínico de sesión`,
    });

    return NextResponse.json({ success: true, session: updatedSession });
  } catch (error) {
    console.error('Error al actualizar sesión:', error);
    return NextResponse.json({ error: 'Error al actualizar la sesión' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthSession();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;

    const existingSession = await prisma.session.findUnique({
      where: { id },
    });

    if (!existingSession) {
      return NextResponse.json({ error: 'Sesión no encontrada' }, { status: 404 });
    }

    if (user.role !== 'SUPER_ADMIN' && existingSession.psychologistId !== user.id) {
      return NextResponse.json({ error: 'No tienes permiso para eliminar esta sesión' }, { status: 403 });
    }

    await prisma.session.delete({
      where: { id },
    });

    await logAuditEvent({
      userId: user.id,
      targetPatientId: existingSession.patientId,
      action: 'DELETE_SESSION',
      resource: `/sesiones/${id}`,
      details: `Eliminación de registro clínico de sesión`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar sesión:', error);
    return NextResponse.json({ error: 'Error al eliminar la sesión' }, { status: 500 });
  }
}
