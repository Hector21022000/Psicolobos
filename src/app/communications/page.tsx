/**
 * Nombre del archivo: src/app/communications/page.tsx
 * Descripción: Centro de Comunicaciones (WhatsApp Business API, Email) y configuración de plantillas/automatizaciones.
 * Fecha de última modificación: 2026-09-18
 * Autor: Psicolobos Development Team
 */

'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import AiCopilotDrawer from '@/components/AiCopilotDrawer';
import { Send, MessageSquare, Mail, CheckCircle2, Clock, ShieldCheck, ToggleLeft, ToggleRight } from 'lucide-react';

export default function CommunicationsPage() {
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Automatizaciones Toggles
  const [automations, setAutomations] = useState({
    emailNewBooking: true,
    emailConfirmation: true,
    emailReminder: true,
    whatsappReminder24h: true,
    whatsappConfirmation: true,
    googleCalendarSync: true,
  });

  useEffect(() => {
    async function loadLogs() {
      setLoading(true);
      try {
        const res = await fetch('/api/communications');
        const data = await res.json();
        if (data.logs) setLogs(data.logs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, []);

  return (
    <div className="flex h-screen bg-transparent overflow-hidden">
      <Sidebar onOpenAiCopilot={() => setIsAiOpen(true)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Navbar
          onOpenAiCopilot={() => setIsAiOpen(true)}
          title="Centro de Comunicaciones y Automatizaciones"
          subtitle="Trazabilidad de mensajes oficiales (WhatsApp Business API & Correo) y recordatorios 24h"
        />

        <main className="p-6 space-y-6">
          {/* Tarjeta Configuración de Automatizaciones */}
          <div className="clinical-card p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b pb-2">
              <Send className="w-4 h-4 text-sage-600" />
              Reglas de Automatización de Mensajería
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border">
                <div>
                  <span className="font-semibold text-slate-800 block">WhatsApp Recordatorio 24h</span>
                  <span className="text-[10px] text-slate-500">Solicita confirmación de asistencia</span>
                </div>
                <button
                  onClick={() => setAutomations({ ...automations, whatsappReminder24h: !automations.whatsappReminder24h })}
                  className="text-sage-600"
                >
                  {automations.whatsappReminder24h ? <ToggleRight className="w-7 h-7" /> : <ToggleLeft className="w-7 h-7 text-slate-400" />}
                </button>
              </div>

              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border">
                <div>
                  <span className="font-semibold text-slate-800 block">Confirmación Automática Email</span>
                  <span className="text-[10px] text-slate-500">Envía comprobante de agendamiento</span>
                </div>
                <button
                  onClick={() => setAutomations({ ...automations, emailConfirmation: !automations.emailConfirmation })}
                  className="text-sage-600"
                >
                  {automations.emailConfirmation ? <ToggleRight className="w-7 h-7" /> : <ToggleLeft className="w-7 h-7 text-slate-400" />}
                </button>
              </div>

              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border">
                <div>
                  <span className="font-semibold text-slate-800 block">Sincronización Google Calendar</span>
                  <span className="text-[10px] text-slate-500">Creación automática de evento privado</span>
                </div>
                <button
                  onClick={() => setAutomations({ ...automations, googleCalendarSync: !automations.googleCalendarSync })}
                  className="text-sage-600"
                >
                  {automations.googleCalendarSync ? <ToggleRight className="w-7 h-7" /> : <ToggleLeft className="w-7 h-7 text-slate-400" />}
                </button>
              </div>
            </div>
          </div>

          {/* Tabla Log de Comunicaciones */}
          <div className="clinical-card overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Bitácora de Comunicaciones Enviadas ({logs.length})
              </h3>
            </div>

            {loading ? (
              <div className="p-12 text-center text-xs text-slate-500">Cargando comunicaciones...</div>
            ) : logs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                      <th className="p-3">Marca de Tiempo</th>
                      <th className="p-3">Canal</th>
                      <th className="p-3">Paciente</th>
                      <th className="p-3">Destinatario</th>
                      <th className="p-3">Tipo de Mensaje</th>
                      <th className="p-3">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {logs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 text-slate-500">{new Date(log.sentAt).toLocaleString('es-ES')}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              log.channel === 'WHATSAPP'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-blue-100 text-blue-800 border border-blue-300'
                            }`}
                          >
                            {log.channel}
                          </span>
                        </td>
                        <td className="p-3 font-bold text-slate-800">
                          {log.patient ? `${log.patient.firstName} ${log.patient.lastName}` : 'N/A'}
                        </td>
                        <td className="p-3 text-slate-600 font-mono">{log.recipient}</td>
                        <td className="p-3 text-slate-700 font-medium">{log.messageType}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800">
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center text-xs text-slate-500">No hay comunicaciones registradas.</div>
            )}
          </div>
        </main>
      </div>

      <AiCopilotDrawer isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
    </div>
  );
}
