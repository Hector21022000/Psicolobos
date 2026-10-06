/**
 * Nombre del archivo: src/app/api/communications/route.ts
 * Descripción: Endpoint REST para el centro de comunicaciones (WhatsApp Business API, Email) y envío de recordatorios 24h.
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
    const channel = searchParams.get('channel');
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    // Aislamiento ESTRICTO: Cada usuario ve SOLO sus registros
    const whereClause: any = { psychologistId: user.id };
    if (channel) {
      whereClause.channel = channel;
    }

    const logs = await prisma.communicationLog.findMany({
      where: whereClause,
      include: {
        patient: { select: { firstName: true, lastName: true, phone: true, email: true } },
      },
      orderBy: { sentAt: 'desc' },
      take: limit,
    });

    return NextResponse.json({ success: true, logs });
  } catch (error) {
    console.error('Error al listar comunicaciones:', error);
    return NextResponse.json({ error: 'Error al consultar log de comunicaciones' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthSession();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await req.json();
    const { appointmentId, channel, actionType } = body;

    if (!appointmentId) {
      return NextResponse.json({ error: 'appointmentId es requerido' }, { status: 400 });
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { patient: true },
    });

    if (!appointment) {
      return NextResponse.json({ error: 'Cita no encontrada' }, { status: 404 });
    }

    const targetChannel = channel || 'WHATSAPP';
    const recipient = targetChannel === 'WHATSAPP' ? (appointment.patient.whatsapp || appointment.patient.phone || '') : (appointment.patient.email || '');

    // Construcción de la plantilla del mensaje de recordatorio de 24 horas
    const formattedDate = new Date(appointment.startDateTime).toLocaleDateString('es-ES');
    const formattedTime = new Date(appointment.startDateTime).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

    const messageText = `Hola ${appointment.patient.firstName}, te recordamos que tienes una cita psicológica con Dr(a). ${user.firstName} ${user.lastName} el ${formattedDate} a las ${formattedTime} (Modalidad: ${appointment.modality}). ¿Confirmas tu asistencia? [CONFIRMAR / REPROGRAMAR]`;

    // Si la acción simulada es confirmación directa del paciente:
    if (actionType === 'PATIENT_CONFIRM') {
      await prisma.appointment.update({
        where: { id: appointmentId },
        data: { status: 'CONFIRMED', reminderSent: true },
      });
    } else {
      await prisma.appointment.update({
        where: { id: appointmentId },
        data: { reminderSent: true },
      });
    }

    const commLog = await prisma.communicationLog.create({
      data: {
        psychologistId: user.id,
        patientId: appointment.patientId,
        appointmentId: appointment.id,
        channel: targetChannel,
        messageType: actionType === 'PATIENT_CONFIRM' ? 'CONFIRMATION' : 'REMINDER_24H',
        recipient: recipient || 'Sin contacto registrado',
        status: actionType === 'PATIENT_CONFIRM' ? 'CONFIRMADO' : 'ENVIADO',
        resultMessage: `Mensaje: "${messageText}"`,
      },
    });

    await logAuditEvent({
      userId: user.id,
      targetPatientId: appointment.patientId,
      action: 'CREATE_APPOINTMENT',
      resource: `/api/communications`,
      details: `Comunicación ${targetChannel} (${actionType || 'REMINDER'}) procesada para ${appointment.patient.firstName} ${appointment.patient.lastName}`,
    });

    return NextResponse.json({ success: true, commLog, messageText });
  } catch (error) {
    console.error('Error en servicio de comunicaciones:', error);
    return NextResponse.json({ error: 'Error al enviar comunicación' }, { status: 500 });
  }
}
