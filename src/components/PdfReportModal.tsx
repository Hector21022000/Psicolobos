/**
 * Nombre del archivo: src/components/PdfReportModal.tsx
 * Descripción: Modal de previsualización y exportación de informes clínicos en formato PDF.
 * Fecha de última modificación: 2026-09-18
 * Autor: Psicolobos Development Team
 */

'use client';

import React, { useState } from 'react';
import { X, FileText, Download, Printer, CheckCircle, RefreshCw } from 'lucide-react';

interface PdfReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportId: string;
  reportTitle: string;
  reportNumber: string;
  contentHtml: string;
}

export default function PdfReportModal({
  isOpen,
  onClose,
  reportId,
  reportTitle,
  reportNumber,
  contentHtml,
}: PdfReportModalProps) {
  const [downloading, setDownloading] = useState(false);

  if (!isOpen) return null;

  const handleDownloadPdf = async () => {
    setDownloading(true);
    try {
      const res = await fetch('/api/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId }),
      });

      if (!res.ok) throw new Error('Error al generar PDF');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Informe_${reportNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Ocurrió un error al descargar el informe PDF.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden border border-slate-200">
        {/* Header Modal */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-sage-400" />
            <div>
              <h3 className="text-sm font-bold">{reportTitle}</h3>
              <p className="text-[11px] text-slate-400">N° Registro: {reportNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Previsualización del Informe */}
        <div className="p-6 max-h-[65vh] overflow-y-auto bg-slate-100">
          <div className="bg-white p-8 rounded-lg shadow-md border border-slate-200 text-slate-800 text-xs font-serif leading-relaxed space-y-4">
            <div
              className="prose prose-sm max-w-none font-sans text-xs"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />

            <div className="pt-12 border-t border-slate-200 flex justify-around text-center text-sans font-sans">
              <div>
                <div className="w-40 border-b border-slate-400 mb-1 mx-auto" />
                <p className="font-semibold text-slate-800">Firma del Profesional</p>
                <p className="text-[10px] text-slate-500">CPhP Registrado</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <span className="text-[11px] text-slate-500 font-medium">Documento clínico oficial con firma digital</span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-100"
            >
              Cerrar
            </button>
            <button
              onClick={handleDownloadPdf}
              disabled={downloading}
              className="px-4 py-2 bg-sage-600 hover:bg-sage-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm"
            >
              {downloading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generando PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Descargar PDF Oficial</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
