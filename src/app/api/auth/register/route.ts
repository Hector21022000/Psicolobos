/**
 * Nombre del archivo: src/app/api/auth/register/route.ts
 * Descripción: Endpoint para el registro de nuevas cuentas profesionales de psicólogos.
 * Fecha de última modificación: 2026-09-18
 * Autor: Psicolobos Development Team
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, signToken } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';

export async function POST(req: NextRequest) {
  try {
    const { email, password, firstName, lastName, colegiatura, specialty, phone } = await req.json();

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Todos los campos obligatorios deben ser completados.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'El correo electrónico ya se encuentra registrado en el sistema.' },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        email: cleanEmail,
        passwordHash,
        role: 'PSYCHOLOGIST',
        firstName,
        lastName,
        colegiatura: colegiatura || null,
        specialty: specialty || 'Psicología Clínica',
        phone: phone || null,
        isActive: true,
      },
    });

    await logAuditEvent({
      userId: newUser.id,
      action: 'LOGIN',
      resource: '/auth/register',
      details: 'Registro de nueva cuenta profesional',
    });

    const token = await signToken({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      colegiatura: newUser.colegiatura,
      specialty: newUser.specialty,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        colegiatura: newUser.colegiatura,
        specialty: newUser.specialty,
      },
    });

    response.cookies.set('psicolobos_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error en API de registro:', error);
    return NextResponse.json(
      { error: 'No se pudo completar el registro de la cuenta.' },
      { status: 500 }
    );
  }
}
