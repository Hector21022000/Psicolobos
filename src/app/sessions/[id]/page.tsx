/**
 * Nombre del archivo: src/app/sessions/[id]/page.tsx
 * Descripción: Detalle de Sesión en Historia Clínica adaptado exactamente al diseño de la Captura 4 de PsicoCMS.
 * Fecha de última modificación: 2026-09-18
 * Autor: Psicolobos Development Team
 */

'use client';

import React, { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import AiCopilotDrawer from '@/components/AiCopilotDrawer';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Paperclip,
  FileText,
  Plus,
  List,
  Calendar,
  User,
  Image as ImageIcon
} from 'lucide-react';

export default function SessionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [isAiOpen, setIsAiOpen] = useState(false);


  return (
    <div className="flex h-screen bg-transparent overflow-hidden">
      <Sidebar onOpenAiCopilot={() => setIsAiOpen(true)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Navbar onOpenAiCopilot={() => setIsAiOpen(true)} />

        <main className="p-6 md:p-8 space-y-6 max-w-6xl mx-auto w-full">
          {/* Breadcrumbs exactos a Captura 4 */}
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="hover:underline cursor-pointer" onClick={() => router.push('/')}>Inicio</span>
            <span>/</span>
            <span className="hover:underline cursor-pointer" onClick={() => router.push('/patients')}>Pacientes</span>
            <span>/</span>
            <span className="hover:underline cursor-pointer" onClick={() => router.push('/patients/1')}>Adrián Ruiz</span>
            <span>/</span>
            <span className="hover:underline cursor-pointer" onClick={() => router.push('/reports')}>Historia clínica</span>
            <span>/</span>
            <span className="text-slate-800 font-semibold">Sesión nº 29</span>
          </div>

          {/* Header principal y botones de acción */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Sesión nº 29</h1>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>26 de abril de 2026 · Adrián Ruiz</span>
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => router.back()}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Volver</span>
              </button>

              <button
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <Edit className="w-3.5 h-3.5 text-slate-500" />
                <span>Editar</span>
              </button>

              <button
                className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Eliminar</span>
              </button>
            </div>
          </div>

          {/* Tarjeta 1: Notas de la sesión */}
          <div className="clinical-card p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <FileText className="w-4 h-4 text-psicoPurple-600" />
                Notas de la sesión
              </h2>
              <span className="text-xs text-slate-400 font-medium">Domingo, 26 De Abril De 2026</span>
            </div>

            <div className="text-xs text-slate-700 leading-relaxed space-y-3">
              <p className="font-semibold text-slate-800">Resumen de la sesión nº 29 del paciente.</p>
              <p>
                Se trataron temas de ansiedad, autoestima y dinámica familiar. Evolución positiva.
              </p>
            </div>
          </div>

          {/* Tarjeta 2: Archivos adjuntos */}
          <div className="clinical-card p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Paperclip className="w-4 h-4 text-psicoPurple-600" />
              <h2 className="text-sm font-bold text-slate-800">Archivos adjuntos</h2>
              <span className="px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 text-[11px] font-bold">
                2
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
              {/* Adjunto 1: PDF */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col items-center justify-center text-center space-y-2 hover:bg-slate-100 transition-colors cursor-pointer group">
                <div className="w-12 h-14 bg-rose-600 rounded-lg flex flex-col items-center justify-center text-white font-bold text-xs shadow-sm">
                  <span className="text-[10px]">PDF</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800 group-hover:text-psicoPurple-600 truncate max-w-[150px]">
                    tabla-ejercicios-mar...
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">863.1 KB</p>
                </div>
              </div>

              {/* Adjunto 2: Foto de Notas Escaneadas */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col items-center justify-center text-center space-y-2 hover:bg-slate-100 transition-colors cursor-pointer group">
                <div className="w-28 h-20 bg-slate-200 rounded-xl overflow-hidden shadow-xs relative border border-slate-300">
                  <div className="w-full h-full bg-slate-300 flex items-center justify-center text-slate-500 font-mono text-[10px]">
                    [Foto Notas]
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800 group-hover:text-psicoPurple-600 truncate max-w-[150px]">
                    notas tomadas a pape...
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">2.3 MB</p>
                </div>
              </div>
            </div>
          </div>

          {/* Botones Inferiores de Acción */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => router.push('/agenda')}
              className="px-5 py-2.5 bg-psicoPurple-600 hover:bg-psicoPurple-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md shadow-psicoPurple-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>+ Nueva entrada</span>
            </button>

            <button
              onClick={() => router.push('/reports')}
              className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs"
            >
              <List className="w-4 h-4 text-slate-500" />
              <span>Ver toda la historia</span>
            </button>
          </div>
        </main>
      </div>

      <AiCopilotDrawer isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
    </div>
  );
}
