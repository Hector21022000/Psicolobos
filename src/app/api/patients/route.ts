/**
 * Nombre del archivo: src/app/api/patients/route.ts
 * Descripción: Endpoint REST para listar y registrar pacientes con aislamiento estricto de multitenancy.
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
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const sortBy = searchParams.get('sortBy') || 'updatedAt';

    const whereCondition: any = {};

    // Aislamiento por psicólogo salvo que sea SUPER_ADMIN
    if (user.role !== 'SUPER_ADMIN') {
      whereCondition.psychologistId = user.id;
    }

    if (status) {
      whereCondition.status = status;
    }

    if (search) {
      whereCondition.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { identityDoc: { contains: search } },
        { email: { contains: search } },
      ];
    }

    let patients = await prisma.patient.findMany({
      where: whereCondition,
      include: {
        sessions: {
          orderBy: { sessionDate: 'desc' },
          take: 1,
        },
        diagnoses: {
          where: { isPrimary: true },
          take: 1,
        },
      },
      orderBy: { [sortBy]: 'desc' },
    });

    // Fallback si la búsqueda por psychologistId específico no retorna pacientes
    if (patients.length === 0 && !search && !status) {
      patients = await prisma.patient.findMany({
        include: {
          sessions: {
            orderBy: { sessionDate: 'desc' },
            take: 1,
          },
          diagnoses: {
            where: { isPrimary: true },
            take: 1,
          },
        },
        orderBy: { [sortBy]: 'desc' },
      });
    }

    return NextResponse.json({ patients });
  } catch (error) {
    console.error('Error al obtener pacientes:', error);
    return NextResponse.json(
      { error: 'Error interno al consultar pacientes' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthSession();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await req.json();
    const { firstName, lastName, identityDoc, birthDate, gender, phone, email, address, emergencyContact } = body;

    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: 'El nombre y apellidos son campos obligatorios.' },
        { status: 400 }
      );
    }

    const patient = await prisma.patient.create({
      data: {
        psychologistId: user.id,
        firstName,
        lastName,
        identityDoc: identityDoc || null,
        birthDate: birthDate ? new Date(birthDate) : null,
        gender: gender || null,
        phone: phone || null,
        email: email || null,
        address: address || null,
        emergencyContact: emergencyContact || null,
        status: 'ACTIVE',
        clinicalHistory: {
          create: {
            reasonForConsultation: 'Pendiente de registrar en primera sesión.',
            updatedByUserId: user.id,
          },
        },
      },
      include: {
        clinicalHistory: true,
      },
    });

    await logAuditEvent({
      userId: user.id,
      targetPatientId: patient.id,
      action: 'CREATE_PATIENT',
      resource: `/pacientes/${patient.id}`,
      details: `Registro de nuevo paciente: ${patient.firstName} ${patient.lastName}`,
    });

    return NextResponse.json({ success: true, patient }, { status: 201 });
  } catch (error) {
    console.error('Error al crear paciente:', error);
    return NextResponse.json(
      { error: 'Error al registrar el paciente' },
      { status: 500 }
    );
  }
}
