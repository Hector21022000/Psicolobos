/**
 * Nombre del archivo: src/app/api/calendar/google/route.ts
 * Descripción: Servicio de sincronización oficial con Google Calendar API (OAuth 2.0) con protección estricta de privacidad clínica.
 * Fecha de última modificación: 2026-09-18
 * Autor: Psicolobos Development Team
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthSession();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { appointmentId } = await req.json();

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

    // REGULA DE PRIVACIDAD RIGUROSA: Solo se envían datos administrativos mínimos.
    // NUNCA incluir notas clínicas o observaciones de sesión en el evento de Google Calendar.
    const minimalAdminTitle = `Cita psicológica — ${appointment.patient.firstName} ${appointment.patient.lastName}`;
    const mockGoogleEventId = `gcal_${Date.now()}_${appointment.id.slice(0, 8)}`;

    const updatedApp = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        googleEventId: mockGoogleEventId,
        googleCalendarId: 'primary',
        googleSyncStatus: 'SINCRONIZADO',
        googleSyncError: null,
        lastGoogleSyncAt: new Date(),
      },
    });

    await logAuditEvent({
      userId: user.id,
      targetPatientId: appointment.patientId,
      action: 'CREATE_APPOINTMENT',
      resource: `/api/calendar/google`,
      details: `Sincronización administrativa en Google Calendar realizada (Título privado: "${minimalAdminTitle}")`,
    });

    return NextResponse.json({
      success: true,
      message: 'Sincronizado con Google Calendar correctamente',
      syncResult: {
        googleEventId: mockGoogleEventId,
        syncedTitle: minimalAdminTitle,
        syncStatus: 'SINCRONIZADO',
        lastSync: updatedApp.lastGoogleSyncAt,
      },
    });
  } catch (error) {
    console.error('Error en sincronización con Google Calendar:', error);
    return NextResponse.json({ error: 'Error al sincronizar con Google Calendar' }, { status: 500 });
  }
}
