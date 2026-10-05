/**
 * Nombre del archivo: src/app/reports/page.tsx
 * Descripción: Repositorio de informes clínicos emitiendo PDFs oficiales con firmas digitales.
 * Fecha de última modificación: 2026-09-18
 * Autor: Psicolobos Development Team
 */

'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import AiCopilotDrawer from '@/components/AiCopilotDrawer';
import PdfReportModal from '@/components/PdfReportModal';
import { FileText, Download, Plus, Search, FileCheck, Sparkles, Trash2 } from 'lucide-react';

export default function ReportsPage() {
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<any>(null);

  useEffect(() => {
    async function loadReports() {
      setLoading(true);
      try {
        const res = await fetch('/api/reports');
        const data = await res.json();
        if (data.reports) setReports(data.reports);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, []);

  const handleDeleteReport = async (reportId: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este informe?')) return;
    try {
      const res = await fetch(`/api/reports/${reportId}`, { method: 'DELETE' });
      if (res.ok) {
        setReports(reports.filter(r => r.id !== reportId));
        alert('Informe eliminado correctamente');
      } else {
        alert('No se pudo eliminar el informe');
      }
    } catch (err) {
      console.error(err);
      alert('Error al eliminar el informe');
    }
  };

  return (
    <div className="flex h-screen bg-transparent overflow-hidden">
      <Sidebar onOpenAiCopilot={() => setIsAiOpen(true)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Navbar
          onOpenAiCopilot={() => setIsAiOpen(true)}
          title="Informes y Certificados Clínicos"
          subtitle="Generación, firmas digitales y exportación a PDF oficial"
        />

        <main className="p-6 space-y-6">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-sage-600" />
                Informes Emitidos ({reports.length})
              </h3>
              <p className="text-xs text-slate-500">Documentos psicoterapéuticos con validez clínica</p>
            </div>
          </div>

          <div className="clinical-card overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-xs text-slate-500">Cargando informes...</div>
            ) : reports.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                      <th className="p-3">N° Informe</th>
                      <th className="p-3">Título / Tipo</th>
                      <th className="p-3">Paciente</th>
                      <th className="p-3">Estado</th>
                      <th className="p-3">Emisión</th>
                      <th className="p-3 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {reports.map((rep) => (
                      <tr key={rep.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-mono font-bold text-sage-800">{rep.reportNumber}</td>
                        <td className="p-3">
                          <p className="font-bold text-slate-800">{rep.title}</p>
                          <p className="text-[10px] text-slate-500">{rep.reportType}</p>
                        </td>
                        <td className="p-3 text-slate-700">
                          {rep.patient?.firstName} {rep.patient?.lastName}
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            {rep.status}
                          </span>
                        </td>
                        <td className="p-3 text-slate-500">
                          {new Date(rep.createdAt).toLocaleDateString('es-ES')}
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedReport(rep)}
                              className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-[11px] font-semibold flex items-center gap-1.5"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Previsualizar</span>
                            </button>
                            <button
                              onClick={() => handleDeleteReport(rep.id)}
                              className="px-2 py-1.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors"
                              title="Eliminar informe"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center text-xs text-slate-500">No hay informes emitidos registrados.</div>
            )}
          </div>
        </main>
      </div>

      {selectedReport && (
        <PdfReportModal
          isOpen={!!selectedReport}
          onClose={() => setSelectedReport(null)}
          reportId={selectedReport.id}
          reportTitle={selectedReport.title}
          reportNumber={selectedReport.reportNumber}
          contentHtml={selectedReport.contentHtml}
        />
      )}

      <AiCopilotDrawer isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
    </div>
  );
}
