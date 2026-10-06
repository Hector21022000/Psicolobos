import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function GET(req: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        colegiatura: true,
        specialty: true,
        phone: true,
        address: true,
        avatarUrl: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const data = await req.json();
    
    // Validar email duplicado si está cambiando
    if (data.email) {
      const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
      if (existingUser && existingUser.id !== session.id) {
        return NextResponse.json({ error: 'El correo electrónico ya está en uso' }, { status: 400 });
      }
    }

    const updateData: any = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      colegiatura: data.colegiatura,
      specialty: data.specialty,
      phone: data.phone,
      address: data.address,
      avatarUrl: data.avatarUrl,
    };

    if (data.password && data.password.trim() !== '') {
      updateData.passwordHash = await bcrypt.hash(data.password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.id },
      data: updateData,
      select: {
        firstName: true,
        lastName: true,
        email: true,
        colegiatura: true,
        specialty: true,
        phone: true,
        address: true,
        avatarUrl: true,
      }
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
