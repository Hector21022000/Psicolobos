/**
 * Nombre del archivo: src/app/audit/page.tsx
 * Descripción: Registro de auditoría HIPAA/GDPR y trazabilidad de seguridad de accesos en Psicolobos.
 * Fecha de última modificación: 2026-09-18
 * Autor: Psicolobos Development Team
 */

'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import AiCopilotDrawer from '@/components/AiCopilotDrawer';
import { ShieldCheck, Lock, Activity, User, Search, RefreshCw } from 'lucide-react';

export default function AuditPage() {
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAudit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/audit?limit=100');
      const data = await res.json();
      if (data.auditLogs) setLogs(data.auditLogs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudit();
  }, []);

  return (
    <div className="flex h-screen bg-transparent overflow-hidden">
      <Sidebar onOpenAiCopilot={() => setIsAiOpen(true)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Navbar
          onOpenAiCopilot={() => setIsAiOpen(true)}
          title="Registro de Auditoría y Trazabilidad (HIPAA / GDPR)"
          subtitle="Bitácora inmutable de accesos a historias clínicas, modificaciones y acciones de IA"
        />

        <main className="p-6 space-y-6">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6 text-emerald-700" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">Trazabilidad de Seguridad Activa</h3>
                <p className="text-xs text-slate-500">Registros recopilados: {logs.length} eventos</p>
              </div>
            </div>

            <button
              onClick={fetchAudit}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Actualizar Bitácora</span>
            </button>
          </div>

          <div className="clinical-card overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-xs text-slate-500">Cargando bitácora de auditoría...</div>
            ) : logs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                      <th className="p-3">Marca de Tiempo</th>
                      <th className="p-3">Usuario Profesional</th>
                      <th className="p-3">Acción Registrada</th>
                      <th className="p-3">Paciente Afectado</th>
                      <th className="p-3">Recurso / Endpoint</th>
                      <th className="p-3">Detalles</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                    {logs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 text-slate-500 font-sans">
                          {new Date(log.timestamp).toLocaleString('es-ES')}
                        </td>
                        <td className="p-3 font-sans font-bold text-slate-800">
                          {log.user ? `${log.user.firstName} ${log.user.lastName}` : log.userId}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded font-sans text-[10px] font-bold ${
                              log.action.includes('AI')
                                ? 'bg-sage-100 text-sage-800 border border-sage-300'
                                : log.action.includes('CREATE') || log.action.includes('UPDATE')
                                ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                : 'bg-slate-100 text-slate-800 border border-slate-300'
                            }`}
                          >
                            {log.action}
                          </span>
                        </td>
                        <td className="p-3 font-sans text-slate-700">
                          {log.targetPatient ? `${log.targetPatient.firstName} ${log.targetPatient.lastName}` : 'N/A'}
                        </td>
                        <td className="p-3 text-slate-600">{log.resource}</td>
                        <td className="p-3 text-slate-600 font-sans max-w-xs truncate">{log.details || 'SUCCESS'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center text-xs text-slate-500">No hay logs de auditoría disponibles.</div>
            )}
          </div>
        </main>
      </div>

      <AiCopilotDrawer isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
    </div>
  );
}
