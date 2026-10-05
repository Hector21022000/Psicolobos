/**
 * Nombre del archivo: src/app/patients/page.tsx
 * Descripción: Directorio general de pacientes de Psicolobos con filtros, tabla interactiva y registro de nuevo paciente.
 * Fecha de última modificación: 2026-09-18
 * Autor: Psicolobos Development Team
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import AiCopilotDrawer from '@/components/AiCopilotDrawer';
import { Users, Plus, Search, Filter, ChevronRight, Phone, Mail, FileText, Sparkles, X, Check } from 'lucide-react';

export default function PatientsPage() {
  const router = useRouter();
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [selectedAiPatientId, setSelectedAiPatientId] = useState<string | undefined>();
  const [patients, setPatients] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Formulario nuevo paciente
  const [newPatient, setNewPatient] = useState({
    firstName: '',
    lastName: '',
    identityDoc: '',
    birthDate: '',
    gender: 'Femenino',
    phone: '',
    email: '',
    emergencyContact: '',
  });

  const loadPatients = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/patients');
      if (res.status === 401) {
        router.push('/login');
        return;
      }
      const data = await res.json();
      if (data.patients) setPatients(data.patients);
    } catch (err) {
      console.error('Error al cargar pacientes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const handleCreatePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPatient),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert('Paciente registrado exitosamente en Psicolobos.');
        setIsAddModalOpen(false);
        setNewPatient({
          firstName: '',
          lastName: '',
          identityDoc: '',
          birthDate: '',
          gender: 'Femenino',
          phone: '',
          email: '',
          emergencyContact: '',
        });
        loadPatients();
      } else {
        alert(data.error || 'Error al guardar paciente');
      }
    } catch (err) {
      console.error('Error al crear paciente:', err);
    }
  };

  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      `${p.firstName} ${p.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      (p.identityDoc && p.identityDoc.includes(search));
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex h-screen bg-transparent overflow-hidden">
      <Sidebar onOpenAiCopilot={() => setIsAiOpen(true)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Navbar
          onOpenAiCopilot={() => setIsAiOpen(true)}
          title="Directorio de Pacientes y Expedientes"
          subtitle="Gestión de datos demográficos, historias clínicas e historia psicoterapéutica"
        />

        <main className="p-6 space-y-6">
          {/* Header Barra de Filtros y Acción */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filtrar paciente por nombre o DNI..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sage-500"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs py-1.5 px-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sage-500 text-slate-700"
              >
                <option value="ALL">Todos los estados</option>
                <option value="ACTIVE">Activos</option>
                <option value="INACTIVE">Inactivos</option>
                <option value="ARCHIVED">Archivados</option>
              </select>
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="w-full sm:w-auto px-4 py-2 bg-sage-600 hover:bg-sage-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar Nuevo Paciente</span>
            </button>
          </div>

          {/* Tabla de Pacientes */}
          <div className="clinical-card overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Pacientes Registrados ({filteredPatients.length})
              </h3>
            </div>

            {loading ? (
              <div className="p-12 text-center text-xs text-slate-500">Cargando lista de pacientes...</div>
            ) : filteredPatients.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                      <th className="p-3">Paciente</th>
                      <th className="p-3">DNI / Documento</th>
                      <th className="p-3">Contacto</th>
                      <th className="p-3">Estado</th>
                      <th className="p-3">Fecha de Ingreso</th>
                      <th className="p-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredPatients.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3">
                          <div
                            onClick={() => router.push(`/patients/${p.id}`)}
                            className="flex items-center gap-2.5 cursor-pointer group"
                          >
                            <div className="w-8 h-8 rounded-full bg-sage-600 text-white font-bold flex items-center justify-center text-xs">
                              {p.firstName[0]}
                              {p.lastName[0]}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800 group-hover:text-sage-700">
                                {p.firstName} {p.lastName}
                              </p>
                              <p className="text-[10px] text-slate-400">{p.gender || 'No especificado'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 font-mono text-slate-700">{p.identityDoc || 'Sin registro'}</td>
                        <td className="p-3 text-slate-600">
                          <p>{p.phone || 'Sin cel'}</p>
                          <p className="text-[10px] text-slate-400">{p.email || 'Sin correo'}</p>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              p.status === 'ACTIVE'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="p-3 text-slate-500">
                          {new Date(p.entryDate || p.createdAt).toLocaleDateString('es-ES')}
                        </td>
                        <td className="p-3 text-right space-x-1">
                          <button
                            onClick={() => {
                              setSelectedAiPatientId(p.id);
                              setIsAiOpen(true);
                            }}
                            className="px-2.5 py-1 rounded bg-sage-100 text-sage-800 hover:bg-sage-200 text-[11px] font-medium inline-flex items-center gap-1"
                          >
                            <Sparkles className="w-3 h-3 text-sage-600" />
                            <span>IA</span>
                          </button>
                          <button
                            onClick={() => router.push(`/patients/${p.id}`)}
                            className="px-2.5 py-1 rounded bg-slate-800 text-white hover:bg-slate-900 text-[11px] font-medium inline-flex items-center gap-1"
                          >
                            <span>Expediente</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center text-xs text-slate-500">No se encontraron pacientes registrados.</div>
            )}
          </div>
        </main>
      </div>

      {/* Modal Nuevo Paciente */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Users className="w-4 h-4 text-sage-400" />
                Registrar Nuevo Paciente
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePatient} className="p-5 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nombres *</label>
                  <input
                    type="text"
                    required
                    value={newPatient.firstName}
                    onChange={(e) => setNewPatient({ ...newPatient, firstName: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                    placeholder="María"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Apellidos *</label>
                  <input
                    type="text"
                    required
                    value={newPatient.lastName}
                    onChange={(e) => setNewPatient({ ...newPatient, lastName: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                    placeholder="García"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">DNI / Documento Identidad</label>
                  <input
                    type="text"
                    value={newPatient.identityDoc}
                    onChange={(e) => setNewPatient({ ...newPatient, identityDoc: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                    placeholder="47896321"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Género</label>
                  <select
                    value={newPatient.gender}
                    onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  >
                    <option value="Femenino">Femenino</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Otro">Otro / No binario</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={newPatient.phone}
                    onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                    placeholder="+51 987654321"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    value={newPatient.email}
                    onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                    placeholder="maria@ejemplo.com"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Contacto de Emergencia</label>
                <input
                  type="text"
                  value={newPatient.emergencyContact}
                  onChange={(e) => setNewPatient({ ...newPatient, emergencyContact: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                  placeholder="Esposo: Pedro García (+51 987112233)"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sage-600 hover:bg-sage-700 text-white rounded-lg font-semibold"
                >
                  Guardar Paciente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AiCopilotDrawer
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        selectedPatientId={selectedAiPatientId}
      />
    </div>
  );
}
