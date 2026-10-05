/**
 * Nombre del archivo: src/app/agenda/page.tsx
 * Descripción: Agenda clínica tipo Google Calendar limpia ajustada a 1 sola cita única activa.
 * Fecha de última modificación: 2026-09-19
 * Autor: Psicolobos Development Team
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import AiCopilotDrawer from '@/components/AiCopilotDrawer';
import SessionRecordModal from '@/components/SessionRecordModal';
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  ChevronLeft,
  ChevronRight,
  List,
  Star,
  X,
  FileText,
  Eye,
  User,
  CheckCircle,
  Phone,
  MessageCircle,
  RefreshCw
} from 'lucide-react';

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export default function AgendaPage() {
  const router = useRouter();
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  // Estado del Calendario Real Dinámico
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(4); // 4 = Mayo (0-indexed)

  const [appointments, setAppointments] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [detailApp, setDetailApp] = useState<any>(null);
  const [sessionModalApp, setSessionModalApp] = useState<any>(null);

  // Cita única en calendario
  const [demoApps, setDemoApps] = useState<any[]>([
    {
      id: 'demo-1',
      dateStr: '2026-05-05',
      patientName: 'Manuel López',
      patientPhone: '699688644',
      time: '12:00 – 13:00',
      modality: 'PRESENCIAL',
      status: 'CONFIRMED',
      notes: 'Consulta psicológica inicial del paciente.',
      soap: {
        subjective: 'Paciente acude a consulta para orientación y evaluación psicológica.',
        objective: 'Paciente orientado, actitud colaborativa.',
        assessment: 'Evaluación clínica en proceso.',
        plan: 'Continuar proceso psicoterapéutico.'
      }
    }
  ]);

  // Formulario Nueva Cita
  const [form, setForm] = useState({
    patientId: '',
    patientName: '',
    title: 'Consulta Psicológica',
    startDateTime: new Date().toISOString().slice(0, 16),
    endDateTime: new Date(Date.now() + 3600000).toISOString().slice(0, 16),
    modality: 'PRESENCIAL',
    status: 'CONFIRMED',
    notes: '',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [resApp, resPat] = await Promise.all([
        fetch('/api/appointments'),
        fetch('/api/patients'),
      ]);
      const dataApp = await resApp.json();
      const dataPat = await resPat.json();

      if (dataApp.appointments) setAppointments(dataApp.appointments);
      if (dataPat.patients) {
        setPatients(dataPat.patients);
        if (dataPat.patients.length > 0) {
          setForm((prev) => ({
            ...prev,
            patientId: dataPat.patients[0].id,
            patientName: `${dataPat.patients[0].firstName} ${dataPat.patients[0].lastName}`,
          }));
        }
      }
    } catch (err) {
      console.error('Error al cargar agenda:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Navegación de Meses y Años Reales Dinámica
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
  };

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    const dateObj = new Date(form.startDateTime);
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const dd = String(dateObj.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;

    const newApp = {
      id: `demo-${Date.now()}`,
      dateStr,
      patientName: form.patientName || 'Paciente Nuevo',
      patientPhone: '+51 900 000 000',
      time: `${dateObj.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`,
      modality: form.modality,
      status: form.status,
      notes: form.notes || 'Cita agendada manualmente.',
      soap: {
        subjective: 'Consulta recién agendada.',
        objective: 'Pendiente de sesión inicial.',
        assessment: 'En evaluación.',
        plan: 'Realizar anamnesis y apertura de expediente.'
      }
    };

    setDemoApps((prev) => [newApp, ...prev]);

    try {
      if (form.patientId) {
        await fetch('/api/appointments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      }
    } catch (err) {
      console.error(err);
    }

    setIsNewModalOpen(false);
    alert('Cita agendada exitosamente e integrada en el calendario.');
    loadData();
  };

  // Función para determinar el color de la píldora según estado/modalidad (Exacto a Captura 2 de PsicoCMS)
  const getPillStyle = (modality: string, status?: string) => {
    if (status === 'COMPLETED' || status === 'REALIZADA') return 'bg-[#2E9D64] text-white hover:bg-[#248252]'; // Verde Realizada
    if (status === 'NO_SHOW' || status === 'NO_ASISTIO' || status === 'CANCELLED' || status === 'CANCELADA') return 'bg-[#C84646] text-white hover:bg-[#a83838]'; // Rojo
    if (status === 'PENDING' || status === 'PENDIENTE') return 'bg-[#758195] text-white hover:bg-[#606b7d]'; // Gris Pendiente
    if (modality === 'VIRTUAL' || modality === 'ONLINE') return 'bg-[#438CB9] text-white hover:bg-[#34739a]'; // Azul Online confirmada
    return 'bg-[#D99634] text-white hover:bg-[#b57b27]'; // Dorado/Marrón Presencial confirmada
  };

  // Cálculo de Días para la Malla del Calendario
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = (() => {
    const day = new Date(currentYear, currentMonth, 1).getDay();
    return day === 0 ? 6 : day - 1; // Ajuste para iniciar Lunes (0 = Lun, 6 = Dom)
  })();

  // Obtener citas del día específico
  const getAppsForDay = (day: number) => {
    const monthStr = String(currentMonth + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const targetDateStr = `${currentYear}-${monthStr}-${dayStr}`;

    const matchingDemos = demoApps.filter((app) => app.dateStr === targetDateStr);
    const matchingReal = appointments.filter((app) => {
      const d = new Date(app.startDateTime);
      return d.getFullYear() === currentYear && d.getMonth() === currentMonth && d.getDate() === day;
    }).map(app => ({
      id: app.id,
      patientId: app.patientId,
      patientName: app.patient ? `${app.patient.firstName} ${app.patient.lastName}` : 'Paciente',
      patientPhone: app.patient?.phone || 'Sin cel',
      time: `${new Date(app.startDateTime).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`,
      modality: app.modality,
      status: app.status,
      notes: app.notes || 'Sin notas registradas',
      soap: app.soap || {
        subjective: 'Consulta agendada.',
        objective: 'Sin observaciones previas.',
        assessment: 'Diagnóstico en proceso.',
        plan: 'Dar seguimiento clínico.'
      }
    }));

    return [...matchingDemos, ...matchingReal];
  };

  const isToday = (day: number) => {
    const today = new Date();
    return today.getFullYear() === currentYear && today.getMonth() === currentMonth && today.getDate() === day;
  };

  return (
    <div className="flex h-screen bg-transparent overflow-hidden">
      <Sidebar onOpenAiCopilot={() => setIsAiOpen(true)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Navbar onOpenAiCopilot={() => setIsAiOpen(true)} />

        <main className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Header Superior del Calendario estilo Captura 2 */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                <CalendarIcon className="w-6 h-6 text-slate-800" />
                Calendario
              </h1>
              <p className="text-xs text-slate-500">Visualiza y gestiona tus citas por día, semana o mes en tiempo real.</p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => router.push('/appointments')}
                className="px-3.5 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <List className="w-3.5 h-3.5 text-slate-500" />
                <span>Lista de citas</span>
              </button>

              <button
                onClick={() => setIsNewModalOpen(true)}
                className="px-3.5 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Star className="w-3.5 h-3.5 text-amber-500" />
                <span>Nuevo evento</span>
              </button>

              <button
                onClick={() => setIsNewModalOpen(true)}
                className="px-4 py-2 bg-[#484496] hover:bg-[#393478] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-[#484496]/20 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>+ Nueva cita</span>
              </button>
            </div>
          </div>

          {/* Tarjeta Contenedora Principal del Calendario */}
          <div className="clinical-card p-6 space-y-5">
            {/* Barra de Controles de Navegación Dinámica de Año y Mes */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 transition-colors shadow-xs"
                  title="Mes anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <h2 className="text-lg font-bold text-slate-800 tracking-tight min-w-[140px] text-center">
                  {MONTH_NAMES[currentMonth]} {currentYear}
                </h2>

                <button
                  onClick={handleNextMonth}
                  className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 transition-colors shadow-xs"
                  title="Mes siguiente"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleToday}
                  className="px-3 py-1.5 text-xs font-semibold text-[#484496] bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors border border-purple-200"
                >
                  Hoy
                </button>
              </div>

              {/* Selector Directo de Mes y Año Real */}
              <div className="flex items-center gap-2">
                <select
                  value={currentMonth}
                  onChange={(e) => setCurrentMonth(Number(e.target.value))}
                  className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-[#484496]"
                >
                  {MONTH_NAMES.map((name, idx) => (
                    <option key={name} value={idx}>
                      {name}
                    </option>
                  ))}
                </select>

                <select
                  value={currentYear}
                  onChange={(e) => setCurrentYear(Number(e.target.value))}
                  className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-[#484496]"
                >
                  {[2024, 2025, 2026, 2027, 2028, 2029, 2030].map((yr) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  ))}
                </select>

                <div className="flex bg-slate-100 border border-slate-200 rounded-lg p-0.5 text-xs font-semibold">
                  <button
                    onClick={() => setViewMode('day')}
                    className={`px-3 py-1 rounded-md transition-all ${viewMode === 'day' ? 'bg-[#484496] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    Día
                  </button>
                  <button
                    onClick={() => setViewMode('week')}
                    className={`px-3 py-1 rounded-md transition-all ${viewMode === 'week' ? 'bg-[#484496] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    Semana
                  </button>
                  <button
                    onClick={() => setViewMode('month')}
                    className={`px-3 py-1 rounded-md transition-all ${viewMode === 'month' ? 'bg-[#484496] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    Mes
                  </button>
                </div>
              </div>
            </div>

            {/* Malla del Calendario Mensual Real Dinámico (Captura 2) */}
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
              {/* Días de la semana */}
              <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200 text-center py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <div>LUN</div>
                <div>MAR</div>
                <div>MIÉ</div>
                <div>JUE</div>
                <div>VIE</div>
                <div>SÁB</div>
                <div>DOM</div>
              </div>

              {/* Malla de Días del Mes */}
              <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 text-xs">
                {/* Días vacíos del mes anterior */}
                {Array.from({ length: firstDayIndex }).map((_, i) => (
                  <div key={`empty-${i}`} className="min-h-[105px] p-2 bg-slate-50/40 text-slate-300 pointer-events-none" />
                ))}

                {/* Días reales del mes activo */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNum = i + 1;
                  const dayApps = getAppsForDay(dayNum);
                  const isCurrentToday = isToday(dayNum);

                  return (
                    <div
                      key={`day-${dayNum}`}
                      className={`min-h-[105px] p-2 transition-colors flex flex-col justify-between ${
                        isCurrentToday ? 'bg-purple-50/30 font-semibold' : 'hover:bg-slate-50/80'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className={`text-xs font-semibold ${
                              isCurrentToday
                                ? 'w-6 h-6 rounded-full bg-[#484496] text-white flex items-center justify-center font-bold shadow-xs'
                                : 'text-slate-600'
                            }`}
                          >
                            {dayNum}
                          </span>
                        </div>

                        {/* Píldoras de Citas para este Día */}
                        <div className="space-y-1">
                          {dayApps.slice(0, 3).map((app) => (
                            <div
                              key={app.id}
                              onClick={() => setDetailApp(app)}
                              className={`p-1.5 rounded text-[10px] font-semibold truncate cursor-pointer transition-all shadow-2xs ${getPillStyle(
                                app.modality,
                                app.status
                              )}`}
                              title={`Ver expediente y notas de ${app.patientName}`}
                            >
                              {app.patientName}
                            </div>
                          ))}

                          {dayApps.length > 3 && (
                            <button
                              onClick={() => setDetailApp(dayApps[3])}
                              className="text-[10px] text-[#484496] font-bold hover:underline pl-1 block"
                            >
                              +{dayApps.length - 3} más
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Leyenda de Colores exactos a Captura 2 */}
            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-medium text-slate-600 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#D99634]" />
                <span>Presencial confirmada</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#438CB9]" />
                <span>Online confirmada</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#2E9D64]" />
                <span>Realizada</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#C84646]" />
                <span>No asistió</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#758195]" />
                <span>Pendiente</span>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal 1: Nueva Cita en Calendario */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100">
            <div className="p-4 bg-[#484496] text-white flex justify-between items-center">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Agendar Cita en Calendario
              </h3>
              <button onClick={() => setIsNewModalOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateAppointment} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nombre del Paciente:</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. María Fernanda Ruiz"
                  value={form.patientName}
                  onChange={(e) => setForm({ ...form, patientName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#484496]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Modalidad:</label>
                <select
                  value={form.modality}
                  onChange={(e) => setForm({ ...form, modality: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#484496]"
                >
                  <option value="PRESENCIAL">Presencial (Consultorio)</option>
                  <option value="ONLINE">Online (Videollamada)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Fecha y Hora de Inicio:</label>
                <input
                  type="datetime-local"
                  required
                  value={form.startDateTime}
                  onChange={(e) => setForm({ ...form, startDateTime: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#484496]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notas del Registro:</label>
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Motivo de la consulta o notas iniciales..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#484496]"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#484496] hover:bg-[#393478] text-white rounded-xl font-semibold shadow-md shadow-[#484496]/20"
                >
                  Guardar Cita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Detalle de Cita, Expediente y Notas del Registro (Persistent Notes) */}
      {detailApp && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
            <div className="p-4 bg-[#484496] text-white flex justify-between items-center">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <User className="w-4 h-4 text-white" />
                Registro Clínico & Expediente del Paciente
              </h3>
              <button onClick={() => setDetailApp(null)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-700">
              {/* Header Info Paciente */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">{detailApp.patientName}</h4>
                  <div className="flex items-center gap-3 text-slate-500 text-[11px] mt-0.5">
                    <span className="flex items-center gap-1 font-mono">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {detailApp.patientPhone || 'Sin teléfono'}
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-slate-700">{detailApp.time}</span>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold ${getPillStyle(
                    detailApp.modality,
                    detailApp.status
                  )}`}
                >
                  {detailApp.modality === 'ONLINE' ? 'Online' : 'Presencial'}
                </span>
              </div>

              {/* Registro de Notas Administrativas Persistentes */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#484496]" />
                  <span>Notas Administrativas de la Cita:</span>
                </label>
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-amber-900 leading-relaxed font-medium">
                  {detailApp.notes || 'Sin notas adicionales.'}
                </div>
              </div>

              {/* Estructura del Registro Clínico SOAP (Persistente) */}
              {detailApp.soap && (
                <div className="space-y-2 border-t border-slate-100 pt-3">
                  <h5 className="font-bold text-slate-800 flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Registro Clínico SOAP de la Sesión:</span>
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                      <strong className="text-slate-800 block mb-0.5">Subjetivo:</strong>
                      <p className="text-slate-600">{detailApp.soap.subjective}</p>
                    </div>

                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                      <strong className="text-slate-800 block mb-0.5">Objetivo:</strong>
                      <p className="text-slate-600">{detailApp.soap.objective}</p>
                    </div>

                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                      <strong className="text-slate-800 block mb-0.5">Análisis / Diagnóstico:</strong>
                      <p className="text-slate-600">{detailApp.soap.assessment}</p>
                    </div>

                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                      <strong className="text-slate-800 block mb-0.5">Plan Terapéutico:</strong>
                      <p className="text-slate-600">{detailApp.soap.plan}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Botones de Acción Rápida */}
              <div className="pt-3 flex flex-wrap items-center justify-end gap-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    const cleanPhone = detailApp.patientPhone ? detailApp.patientPhone.replace(/\D/g, '') : '';
                    window.open(`https://wa.me/${cleanPhone}`, '_blank');
                  }}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>

                <button
                  onClick={() => {
                    setSessionModalApp(detailApp);
                    setDetailApp(null);
                  }}
                  className="px-3.5 py-2 bg-[#484496] hover:bg-[#393478] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Ver Registro SOAP Completo</span>
                </button>

                <button
                  onClick={() => setDetailApp(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 text-xs font-semibold"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Redactar Registro de Sesión SOAP */}
      {sessionModalApp && (
        <SessionRecordModal
          isOpen={!!sessionModalApp}
          onClose={() => setSessionModalApp(null)}
          appointmentId={sessionModalApp.id}
          patientId={sessionModalApp.patientId || 'pat-demo'}
          patientName={sessionModalApp.patientName}
          onSessionSaved={() => loadData()}
        />
      )}

      <AiCopilotDrawer isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
    </div>
  );
}
