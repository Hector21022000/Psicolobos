import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Falta ID del profesional' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: { 
        firstName: true,
        lastName: true,
        phone: true,
        email: true,
        address: true,
        scheduleJson: true,
        webProfileJson: true 
      }
    });

    if (!user) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });

    return NextResponse.json({
      name: `${user.firstName} ${user.lastName}`,
      phone: user.phone || '',
      email: user.email,
      address: user.address || '',
      schedule: user.scheduleJson ? JSON.parse(user.scheduleJson) : null,
      webProfile: user.webProfileJson ? JSON.parse(user.webProfileJson) : null
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
