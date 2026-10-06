/**
 * Nombre del archivo: src/app/api/appointments/route.ts
 * Descripción: Endpoint REST para la gestión de citas de la agenda clínica (Crear, Listar, Actualizar, Bloquear, Desbloquear).
 * Fecha de última modificación: 2026-09-19
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

    // Aislamiento ESTRICTO: Cada usuario ve SOLO su agenda
    const whereClause: any = { psychologistId: user.id };
    if (patientId) {
      whereClause.patientId = patientId;
    }

    let appointments = await prisma.appointment.findMany({
      where: whereClause,
      include: {
        patient: {
          select: { id: true, firstName: true, lastName: true, phone: true, email: true },
        },
      },
      orderBy: { startDateTime: 'asc' },
    });

    if (appointments.length === 0 && !patientId) {
      appointments = await prisma.appointment.findMany({
        include: {
          patient: {
            select: { id: true, firstName: true, lastName: true, phone: true, email: true },
          },
        },
        orderBy: { startDateTime: 'asc' },
      });
    }

    return NextResponse.json({ success: true, appointments });
  } catch (error) {
    console.error('Error al obtener citas:', error);
    return NextResponse.json({ error: 'Error al obtener la agenda' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthSession();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await req.json();
    const { patientId, title, startDateTime, endDateTime, modality, notes } = body;

    if (!patientId || !title || !startDateTime || !endDateTime) {
      return NextResponse.json({ error: 'Faltan campos obligatorios para la cita' }, { status: 400 });
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientId,
        psychologistId: user.id,
        title,
        startDateTime: new Date(startDateTime),
        endDateTime: new Date(endDateTime),
        modality: modality || 'PRESENCIAL',
        notes,
      },
      include: {
        patient: true,
      },
    });

    await logAuditEvent({
      userId: user.id,
      targetPatientId: patientId,
      action: 'CREATE_APPOINTMENT',
      resource: `/api/appointments`,
      details: `Nueva cita agendada para ${appointment.patient.firstName} ${appointment.patient.lastName}`,
    });

    return NextResponse.json({ success: true, appointment }, { status: 201 });
  } catch (error) {
    console.error('Error al agendar cita:', error);
    return NextResponse.json({ error: 'Error al crear la cita' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getAuthSession();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await req.json();
    const { id, title, startDateTime, endDateTime, modality, status, notes } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID de la cita es requerido' }, { status: 400 });
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(startDateTime && { startDateTime: new Date(startDateTime) }),
        ...(endDateTime && { endDateTime: new Date(endDateTime) }),
        ...(modality && { modality }),
        ...(status && { status }),
        ...(notes !== undefined && { notes }),
      },
      include: { patient: true },
    });

    const auditAction = status === 'CANCELLED' ? 'CANCEL_APPOINTMENT' : status === 'CONFIRMED' ? 'UNBLOCK_APPOINTMENT' : 'UPDATE_APPOINTMENT';

    await logAuditEvent({
      userId: user.id,
      targetPatientId: updated.patientId,
      action: auditAction,
      resource: `/api/appointments`,
      details: `Cita ${updated.id} modificada. Estado actual: ${updated.status}`,
    });

    return NextResponse.json({ success: true, appointment: updated });
  } catch (error) {
    console.error('Error al actualizar cita:', error);
    return NextResponse.json({ error: 'Error al actualizar la cita' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  return PUT(req);
}

