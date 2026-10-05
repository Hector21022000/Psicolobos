import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const user = await prisma.user.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
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
