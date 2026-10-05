/**
 * Nombre del archivo: src/components/SessionRecordModal.tsx
 * Descripción: Modal para la creación y edición del Registro Clínico de Sesión asociado a citas y expedientes de pacientes, con soporte para subir PDF por apartado y crear apartados personalizados ilimitados.
 * Fecha de última modificación: 2026-09-30
 * Autor: Psicolobos Development Team
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Clock,
  FileText,
  CheckCircle2,
  Lock,
  Save,
  Sparkles,
  AlertCircle,
  Edit3,
  Plus,
  Trash2,
  Paperclip,
  FileUp,
  ExternalLink,
} from 'lucide-react';

interface CustomSection {
  id: string;
  title: string;
  content: string;
  fileUrl?: string;
  fileName?: string;
}

interface SessionRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentId?: string;
  patientId?: string;
  patientName?: string;
  sessionToEdit?: any;
  onSessionSaved?: () => void;
}

export default function SessionRecordModal({
  isOpen,
  onClose,
  appointmentId,
  patientId,
  patientName,
  sessionToEdit,
  onSessionSaved,
}: SessionRecordModalProps) {
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState(patientId || sessionToEdit?.patientId || '');
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const [form, setForm] = useState({
    sessionDate: new Date().toISOString().split('T')[0],
    startTime: '10:00',
    endTime: '10:50',
    modality: 'PRESENCIAL',
    sessionNumber: 1,
    status: 'COMPLETED',
    objective: '',
    observations: '',
    topicsAddressed: '',
    observedBehaviors: '',
    interventions: '',
    techniquesUsed: '',
    patientResponse: '',
    evolution: '',
    agreements: '',
    assignedHomework: '',
    nextSessionPlan: '',
    privateNotes: '',
    isDraft: false,
  });

  const [customSections, setCustomSections] = useState<CustomSection[]>([]);

  useEffect(() => {
    if (isOpen) {
      if (sessionToEdit) {
        setSelectedPatientId(sessionToEdit.patientId || patientId || '');

        let cleanPrivateNotes = sessionToEdit.privateNotes || '';
        let loadedCustomSections: CustomSection[] = [];

        if (cleanPrivateNotes.includes('--- SECCIONES_PERSONALIZADAS_JSON ---')) {
          const parts = cleanPrivateNotes.split('--- SECCIONES_PERSONALIZADAS_JSON ---');
          cleanPrivateNotes = parts[0].trim();
          try {
            loadedCustomSections = JSON.parse(parts[1].trim());
          } catch (e) {
            console.error('Error al deserializar apartados personalizados:', e);
          }
        }

        setCustomSections(loadedCustomSections);

        setForm({
          sessionDate: sessionToEdit.sessionDate ? new Date(sessionToEdit.sessionDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          startTime: sessionToEdit.startTime || '10:00',
          endTime: sessionToEdit.endTime || '10:50',
          modality: sessionToEdit.modality || 'PRESENCIAL',
          sessionNumber: sessionToEdit.sessionNumber || 1,
          status: sessionToEdit.status || 'COMPLETED',
          objective: sessionToEdit.objective || '',
          observations: sessionToEdit.observations || '',
          topicsAddressed: sessionToEdit.topicsAddressed || '',
          observedBehaviors: sessionToEdit.observedBehaviors || '',
          interventions: sessionToEdit.interventions || '',
          techniquesUsed: sessionToEdit.techniquesUsed || '',
          patientResponse: sessionToEdit.patientResponse || '',
          evolution: sessionToEdit.evolution || '',
          agreements: sessionToEdit.agreements || '',
          assignedHomework: sessionToEdit.assignedHomework || '',
          nextSessionPlan: sessionToEdit.nextSessionPlan || '',
          privateNotes: cleanPrivateNotes,
          isDraft: Boolean(sessionToEdit.isDraft),
        });
      } else {
        setSelectedPatientId(patientId || '');
        setCustomSections([]);
        setForm({
          sessionDate: new Date().toISOString().split('T')[0],
          startTime: '10:00',
          endTime: '10:50',
          modality: 'PRESENCIAL',
          sessionNumber: 1,
          status: 'COMPLETED',
          objective: '',
          observations: '',
          topicsAddressed: '',
          observedBehaviors: '',
          interventions: '',
          techniquesUsed: '',
          patientResponse: '',
          evolution: '',
          agreements: '',
          assignedHomework: '',
          nextSessionPlan: '',
          privateNotes: '',
          isDraft: false,
        });
      }

      if (!patientId && !sessionToEdit?.patientId) {
        fetch('/api/patients')
          .then((res) => res.json())
          .then((data) => {
            if (data.patients) {
              setPatients(data.patients);
              if (!selectedPatientId && data.patients.length > 0) {
                setSelectedPatientId(data.patients[0].id);
              }
            }
          })
          .catch(console.error);
      }
    }
  }, [isOpen, patientId, sessionToEdit]);

  if (!isOpen) return null;

  const isEditing = Boolean(sessionToEdit?.id);

  // Manejador para la subida de archivos adjuntos (PDF/DOCX) a campos específicos (ej. Respuesta del Paciente)
  const handleFileUploadForField = async (
    fieldKey: keyof typeof form,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(fieldKey as string);

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (selectedPatientId) formData.append('patientId', selectedPatientId);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const attachmentRef = `\n\n📎 [PDF Adjunto: ${data.fileName}](${data.fileUrl})`;
        const extractedMsg = data.extractedText ? `\n\nTexto extraído del documento:\n${data.extractedText}` : '';
        const currentVal = form[fieldKey] as string;

        setForm((prev) => ({
          ...prev,
          [fieldKey]: (currentVal ? currentVal + attachmentRef : `Documento adjunto: ${data.fileName}` + attachmentRef) + extractedMsg,
        }));

        alert(`¡Archivo "${data.fileName}" adjuntado con éxito!`);
      } else {
        alert(data.error || 'Error al subir el archivo');
      }
    } catch (err) {
      console.error('Error al subir archivo:', err);
      alert('Error en la conexión al subir archivo');
    } finally {
      setUploadingField(null);
    }
  };

  // Manejo de Secciones Personalizadas Dinámicas ("Crear más apartados")
  const handleAddCustomSection = () => {
    const newSec: CustomSection = {
      id: Date.now().toString(),
      title: '',
      content: '',
    };
    setCustomSections((prev) => [...prev, newSec]);
  };

  const handleRemoveCustomSection = (id: string) => {
    setCustomSections((prev) => prev.filter((s) => s.id !== id));
  };

  const handleUpdateCustomSection = (
    id: string,
    field: keyof CustomSection,
    value: string
  ) => {
    setCustomSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleCustomSectionFileUpload = async (
    id: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (selectedPatientId) formData.append('patientId', selectedPatientId);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setCustomSections((prev) =>
          prev.map((s) =>
            s.id === id
              ? {
                  ...s,
                  fileUrl: data.fileUrl,
                  fileName: data.fileName,
                  content: s.content ? `${s.content}\n\n📎 PDF Adjunto: ${data.fileName}` : `PDF Adjunto: ${data.fileName}`,
                }
              : s
          )
        );
        alert(`PDF "${data.fileName}" adjuntado al apartado correctamente.`);
      } else {
        alert(data.error || 'Error al subir el PDF');
      }
    } catch (err) {
      console.error('Error subiendo PDF al apartado:', err);
    }
  };

  const handleSave = async (isDraftMode: boolean) => {
    if (!selectedPatientId) {
      alert('Por favor selecciona un paciente');
      return;
    }

    setSaving(true);
    try {
      const url = isEditing ? `/api/sessions/${sessionToEdit.id}` : '/api/sessions';
      const method = isEditing ? 'PUT' : 'POST';

      // Serialización elegante de apartados personalizados en privateNotes
      let finalPrivateNotes = form.privateNotes || '';
      if (customSections.length > 0) {
        finalPrivateNotes = `${finalPrivateNotes.trim()}\n\n--- SECCIONES_PERSONALIZADAS_JSON ---\n${JSON.stringify(customSections)}`;
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          privateNotes: finalPrivateNotes,
          patientId: selectedPatientId,
          appointmentId: appointmentId || sessionToEdit?.appointmentId || null,
          isDraft: isDraftMode,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert(
          isEditing
            ? 'Registro clínico de sesión actualizado correctamente.'
            : isDraftMode
            ? 'Borrador de sesión guardado.'
            : 'Registro clínico de sesión guardado e incorporado al historial del paciente.'
        );
        if (onSessionSaved) onSessionSaved();
        onClose();
      } else {
        alert(data.error || 'Error al guardar la sesión');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden border border-slate-200">
        {/* Header Modal */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-sage-600 text-white">
              {isEditing ? <Edit3 className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-sm font-bold">
                {isEditing ? 'Editar Registro Clínico de Sesión' : 'Nuevo Registro Clínico de Sesión Psicoterapéutica'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {patientName ? `Paciente: ${patientName}` : 'Incorporación al historial del paciente'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Banner Confidencialidad Rigurosa */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center gap-2 text-slate-700 text-[11px] font-medium">
          <Lock className="w-3.5 h-3.5 text-sage-600 shrink-0" />
          <span>
            <strong>CONFIDENCIALIDAD PRIVADA:</strong> Este registro queda protegido en el expediente del paciente. Ninguna nota clínica se transmitirá a Google Calendar ni WhatsApp.
          </span>
        </div>

        {/* Formulario Estructurado */}
        <div className="p-5 space-y-4 max-h-[72vh] overflow-y-auto text-xs bg-slate-50/50">
          {/* Fila 1: Paciente y Datos Administrativos */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-white p-3 rounded-xl border border-slate-200">
            {!patientId && (
              <div className="md:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Paciente:</label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.firstName} {p.lastName} {p.identityDoc ? `(DNI: ${p.identityDoc})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Fecha de Atención:</label>
              <input
                type="date"
                required
                value={form.sessionDate}
                onChange={(e) => setForm({ ...form, sessionDate: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Modalidad:</label>
              <select
                value={form.modality}
                onChange={(e) => setForm({ ...form, modality: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg"
              >
                <option value="PRESENCIAL">Presencial</option>
                <option value="VIRTUAL">Virtual / Videollamada</option>
                <option value="TELEFONICA">Telefónica</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">N° Sesión:</label>
              <input
                type="number"
                min={1}
                value={form.sessionNumber}
                onChange={(e) => setForm({ ...form, sessionNumber: parseInt(e.target.value, 10) || 1 })}
                className="w-full p-2 border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          {/* Fila 2: Motivo y Observaciones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <label className="block font-semibold text-slate-700 mb-1">Motivo de Consulta de esta Sesión:</label>
              <textarea
                rows={2}
                value={form.objective}
                onChange={(e) => setForm({ ...form, objective: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50"
                placeholder="Foco o motivo traído por el paciente a la atención..."
              />
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <label className="block font-semibold text-slate-700 mb-1">Temas Abordados y Conductas Observadas:</label>
              <textarea
                rows={2}
                value={form.topicsAddressed}
                onChange={(e) => setForm({ ...form, topicsAddressed: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50"
                placeholder="Expresión afectiva, lenguaje corporal, estresores..."
              />
            </div>
          </div>

          {/* Fila 3: Intervenciones y Respuesta del Paciente (con Subida de PDF) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <label className="block font-semibold text-slate-700 mb-1">Intervenciones y Técnicas Aplicadas:</label>
              <textarea
                rows={3}
                value={form.interventions}
                onChange={(e) => setForm({ ...form, interventions: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50"
                placeholder="Reestructuración cognitiva, respiración diafragmática..."
              />
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="font-semibold text-slate-700">Respuesta del Paciente y Acuerdos:</label>
                <label className="cursor-pointer px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-[#484496] border border-purple-200 text-[11px] font-semibold rounded-lg flex items-center gap-1 transition-all shadow-2xs">
                  <Paperclip className="w-3.5 h-3.5" />
                  <span>{uploadingField === 'patientResponse' ? 'Subiendo PDF...' : 'Subir PDF / Adjunto'}</span>
                  <input
                    type="file"
                    accept=".pdf,.docx,.doc,.png,.jpg,.jpeg,.txt"
                    onChange={(e) => handleFileUploadForField('patientResponse', e)}
                    className="hidden"
                  />
                </label>
              </div>
              <textarea
                rows={3}
                value={form.patientResponse}
                onChange={(e) => setForm({ ...form, patientResponse: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50"
                placeholder="Aceptación de la técnica, compromisos alcanzados o documento adjunto..."
              />
            </div>
          </div>

          {/* Fila 4: Tareas para Casa & Próximos Objetivos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <label className="block font-semibold text-slate-700 mb-1">Tareas Asignadas para Casa:</label>
              <input
                type="text"
                value={form.assignedHomework}
                onChange={(e) => setForm({ ...form, assignedHomework: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50"
                placeholder="Registro diario de pensamientos automáticos..."
              />
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <label className="block font-semibold text-slate-700 mb-1">Próximos Objetivos o Plan:</label>
              <input
                type="text"
                value={form.nextSessionPlan}
                onChange={(e) => setForm({ ...form, nextSessionPlan: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50"
                placeholder="Revisión de exposición graduada..."
              />
            </div>
          </div>

          {/* Fila 5: Texto Libre - Notas de Sesión */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
            <label className="block font-bold text-slate-800 text-xs">
              Notas Libres del Psicólogo (Registro Clínico Profesional):
            </label>
            <p className="text-[10px] text-slate-400">
              Espacio de redacción libre para impresiones subjetivas o detalle de la sesión.
            </p>
            <textarea
              rows={3}
              value={form.privateNotes}
              onChange={(e) => setForm({ ...form, privateNotes: e.target.value })}
              className="w-full p-3 border border-slate-300 rounded-lg text-xs font-sans leading-relaxed focus:ring-2 focus:ring-sage-500"
              placeholder="Escriba aquí las observaciones clínicas detalladas..."
            />
          </div>

          {/* Fila 6: Apartados y Secciones Personalizadas (Creación Dinámica) */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-100 pb-2">
              <div>
                <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#484496]" />
                  Apartados y Secciones Personalizadas
                </h4>
                <p className="text-[10px] text-slate-500">
                  Agrega apartados adicionales personalizados con su respectivo contenido y opción de adjuntar PDF.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddCustomSection}
                className="px-3 py-1.5 bg-[#484496] hover:bg-[#393478] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs transition-all shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Crear nuevo apartado</span>
              </button>
            </div>

            {customSections.length > 0 ? (
              <div className="space-y-3 pt-1">
                {customSections.map((sec, index) => (
                  <div key={sec.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        placeholder={`Título del Apartado N° ${index + 1} (ej. Acuerdos Financieros, Observaciones)`}
                        value={sec.title}
                        onChange={(e) => handleUpdateCustomSection(sec.id, 'title', e.target.value)}
                        className="w-full p-2 text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#484496]"
                      />
                      <label className="cursor-pointer shrink-0 px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-[#484496] border border-purple-200 text-[11px] font-semibold rounded-lg flex items-center gap-1 transition-all">
                        <Paperclip className="w-3.5 h-3.5" />
                        <span>{sec.fileName ? 'Cambiar PDF' : 'Subir PDF'}</span>
                        <input
                          type="file"
                          accept=".pdf,.docx,.doc,.png,.jpg,.jpeg,.txt"
                          onChange={(e) => handleCustomSectionFileUpload(sec.id, e)}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => handleRemoveCustomSection(sec.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all shrink-0"
                        title="Eliminar este apartado"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {sec.fileName && sec.fileUrl && (
                      <div className="flex items-center gap-2 text-[11px] bg-purple-50/70 border border-purple-200 p-2 rounded-lg text-purple-900 font-medium">
                        <FileText className="w-4 h-4 text-[#484496] shrink-0" />
                        <span className="truncate">PDF Adjunto: {sec.fileName}</span>
                        <a
                          href={sec.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="ml-auto text-[#484496] underline hover:text-purple-900 flex items-center gap-0.5 text-[10px] font-semibold shrink-0"
                        >
                          <span>Ver PDF</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}

                    <textarea
                      rows={3}
                      placeholder="Detalle o contenido clínico de este apartado..."
                      value={sec.content}
                      onChange={(e) => handleUpdateCustomSection(sec.id, 'content', e.target.value)}
                      className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#484496]"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-xs text-slate-400 bg-slate-50/60 rounded-xl border border-dashed border-slate-200">
                No has agregado apartados personalizados adicionales aún. Haz clic en <strong>"+ Crear nuevo apartado"</strong> para añadir uno.
              </div>
            )}
          </div>
        </div>

        {/* Footer Modal con Borrador y Guardar Final */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-between items-center">
          <span className="text-[11px] text-slate-500 font-medium">
            Última modificación: {new Date().toLocaleTimeString('es-ES')}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-200"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => handleSave(true)}
              disabled={saving}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Borrador</span>
            </button>
            <button
              type="button"
              onClick={() => handleSave(false)}
              disabled={saving}
              className="px-4 py-2 bg-sage-600 hover:bg-sage-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Guardar Registro Final</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
