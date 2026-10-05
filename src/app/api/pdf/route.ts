/**
 * Nombre del archivo: src/app/api/pdf/route.ts
 * Descripción: Endpoint REST para la generación y descarga en formato PDF de informes clínicos.
 * Fecha de última modificación: 2026-09-18
 * Autor: Psicolobos Development Team
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';
import { generateClinicalReportPdf } from '@/lib/pdf-generator';
import { logAuditEvent } from '@/lib/audit';

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthSession();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { reportId } = await req.json();

    if (!reportId) {
      return NextResponse.json({ error: 'reportId es requerido' }, { status: 400 });
    }

    const report = await prisma.report.findUnique({
      where: { id: reportId },
      include: {
        patient: true,
        psychologist: true,
      },
    });

    if (!report) {
      return NextResponse.json({ error: 'Informe no encontrado' }, { status: 404 });
    }

    // Calcular edad
    let age = 30;
    if (report.patient.birthDate) {
      const birth = new Date(report.patient.birthDate);
      const now = new Date();
      age = now.getFullYear() - birth.getFullYear();
    }

    const pdfDoc = generateClinicalReportPdf({
      reportNumber: report.reportNumber,
      title: report.title,
      patientName: `${report.patient.firstName} ${report.patient.lastName}`,
      patientAge: age,
      patientDoc: report.patient.identityDoc || undefined,
      psychologistName: `${report.psychologist.firstName} ${report.psychologist.lastName}`,
      psychologistColegiatura: report.psychologist.colegiatura || undefined,
      date: new Date(report.createdAt).toLocaleDateString('es-ES'),
      contentHtmlOrText: report.contentHtml,
    });

    const pdfBuffer = Buffer.from(pdfDoc.output('arraybuffer'));

    await logAuditEvent({
      userId: user.id,
      targetPatientId: report.patientId,
      action: 'EXPORT_REPORT_PDF',
      resource: `/api/pdf`,
      details: `Informe PDF descargado: N° ${report.reportNumber} (${report.title})`,
    });

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Informe_${report.reportNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error al generar PDF:', error);
    return NextResponse.json({ error: 'Error al generar documento PDF' }, { status: 500 });
  }
}
