import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: { scheduleJson: true, webProfileJson: true }
    });

    return NextResponse.json({
      schedule: user?.scheduleJson ? JSON.parse(user.scheduleJson) : null,
      webProfile: user?.webProfileJson ? JSON.parse(user.webProfileJson) : null
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const data = await req.json();
    
    await prisma.user.update({
      where: { id: session.id },
      data: {
        scheduleJson: data.schedule ? JSON.stringify(data.schedule) : null,
        webProfileJson: data.webProfile ? JSON.stringify(data.webProfile) : null,
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
