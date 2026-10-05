/**
 * Nombre del archivo: src/app/api/sessions/route.ts
 * Descripción: Endpoint REST para la creación y consulta de sesiones clínicas y agendamiento.
 * Fecha de última modificación: 2026-09-18
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
    const status = searchParams.get('status');

    const where: any = {};
    if (user.role !== 'SUPER_ADMIN') {
      where.psychologistId = user.id;
    }
    if (patientId) where.patientId = patientId;
    if (status) where.status = status;

    const sessions = await prisma.session.findMany({
      where,
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            photoUrl: true,
          },
        },
      },
      orderBy: { sessionDate: 'desc' },
    });

    return NextResponse.json({ sessions });
  } catch (error) {
    console.error('Error al consultar sesiones:', error);
    return NextResponse.json({ error: 'Error interno al consultar sesiones' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthSession();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await req.json();
    const {
      patientId,
      sessionDate,
      startTime,
      durationMinutes,
      modality,
      status,
      objective,
      observations,
      interventions,
      patientResponse,
      evolution,
      assignedHomework,
      agreements,
      nextSessionPlan,
      privateNotes,
      nextSessionDate,
    } = body;

    if (!patientId || !sessionDate) {
      return NextResponse.json(
        { error: 'Debe seleccionar un paciente y una fecha para la sesión.' },
        { status: 400 }
      );
    }

    const session = await prisma.session.create({
      data: {
        patientId,
        psychologistId: user.id,
        sessionDate: new Date(sessionDate),
        startTime: startTime || '10:00',
        durationMinutes: parseInt(durationMinutes || '50', 10),
        modality: modality || 'PRESENCIAL',
        status: status || 'SCHEDULED',
        objective: objective || null,
        observations: observations || null,
        interventions: interventions || null,
        patientResponse: patientResponse || null,
        evolution: evolution || null,
        assignedHomework: assignedHomework || null,
        agreements: agreements || null,
        nextSessionPlan: nextSessionPlan || null,
        privateNotes: privateNotes || null,
        nextSessionDate: nextSessionDate ? new Date(nextSessionDate) : null,
      },
      include: { patient: true },
    });

    // Si se especificó agendar próxima sesión automáticamente
    if (nextSessionDate) {
      const nextDate = new Date(nextSessionDate);
      const endDate = new Date(nextDate.getTime() + (durationMinutes || 50) * 60000);

      await prisma.appointment.create({
        data: {
          patientId,
          psychologistId: user.id,
          title: `Sesión de Seguimiento - ${session.patient.firstName} ${session.patient.lastName}`,
          startDateTime: nextDate,
          endDateTime: endDate,
          modality: modality || 'PRESENCIAL',
          status: 'SCHEDULED',
          notes: nextSessionPlan || 'Sesión agendada desde el registro de la sesión anterior.',
        },
      });
    }

    await logAuditEvent({
      userId: user.id,
      targetPatientId: patientId,
      action: 'CREATE_SESSION',
      resource: `/sesiones/${session.id}`,
      details: `Registro de sesión clínica (${modality})`,
    });

    return NextResponse.json({ success: true, session }, { status: 201 });
  } catch (error) {
    console.error('Error al registrar sesión:', error);
    return NextResponse.json({ error: 'Error al registrar la sesión' }, { status: 500 });
  }
}
