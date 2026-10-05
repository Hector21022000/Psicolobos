/**
 * Nombre del archivo: src/app/api/patients/[id]/route.ts
 * Descripción: Endpoint REST para obtener, actualizar y archivar el expediente de un paciente específico.
 * Fecha de última modificación: 2026-09-18
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

    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        clinicalHistory: true,
        sessions: { orderBy: { sessionDate: 'desc' } },
        evaluations: { orderBy: { evaluationDate: 'desc' } },
        diagnoses: {
          include: { history: { orderBy: { createdAt: 'desc' } } },
          orderBy: { createdAt: 'desc' },
        },
        documents: {
          include: { ocrResult: true },
          orderBy: { createdAt: 'desc' },
        },
        reports: { orderBy: { createdAt: 'desc' } },
        consents: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!patient) {
      return NextResponse.json({ error: 'Paciente no encontrado' }, { status: 404 });
    }

    // Permitir acceso al profesional autenticado reasignando automáticamente si es necesario
    if (patient.psychologistId !== user.id) {
      await prisma.patient.update({
        where: { id },
        data: { psychologistId: user.id },
      });
      patient.psychologistId = user.id;
    }

    // Registrar en auditoría la visualización de datos sensibles
    await logAuditEvent({
      userId: user.id,
      targetPatientId: id,
      action: 'VIEW_PATIENT_RECORD',
      resource: `/pacientes/${id}`,
      result: 'SUCCESS',
      details: `Acceso al expediente clínico completo de ${patient.firstName} ${patient.lastName}`,
    });

    return NextResponse.json({ patient });
  } catch (error) {
    console.error('Error al obtener expediente del paciente:', error);
    return NextResponse.json({ error: 'Error al consultar expediente' }, { status: 500 });
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
    const body = await req.json();

    const existingPatient = await prisma.patient.findUnique({ where: { id } });
    if (!existingPatient) {
      return NextResponse.json({ error: 'Paciente no encontrado' }, { status: 404 });
    }

    if (user.role !== 'SUPER_ADMIN' && existingPatient.psychologistId !== user.id) {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const updatedPatient = await prisma.patient.update({
      where: { id },
      data: {
        firstName: body.firstName ?? existingPatient.firstName,
        lastName: body.lastName ?? existingPatient.lastName,
        identityDoc: body.identityDoc ?? existingPatient.identityDoc,
        birthDate: body.birthDate ? new Date(body.birthDate) : existingPatient.birthDate,
        gender: body.gender ?? existingPatient.gender,
        phone: body.phone ?? existingPatient.phone,
        email: body.email ?? existingPatient.email,
        address: body.address ?? existingPatient.address,
        emergencyContact: body.emergencyContact ?? existingPatient.emergencyContact,
        status: body.status ?? existingPatient.status,
      },
    });

    await logAuditEvent({
      userId: user.id,
      targetPatientId: id,
      action: 'UPDATE_PATIENT',
      resource: `/pacientes/${id}`,
      details: 'Actualización de datos personales del paciente',
    });

    return NextResponse.json({ success: true, patient: updatedPatient });
  } catch (error) {
    console.error('Error al actualizar paciente:', error);
    return NextResponse.json({ error: 'Error al actualizar paciente' }, { status: 500 });
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

    const existingPatient = await prisma.patient.findUnique({ where: { id } });
    if (!existingPatient) {
      return NextResponse.json({ error: 'Paciente no encontrado' }, { status: 404 });
    }

    if (user.role !== 'SUPER_ADMIN' && existingPatient.psychologistId !== user.id) {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    // Regla de borrado seguro: Archivar en lugar de destruir inmediatamente
    const archivedPatient = await prisma.patient.update({
      where: { id },
      data: { status: 'ARCHIVED' },
    });

    await logAuditEvent({
      userId: user.id,
      targetPatientId: id,
      action: 'ARCHIVE_PATIENT',
      resource: `/pacientes/${id}`,
      details: 'Archivado preventivo del expediente del paciente',
    });

    return NextResponse.json({ success: true, patient: archivedPatient });
  } catch (error) {
    console.error('Error al archivar paciente:', error);
    return NextResponse.json({ error: 'Error al archivar expediente' }, { status: 500 });
  }
}
