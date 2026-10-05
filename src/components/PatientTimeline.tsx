/**
 * Nombre del archivo: src/components/PatientTimeline.tsx
 * Descripción: Línea de tiempo cronológica interactiva de eventos, atenciones y registros del paciente en Psicolobos.
 * Fecha de última modificación: 2026-09-18
 * Autor: Psicolobos Development Team
 */

'use client';

import React from 'react';
import { Calendar, Clock, CheckCircle2, FileText, Send, Sparkles, AlertTriangle } from 'lucide-react';

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'APPOINTMENT' | 'SESSION' | 'REPORT' | 'COMMUNICATION' | 'AI_ANALYSIS';
  status?: string;
}

interface PatientTimelineProps {
  events: TimelineEvent[];
}

export default function PatientTimeline({ events }: PatientTimelineProps) {
  if (!events || events.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-slate-500 bg-white rounded-xl border border-slate-200">
        No hay eventos registrados en la línea de tiempo.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Línea de Tiempo del Paciente</h3>
      <div className="relative border-l-2 border-slate-200 ml-3 space-y-6">
        {events.map((evt) => (
          <div key={evt.id} className="relative pl-6">
            {/* Icono de viñeta */}
            <div
              className={`absolute -left-3 top-0 w-6 h-6 rounded-full border-2 bg-white flex items-center justify-center text-xs ${
                evt.type === 'SESSION'
                  ? 'border-sage-500 text-sage-600'
                  : evt.type === 'APPOINTMENT'
                  ? 'border-blue-500 text-blue-600'
                  : evt.type === 'COMMUNICATION'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-slate-500 text-slate-600'
              }`}
            >
              {evt.type === 'SESSION' ? (
                <FileText className="w-3 h-3" />
              ) : evt.type === 'APPOINTMENT' ? (
                <Calendar className="w-3 h-3" />
              ) : (
                <Send className="w-3 h-3" />
              )}
            </div>

            {/* Contenido del Evento */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-800">{evt.title}</span>
                <span className="text-[10px] text-slate-400 font-mono">{evt.date}</span>
              </div>
              <p className="text-xs text-slate-600">{evt.description}</p>
              {evt.status && (
                <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                  {evt.status}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
