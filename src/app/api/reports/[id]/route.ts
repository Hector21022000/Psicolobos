import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthSession();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const resolvedParams = await params;
    const reportId = resolvedParams.id;

    // Verificar si el reporte existe
    const existingReport = await prisma.report.findUnique({
      where: { id: reportId },
    });

    if (!existingReport) {
      return NextResponse.json({ error: 'Informe no encontrado' }, { status: 404 });
    }

    // Verificar propiedad (solo superadmin o el dueño pueden borrar)
    if (user.role !== 'SUPER_ADMIN' && existingReport.psychologistId !== user.id) {
       return NextResponse.json({ error: 'No tienes permiso para borrar este informe' }, { status: 403 });
    }

    await prisma.report.delete({
      where: { id: reportId },
    });

    return NextResponse.json({ success: true, message: 'Informe eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar informe:', error);
    return NextResponse.json({ error: 'Error interno del servidor al eliminar informe' }, { status: 500 });
  }
}
