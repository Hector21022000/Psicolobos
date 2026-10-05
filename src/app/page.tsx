/**
 * Nombre del archivo: src/app/page.tsx
 * Descripción: Dashboard Principal (Inicio) de Psicolobos adaptado al diseño exacto de PsicoCMS.
 * Fecha de última modificación: 2026-09-18
 * Autor: Psicolobos Development Team
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import AiCopilotDrawer from '@/components/AiCopilotDrawer';
import {
  Calendar as CalendarIcon,
  Users,
  FileText,
  TrendingUp,
  Plus,
  Eye,
  Edit2,
  MapPin,
  Video,
  Clock,
  Sparkles
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'presencial' | 'online'>('presencial');
  const [appointments, setAppointments] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [userName, setUserName] = useState('');
  const [schedule, setSchedule] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [resPat, resApp, resProfile, resWeb] = await Promise.all([
          fetch('/api/patients'),
          fetch('/api/appointments'),
          fetch('/api/settings/profile'),
          fetch('/api/web-settings')
        ]);

        if (resPat.status === 401 || resApp.status === 401 || resProfile.status === 401) {
          router.push('/login');
          return;
        }

        const dataPat = await resPat.json();
        const dataApp = await resApp.json();
        const dataProfile = await resProfile.json();
        
        if (resWeb.ok) {
          const dataWeb = await resWeb.json();
          if (dataWeb.schedule) setSchedule(dataWeb.schedule);
        }

        if (dataPat.patients) setPatients(dataPat.patients);
        if (dataApp.appointments) setAppointments(dataApp.appointments);
        if (dataProfile && dataProfile.firstName) {
          setUserName(dataProfile.firstName);
        }
      } catch (err) {
        console.error('Error al cargar datos del dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [router]);

  return (
    <div className="flex h-screen bg-transparent overflow-hidden">
      <Sidebar onOpenAiCopilot={() => setIsAiOpen(true)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto relative z-10">
        <Navbar onOpenAiCopilot={() => setIsAiOpen(true)} />

        <main className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Breadcrumbs & Header Principal */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs text-slate-500 font-medium mb-1">Inicio</p>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">¡Hola{userName ? `, Psc. ${userName}` : ''}!</h1>
              <p className="text-xs text-slate-500">Aquí tienes un resumen de tu actividad de hoy.</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsAiOpen(true)}
                className="px-4 py-2.5 bg-psicoPurple-50 hover:bg-psicoPurple-100 text-psicoPurple-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all border border-psicoPurple-200"
              >
                <Sparkles className="w-4 h-4 text-psicoPurple-600" />
                <span>Asistente IA</span>
              </button>

              <button
                onClick={() => router.push('/agenda')}
                className="px-4 py-2.5 bg-psicoPurple-600 hover:bg-psicoPurple-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-md shadow-psicoPurple-600/20"
              >
                <Plus className="w-4 h-4" />
                <span>+ Nueva cita</span>
              </button>
            </div>
          </div>

          {/* Top 4 Tarjetas de Métricas idénticas a Captura 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Próximas citas hoy */}
            <div className="clinical-card p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-psicoPurple-700 flex items-center justify-center shrink-0">
                <CalendarIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Próximas citas (hoy)</p>
                <p className="text-2xl font-bold text-slate-800 leading-tight">1</p>
                <p className="text-[10px] text-slate-400 italic">Datos de ejemplo</p>
              </div>
            </div>

            {/* 2. Pacientes activos */}
            <div className="clinical-card p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Pacientes activos</p>
                <p className="text-2xl font-bold text-slate-800 leading-tight">{loading ? '75' : patients.length || 75}</p>
                <p className="text-[10px] text-slate-400 italic">Datos de ejemplo</p>
              </div>
            </div>

            {/* 3. Artículos publicados */}
            <div className="clinical-card p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Artículos publicados</p>
                <p className="text-2xl font-bold text-slate-800 leading-tight">27</p>
                <p className="text-[10px] text-slate-400 italic">Datos de ejemplo</p>
              </div>
            </div>

            {/* 4. Sesiones del mes */}
            <div className="clinical-card p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Sesiones del mes</p>
                <p className="text-2xl font-bold text-slate-800 leading-tight">1</p>
                <p className="text-[10px] text-slate-400 italic">Datos de ejemplo</p>
              </div>
            </div>
          </div>

          {/* Grid Principal: Tabla de Próximas citas de hoy + Disponibilidad semanal */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Columna Izquierda: Tabla Próximas citas de hoy */}
            <div className="lg:col-span-2 clinical-card p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                  <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-psicoPurple-600" />
                    Próximas citas de hoy
                  </h2>
                  <button
                    onClick={() => router.push('/appointments')}
                    className="text-xs font-semibold text-psicoPurple-600 hover:text-psicoPurple-700 transition-colors"
                  >
                    Ver todas
                  </button>
                </div>

                {/* Tabla de Citas de Hoy */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-slate-400 font-semibold border-b border-slate-100">
                        <th className="py-2 px-3">HORA</th>
                        <th className="py-2 px-3">PACIENTE</th>
                        <th className="py-2 px-3">MODALIDAD</th>
                        <th className="py-2 px-3 text-right">ACCIÓN</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-3 font-semibold text-slate-800 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>17:30</span>
                        </td>
                        <td className="py-4 px-3 font-medium text-slate-700">Jesús García</td>
                        <td className="py-4 px-3">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-50 text-cyan-700 border border-cyan-200">
                            Online
                          </span>
                        </td>
                        <td className="py-4 px-3 text-right">
                          <button
                            onClick={() => router.push('/appointments')}
                            className="p-1.5 rounded-full text-slate-400 hover:text-psicoPurple-600 hover:bg-psicoPurple-50 transition-colors"
                            title="Ver detalle"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Columna Derecha: Disponibilidad semanal */}
            <div className="clinical-card p-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-psicoPurple-600" />
                  Disponibilidad semanal
                </h2>
                <button
                  onClick={() => router.push('/booking')}
                  className="p-1 rounded text-slate-400 hover:text-psicoPurple-600"
                  title="Editar horarios"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Sub-tabs Presencial / Online */}
              <div className="flex border-b border-slate-200 mb-4 text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('presencial')}
                  className={`flex items-center gap-1.5 pb-2 px-3 transition-colors border-b-2 ${
                    activeTab === 'presencial'
                      ? 'border-psicoPurple-600 text-psicoPurple-700'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Presencial</span>
                </button>
                <button
                  onClick={() => setActiveTab('online')}
                  className={`flex items-center gap-1.5 pb-2 px-3 transition-colors border-b-2 ${
                    activeTab === 'online'
                      ? 'border-psicoPurple-600 text-psicoPurple-700'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Online</span>
                </button>
              </div>

              {/* Lista de Días de la semana */}
              <div className="space-y-3 text-xs">
                {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map(day => (
                  <div key={day} className="flex justify-between items-center py-1">
                    <span className="font-semibold text-slate-700">{day}</span>
                    {schedule && schedule[day]?.active ? (
                      <span className="text-slate-600 font-medium">{schedule[day].start} - {schedule[day].end}</span>
                    ) : (
                      <span className="text-slate-400 italic">No configurado</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      <AiCopilotDrawer
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
      />
    </div>
  );
}

