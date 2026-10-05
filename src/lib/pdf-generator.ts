/**
 * Nombre del archivo: src/lib/pdf-generator.ts
 * Descripción: Utilidad para generar y descargar informes psicológicos profesionales en formato PDF con jsPDF.
 * Fecha de última modificación: 2026-09-18
 * Autor: Psicolobos Development Team
 */

import { jsPDF } from 'jspdf';

export interface PdfReportData {
  reportNumber: string;
  title: string;
  patientName: string;
  patientAge: string | number;
  patientDoc?: string;
  psychologistName: string;
  psychologistColegiatura?: string;
  date: string;
  contentHtmlOrText: string;
}

export function generateClinicalReportPdf(data: PdfReportData): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  // Header Banner Verde Salvia
  doc.setFillColor(45, 81, 65); // #2D5141
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('PSICÓLOBOS - GESTIÓN CLÍNICA PROFESIONAL', margin, 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`N° Informe: ${data.reportNumber} | Fecha: ${data.date}`, pageWidth - margin, 14, { align: 'right' });

  // Título del informe
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(data.title.toUpperCase(), margin, 42);

  // Cuadro de datos del Paciente y Profesional
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, 48, contentWidth, 30, 2, 2, 'FD');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('DATOS DEL PACIENTE', margin + 5, 55);
  doc.setFont('helvetica', 'normal');
  doc.text(`Nombre: ${data.patientName}`, margin + 5, 62);
  doc.text(`Edad: ${data.patientAge} años | Doc. Identidad: ${data.patientDoc || 'N/A'}`, margin + 5, 69);

  doc.setFont('helvetica', 'bold');
  doc.text('PROFESIONAL TRATANTE', margin + contentWidth / 2 + 5, 55);
  doc.setFont('helvetica', 'normal');
  doc.text(`Psicólogo: ${data.psychologistName}`, margin + contentWidth / 2 + 5, 62);
  doc.text(`Colegiatura: ${data.psychologistColegiatura || 'CPhP Registrado'}`, margin + contentWidth / 2 + 5, 69);

  // Línea separadora
  doc.setDrawColor(82, 137, 112);
  doc.setLineWidth(0.5);
  doc.line(margin, 84, pageWidth - margin, 84);

  // Limpieza básica de HTML para texto plano en PDF
  const cleanText = data.contentHtmlOrText
    .replace(/<h[1-6][^>]*>/gi, '\n\n')
    .replace(/<\/h[1-6]>/gi, '\n')
    .replace(/<p[^>]*>/gi, '\n')
    .replace(/<\/p>/gi, '')
    .replace(/<br\s*[\/]?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .trim();

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);

  const splitLines = doc.splitTextToSize(cleanText, contentWidth);
  let cursorY = 92;

  splitLines.forEach((line: string) => {
    if (cursorY > pageHeight - 35) {
      doc.addPage();
      cursorY = 25;
    }
    doc.text(line, margin, cursorY);
    cursorY += 6;
  });

  // Espacio para Firma Digital al final
  if (cursorY > pageHeight - 45) {
    doc.addPage();
    cursorY = 30;
  } else {
    cursorY = pageHeight - 40;
  }

  doc.setDrawColor(148, 163, 184);
  doc.line(pageWidth / 2 - 35, cursorY, pageWidth / 2 + 35, cursorY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  doc.text(data.psychologistName, pageWidth / 2, cursorY + 5, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.text(`Colegiatura: ${data.psychologistColegiatura || 'Psicólogo Clínico'}`, pageWidth / 2, cursorY + 10, { align: 'center' });

  // Pie de página profesional
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Psicolobos - Documento Clínico Confidencial emitido de acuerdo a normativa médica y de privacidad vigente.', pageWidth / 2, pageHeight - 10, { align: 'center' });

  return doc;
}
