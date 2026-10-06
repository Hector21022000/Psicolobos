import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';

export async function DELETE() {
  try {
    const user = await getAuthSession();
    if (!user || user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Borrar datos transaccionales, cuidando orden por dependencias (FKs)
    await prisma.report.deleteMany({});
    await prisma.session.deleteMany({});
    await prisma.diagnosis.deleteMany({});
    await prisma.document.deleteMany({});
    await prisma.consent.deleteMany({});
    await prisma.auditLog.deleteMany({});
    
    // Finalmente pacientes
    await prisma.patient.deleteMany({});

    return NextResponse.json({ success: true, message: 'Datos de prueba eliminados correctamente' });
  } catch (error) {
    console.error('Error al borrar datos:', error);
    return NextResponse.json({ error: 'Error interno al borrar datos' }, { status: 500 });
  }
}
