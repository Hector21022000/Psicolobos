/**
 * Nombre del archivo: src/app/appointments/page.tsx
 * Descripción: Página de Gestión de Citas de Psicolobos ajustada a 1 sola cita única activa.
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
  CalendarCheck,
  Plus,
  Filter,
  Eye,
  Edit2,
  Ban,
  Unlock,
  MessageCircle,
  Phone,
  Search,
  Calendar as CalendarIcon,
  RefreshCw,
  X,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export default function AppointmentsPage() {
  const router = useRouter();
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'proximas' | 'pasadas'>('proximas');
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals de acciones
  const [sessionModalApp, setSessionModalApp] = useState<any>(null);
  const [editingApp, setEditingApp] = useState<any>(null);
  const [blockingApp, setBlockingApp] = useState<any>(null);
  const [unblockingApp, setUnblockingApp] = useState<any>(null);

  // Formulario de Edición
  const [editForm, setEditForm] = useState({
    title: '',
    startDateTime: '',
    modality: 'PRESENCIAL',
    status: 'CONFIRMED',
    notes: '',
  });

  // Filtros
  const [search, setSearch] = useState('');
  const [modalityFilter, setModalityFilter] = useState('Todas');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Cita única inicial
  const initialDemoApps = [
    {
      id: 'demo-1',
      date: '05/06/2026',
      time: '12:00 – 13:00',
      patientName: 'Manuel Lopez',
      phone: '699688644',
      modality: 'Presencial',
      status: 'Confirmada',
      rawStatus: 'CONFIRMED',
      rawModality: 'PRESENCIAL',
      startDateTime: '2026-06-05T12:00',
    },
  ];

  const [demoApps, setDemoApps] = useState(initialDemoApps);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/appointments');
      if (res.ok) {
        const data = await res.json();
        setAppointments(data.appointments || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleWhatsAppConfirmation = (phone: string, patientName: string, dateStr: string) => {
    const cleanPhone = phone ? phone.replace(/\D/g, '') : '';
    const text = encodeURIComponent(
      `Hola ${patientName}, te saludamos de la consulta de psicología. Te recordamos tu cita agendada para ${dateStr}. Por favor confirma tu asistencia respondiendo CONFIRMAR.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  // Abrir Modal de Edición
  const handleOpenEdit = (app: any) => {
    setEditingApp(app);
    setEditForm({
      title: app.title || `Consulta con ${app.patientName || app.patient?.firstName}`,
      startDateTime: app.startDateTime ? new Date(app.startDateTime).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
      modality: app.rawModality || (app.modality === 'Online' ? 'ONLINE' : 'PRESENCIAL'),
      status: app.rawStatus || (app.status === 'Confirmada' ? 'CONFIRMED' : app.status === 'Cancelada' ? 'CANCELLED' : 'PENDING'),
      notes: app.notes || '',
    });
  };

  // Guardar Edición
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApp) return;

    if (editingApp.id.startsWith('demo-')) {
      setDemoApps((prev) =>
        prev.map((item) =>
          item.id === editingApp.id
            ? {
                ...item,
                modality: editForm.modality === 'ONLINE' ? 'Online' : 'Presencial',
                status: editForm.status === 'CONFIRMED' ? 'Confirmada' : editForm.status === 'CANCELLED' ? 'Cancelada' : 'Pendiente',
                rawStatus: editForm.status,
                rawModality: editForm.modality,
              }
            : item
        )
      );
      setEditingApp(null);
      alert('Cita actualizada exitosamente.');
      return;
    }

    try {
      const res = await fetch('/api/appointments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingApp.id,
          title: editForm.title,
          startDateTime: editForm.startDateTime,
          modality: editForm.modality,
          status: editForm.status,
          notes: editForm.notes,
        }),
      });

      if (res.ok) {
        alert('Cita modificada correctamente.');
        setEditingApp(null);
        loadAppointments();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Confirmar Bloqueo / Cancelación de Cita
  const handleConfirmBlock = async () => {
    if (!blockingApp) return;

    if (blockingApp.id.startsWith('demo-')) {
      setDemoApps((prev) =>
        prev.map((item) =>
          item.id === blockingApp.id
            ? { ...item, status: 'Cancelada / Bloqueada', rawStatus: 'CANCELLED' }
            : item
        )
      );
      setBlockingApp(null);
      alert('Cita cancelada/bloqueada en el sistema.');
      return;
    }

    try {
      const res = await fetch('/api/appointments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: blockingApp.id,
          status: 'CANCELLED',
        }),
      });

      if (res.ok) {
        alert('La cita ha sido marcada como Cancelada / Bloqueada.');
        setBlockingApp(null);
        loadAppointments();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Confirmar Desbloqueo / Reactivación de Cita
  const handleConfirmUnblock = async () => {
    if (!unblockingApp) return;

    if (unblockingApp.id.startsWith('demo-')) {
      setDemoApps((prev) =>
        prev.map((item) =>
          item.id === unblockingApp.id
            ? { ...item, status: 'Confirmada', rawStatus: 'CONFIRMED' }
            : item
        )
      );
      setUnblockingApp(null);
      alert('Cita desbloqueada y reactivada exitosamente.');
      return;
    }

    try {
      const res = await fetch('/api/appointments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: unblockingApp.id,
          status: 'CONFIRMED',
        }),
      });

      if (res.ok) {
        alert('La cita ha sido desbloqueada y reactivada en la agenda.');
        setUnblockingApp(null);
        loadAppointments();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex h-screen bg-transparent overflow-hidden">
      <Sidebar onOpenAiCopilot={() => setIsAiOpen(true)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Navbar onOpenAiCopilot={() => setIsAiOpen(true)} />

        <main className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Header Gestión de Citas (Captura 3) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                <CalendarCheck className="w-6 h-6 text-slate-800" />
                Gestión de citas
              </h1>
              <p className="text-xs text-slate-500">Listado completo con filtros y acciones rápidas.</p>
            </div>

            <button
              onClick={() => router.push('/agenda')}
              className="px-4 py-2.5 bg-[#484496] hover:bg-[#393478] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-[#484496]/20"
            >
              <Plus className="w-4 h-4" />
              <span>+ Nueva cita</span>
            </button>
          </div>

          {/* Tarjeta 1: Filtros de Citas */}
          <div className="clinical-card p-6 space-y-5">
            {/* Pestañas Próximas citas / Citas pasadas */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveSubTab('proximas')}
                className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-all ${
                  activeSubTab === 'proximas'
                    ? 'bg-[#484496] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <CalendarIcon className="w-3.5 h-3.5" />
                <span>Próximas citas</span>
              </button>

              <button
                onClick={() => setActiveSubTab('pasadas')}
                className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-all border ${
                  activeSubTab === 'pasadas'
                    ? 'border-amber-500 text-amber-700 bg-amber-50'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Citas pasadas</span>
              </button>
            </div>

            {/* Fila de Filtros Avanzados */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3 items-end">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Buscar</label>
                <input
                  type="text"
                  placeholder="Nombre o teléfono"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#484496]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Modalidad</label>
                <select
                  value={modalityFilter}
                  onChange={(e) => setModalityFilter(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#484496]"
                >
                  <option>Todas</option>
                  <option>Presencial</option>
                  <option>Online</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Estado</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#484496]"
                >
                  <option>Todos</option>
                  <option>Confirmada</option>
                  <option>Pendiente</option>
                  <option>Realizada</option>
                  <option>No asistió</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Desde</label>
                <input
                  type="text"
                  placeholder="dd/mm/aaaa"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#484496]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Hasta</label>
                <input
                  type="text"
                  placeholder="dd/mm/aaaa"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#484496]"
                />
              </div>

              <button
                onClick={() => loadAppointments()}
                className="w-full py-2 bg-[#484496] hover:bg-[#393478] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Filtrar</span>
              </button>

              <button
                onClick={() => {
                  setSearch('');
                  setModalityFilter('Todas');
                  setStatusFilter('Todos');
                  setFromDate('');
                  setToDate('');
                }}
                className="w-full py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-semibold"
              >
                Limpiar
              </button>
            </div>
          </div>

          {/* Tarjeta 2: Tabla de Citas */}
          <div className="clinical-card p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 font-semibold border-b border-slate-100 uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">FECHA Y HORA</th>
                    <th className="py-3 px-4">PACIENTE</th>
                    <th className="py-3 px-4">TELÉFONO</th>
                    <th className="py-3 px-4">MODALIDAD</th>
                    <th className="py-3 px-4">ESTADO</th>
                    <th className="py-3 px-4 text-right">ACCIONES</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {/* Filas de Citas Demo Interactiva */}
                  {demoApps.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-4 font-bold text-slate-800">
                        <div>{app.date}</div>
                        <div className="text-[11px] font-normal text-slate-500">{app.time}</div>
                      </td>
                      <td className="py-4 px-4 font-semibold text-slate-800">{app.patientName}</td>
                      <td className="py-4 px-4 space-y-1.5">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-mono">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{app.phone}</span>
                        </div>
                        <br />
                        <button
                          onClick={() => handleWhatsAppConfirmation(app.phone, app.patientName, `${app.date} ${app.time}`)}
                          className="px-3 py-1 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold flex items-center gap-1.5 shadow-2xs"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Mensaje confirmación</span>
                        </button>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-semibold border ${
                          app.modality === 'Online'
                            ? 'bg-cyan-50 text-cyan-700 border-cyan-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {app.modality}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-semibold border flex items-center gap-1 w-fit ${
                          app.status.includes('Cancelada')
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : app.status === 'Confirmada'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-sky-50 text-sky-700 border-sky-200'
                        }`}>
                          <span>{app.status}</span>
                          <RefreshCw className="w-3 h-3 text-current opacity-70" />
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2 text-slate-400">
                          {/* 👁️ Botón Ver / Registro de Sesión */}
                          <button
                            onClick={() => setSessionModalApp(app)}
                            className="p-1.5 rounded-lg hover:text-[#484496] hover:bg-purple-50 transition-colors"
                            title="Ver registro de sesión"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* ✏️ Botón Editar Cita */}
                          <button
                            onClick={() => handleOpenEdit(app)}
                            className="p-1.5 rounded-lg hover:text-[#484496] hover:bg-purple-50 transition-colors"
                            title="Editar cita"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* 🔓 / 🚫 Botón Bloquear o Desbloquear Cita */}
                          {app.rawStatus === 'CANCELLED' || app.status?.includes('Cancelada') || app.status === 'CANCELLED' ? (
                            <button
                              onClick={() => setUnblockingApp(app)}
                              className="p-1.5 rounded-lg text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-colors flex items-center gap-1 text-[11px] font-medium"
                              title="Desbloquear / Reactivar cita"
                            >
                              <Unlock className="w-4 h-4" />
                              <span className="hidden sm:inline">Desbloquear</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => setBlockingApp(app)}
                              className="p-1.5 rounded-lg hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Cancelar o bloquear cita"
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}

                  {/* Citas cargadas dinámicamente desde API */}
                  {appointments.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-4 font-bold text-slate-800">
                        <div>{new Date(app.startDateTime).toLocaleDateString('es-ES')}</div>
                        <div className="text-[11px] font-normal text-slate-500">
                          {new Date(app.startDateTime).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="py-4 px-4 font-semibold text-slate-800">
                        {app.patient?.firstName} {app.patient?.lastName}
                      </td>
                      <td className="py-4 px-4 space-y-1.5">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-mono">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{app.patient?.phone || 'Sin cel'}</span>
                        </div>
                        <br />
                        <button
                          onClick={() => handleWhatsAppConfirmation(app.patient?.phone, `${app.patient?.firstName}`, `${new Date(app.startDateTime).toLocaleDateString('es-ES')}`)}
                          className="px-3 py-1 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold flex items-center gap-1.5 shadow-2xs"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Mensaje confirmación</span>
                        </button>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          {app.modality}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-semibold border flex items-center gap-1 w-fit ${
                          app.status === 'CANCELLED' || app.status?.includes('Cancelada')
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}>
                          <span>{app.status || 'Confirmada'}</span>
                          <RefreshCw className="w-3 h-3 text-current opacity-70" />
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2 text-slate-400">
                          <button
                            onClick={() => setSessionModalApp(app)}
                            className="p-1.5 rounded-lg hover:text-[#484496] hover:bg-purple-50 transition-colors"
                            title="Ver registro de sesión"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleOpenEdit(app)}
                            className="p-1.5 rounded-lg hover:text-[#484496] hover:bg-purple-50 transition-colors"
                            title="Editar cita"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {app.status === 'CANCELLED' || app.status?.includes('Cancelada') ? (
                            <button
                              onClick={() => setUnblockingApp(app)}
                              className="p-1.5 rounded-lg text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-colors flex items-center gap-1 text-[11px] font-medium"
                              title="Desbloquear / Reactivar cita"
                            >
                              <Unlock className="w-4 h-4" />
                              <span className="hidden sm:inline">Desbloquear</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => setBlockingApp(app)}
                              className="p-1.5 rounded-lg hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Cancelar o bloquear cita"
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Modal 1: Registro de Sesión (Boton Ver Eye) */}
      {sessionModalApp && (
        <SessionRecordModal
          isOpen={!!sessionModalApp}
          onClose={() => setSessionModalApp(null)}
          appointmentId={sessionModalApp.id}
          patientId={sessionModalApp.patientId || 'patient-demo'}
          patientName={sessionModalApp.patientName || `${sessionModalApp.patient?.firstName} ${sessionModalApp.patient?.lastName}`}
          onSessionSaved={() => loadAppointments()}
        />
      )}

      {/* Modal 2: Editar Cita (Boton Lápiz Edit) */}
      {editingApp && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200">
            <div className="p-4 bg-[#484496] text-white flex justify-between items-center">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-white" />
                Editar Cita: {editingApp.patientName || `${editingApp.patient?.firstName} ${editingApp.patient?.lastName}`}
              </h3>
              <button onClick={() => setEditingApp(null)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Título de la Sesión / Cita</label>
                <input
                  type="text"
                  required
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#484496]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Fecha y Hora de Inicio</label>
                <input
                  type="datetime-local"
                  required
                  value={editForm.startDateTime}
                  onChange={(e) => setEditForm({ ...editForm, startDateTime: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#484496]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Modalidad</label>
                  <select
                    value={editForm.modality}
                    onChange={(e) => setEditForm({ ...editForm, modality: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#484496]"
                  >
                    <option value="PRESENCIAL">Presencial (Consultorio)</option>
                    <option value="ONLINE">Online (Videollamada)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Estado de la Cita</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#484496]"
                  >
                    <option value="CONFIRMED">Confirmada</option>
                    <option value="PENDING">Pendiente</option>
                    <option value="COMPLETED">Realizada</option>
                    <option value="CANCELLED">Cancelada / Bloqueada</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notas Administrativas Internas</label>
                <textarea
                  rows={3}
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  placeholder="Ej. Paciente confirmó por WhatsApp..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#484496]"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingApp(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#484496] hover:bg-[#393478] text-white rounded-xl font-semibold flex items-center gap-1.5 shadow-md shadow-[#484496]/20"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Guardar Cambios</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Bloquear / Cancelar Cita (Boton Ban Circle Slash) */}
      {blockingApp && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-200">
            <div className="p-4 bg-rose-600 text-white flex justify-between items-center">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-white" />
                Bloquear / Cancelar Cita
              </h3>
              <button onClick={() => setBlockingApp(null)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs text-slate-700">
              <p>
                ¿Estás seguro de que deseas bloquear o cancelar la cita de{' '}
                <strong className="text-slate-900 font-bold">
                  {blockingApp.patientName || `${blockingApp.patient?.firstName} ${blockingApp.patient?.lastName}`}
                </strong>{' '}
                programada para el <strong className="text-slate-900">{blockingApp.date || 'día seleccionado'}</strong>?
              </p>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 font-medium">
                La cita cambiará su estado a <strong>Cancelada / Bloqueada</strong> y liberará el horario en tu agenda pública.
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  onClick={() => setBlockingApp(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50"
                >
                  No, mantener
                </button>
                <button
                  onClick={handleConfirmBlock}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-semibold flex items-center gap-1.5 shadow-sm"
                >
                  <Ban className="w-4 h-4" />
                  <span>Sí, Bloquear / Cancelar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 4: Desbloquear / Reactivar Cita */}
      {unblockingApp && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-200">
            <div className="p-4 bg-emerald-600 text-white flex justify-between items-center">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Unlock className="w-4 h-4 text-white" />
                Desbloquear / Reactivar Cita
              </h3>
              <button onClick={() => setUnblockingApp(null)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs text-slate-700">
              <p>
                ¿Estás seguro de que deseas desbloquear la cita de{' '}
                <strong className="text-slate-900 font-bold">
                  {unblockingApp.patientName || `${unblockingApp.patient?.firstName} ${unblockingApp.patient?.lastName}`}
                </strong>{' '}
                programada para el <strong className="text-slate-900">{unblockingApp.date || 'día seleccionado'}</strong>?
              </p>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-900 font-medium flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  La cita cambiará su estado a <strong>Confirmada / Activa</strong> y volverá a reservar el cupo en tu agenda clínica.
                </span>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  onClick={() => setUnblockingApp(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmUnblock}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold flex items-center gap-1.5 shadow-sm"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Sí, Desbloquear Cita</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <AiCopilotDrawer isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
    </div>
  );
}

