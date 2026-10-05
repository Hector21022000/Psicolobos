/**
 * Nombre del archivo: src/app/api/identities/route.ts
 * Descripción: Endpoint REST para la gestión de Identidades Documentales del profesional (Nombre personal, Consultorio, Centro Psicológico).
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

    let identities = await prisma.documentIdentity.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    // Si el profesional aún no tiene identidades configuradas, crear una predeterminada basada en su perfil
    if (identities.length === 0) {
      const defaultIdent = await prisma.documentIdentity.create({
        data: {
          userId: user.id,
          identityType: 'PERSONAL_NAME',
          name: 'Nombre Personal (Predeterminado)',
          displayName: `Psic. ${user.firstName} ${user.lastName}`,
          professionalName: `${user.firstName} ${user.lastName}`,
          title: 'Psicólogo Clínico',
          colegiatura: user.colegiatura || 'CPhP Registrado',
          specialty: user.specialty || 'Psicología Clínica',
          isDefault: true,
        },
      });
      identities = [defaultIdent];
    }

    return NextResponse.json({ success: true, identities });
  } catch (error) {
    console.error('Error al obtener identidades documentales:', error);
    return NextResponse.json({ error: 'Error al consultar identidades' }, { status: 500 });
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
      identityType,
      name,
      displayName,
      professionalName,
      title,
      colegiatura,
      specialty,
      centerName,
      address,
      phone,
      email,
      whatsapp,
      website,
      logoUrl,
      signatureUrl,
      stampUrl,
      isDefault,
    } = body;

    if (!name || !displayName) {
      return NextResponse.json({ error: 'Faltan campos obligatorios para la identidad' }, { status: 400 });
    }

    // Si se establece como predeterminada, quitar predeterminada previa
    if (isDefault) {
      await prisma.documentIdentity.updateMany({
        where: { userId: user.id },
        data: { isDefault: false },
      });
    }

    const identity = await prisma.documentIdentity.create({
      data: {
        userId: user.id,
        identityType: identityType || 'PERSONAL_NAME',
        name,
        displayName,
        professionalName: professionalName || `${user.firstName} ${user.lastName}`,
        title: title || 'Psicólogo Clínico',
        colegiatura: colegiatura || user.colegiatura,
        specialty: specialty || user.specialty,
        centerName: centerName || null,
        address: address || null,
        phone: phone || null,
        email: email || null,
        whatsapp: whatsapp || null,
        website: website || null,
        logoUrl: logoUrl || null,
        signatureUrl: signatureUrl || null,
        stampUrl: stampUrl || null,
        isDefault: Boolean(isDefault),
      },
    });

    await logAuditEvent({
      userId: user.id,
      action: 'UPDATE_PATIENT',
      resource: `/api/identities`,
      details: `Identidad documental registrada: "${displayName}" (${identityType})`,
    });

    return NextResponse.json({ success: true, identity }, { status: 201 });
  } catch (error) {
    console.error('Error al guardar identidad documental:', error);
    return NextResponse.json({ error: 'Error al guardar la identidad' }, { status: 500 });
  }
}
