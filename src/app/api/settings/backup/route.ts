import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getAuthSession();
    if (!user || user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const data = {
      patients: await prisma.patient.findMany({
        include: {
          sessions: true,
          reports: true,
          diagnoses: true,
        }
      }),
      users: await prisma.user.findMany({
        select: { id: true, firstName: true, lastName: true, email: true, role: true }
      })
    };

    return new NextResponse(JSON.stringify(data, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="psicolobos_backup_${new Date().toISOString().split('T')[0]}.json"`
      }
    });
  } catch (error) {
    console.error('Error al generar respaldo:', error);
    return NextResponse.json({ error: 'Error al generar respaldo' }, { status: 500 });
  }
}
