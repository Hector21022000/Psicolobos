/**
 * Nombre del archivo: src/app/api/auth/login/route.ts
 * Descripción: Endpoint para el inicio de sesión seguro de psicólogos y super administradores.
 * Fecha de última modificación: 2026-09-18
 * Autor: Psicolobos Development Team
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, hashPassword, signToken } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Debe ingresar el correo electrónico y la contraseña.' },
        { status: 400 }
      );
    }

    let user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;
    const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD;

    // Configuración inicial de Super Admin mediante Variables de Entorno Seguras
    if (superAdminEmail && superAdminPassword && email === superAdminEmail && password === superAdminPassword) {
      if (!user) {
        const passwordHash = await hashPassword(superAdminPassword);
        user = await prisma.user.create({
          data: {
            email: superAdminEmail,
            passwordHash: passwordHash,
            role: 'SUPER_ADMIN',
            firstName: 'Super',
            lastName: 'Admin',
            isActive: true,
          },
        });
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Credenciales inválidas.' },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Cuenta desactivada. Contacte al administrador.' },
        { status: 401 }
      );
    }

    // Verificar contraseña real
    const isMatch = await verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Credenciales inválidas.' },
        { status: 401 }
      );
    }

    const token = await signToken({
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      colegiatura: user.colegiatura,
      specialty: user.specialty,
    });

    await logAuditEvent({
      userId: user.id,
      action: 'LOGIN',
      resource: '/auth/login',
      details: `Inicio de sesión exitoso con rol ${user.role}`,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        colegiatura: user.colegiatura,
        specialty: user.specialty,
      },
    });

    response.cookies.set('psicolobos_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 horas
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error en API de login:', error);
    return NextResponse.json(
      { error: 'Ocurrió un error interno al procesar el inicio de sesión.' },
      { status: 500 }
    );
  }
}
