/**
 * Nombre del archivo: src/components/IdentitySettingsModal.tsx
 * Descripción: Modal e interfaz para configurar la Identidad Documental del profesional (Nombre personal, Consultorio Privado, Centro Psicológico).
 * Fecha de última modificación: 2026-09-18
 * Autor: Psicolobos Development Team
 */

'use client';

import React, { useState, useEffect } from 'react';
import { X, Building2, UserCheck, ShieldCheck, Check, Sparkles, Award, FileText } from 'lucide-react';

interface IdentitySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIdentitySaved?: (identity: any) => void;
}

export default function IdentitySettingsModal({ isOpen, onClose, onIdentitySaved }: IdentitySettingsModalProps) {
  const [identities, setIdentities] = useState<any[]>([]);
  const [selectedType, setSelectedType] = useState<'PERSONAL_NAME' | 'CENTER_NAME' | 'CUSTOM'>('PERSONAL_NAME');
  const [form, setForm] = useState({
    name: 'Consultorio Principal',
    displayName: '',
    professionalName: '',
    title: 'Psicólogo Clínico',
    colegiatura: '',
    specialty: 'Psicología Clínica',
    centerName: '',
    address: '',
    phone: '',
    email: '',
    whatsapp: '',
    website: '',
    isDefault: true,
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/identities')
        .then((res) => res.json())
        .then((data) => {
          if (data.identities) {
            setIdentities(data.identities);
            const def = data.identities.find((i: any) => i.isDefault) || data.identities[0];
            if (def) {
              setSelectedType(def.identityType || 'PERSONAL_NAME');
              setForm({
                name: def.name || 'Consultorio Principal',
                displayName: def.displayName || '',
                professionalName: def.professionalName || '',
                title: def.title || 'Psicólogo Clínico',
                colegiatura: def.colegiatura || '',
                specialty: def.specialty || 'Psicología Clínica',
                centerName: def.centerName || '',
                address: def.address || '',
                phone: def.phone || '',
                email: def.email || '',
                whatsapp: def.whatsapp || '',
                website: def.website || '',
                isDefault: def.isDefault ?? true,
              });
            }
          }
        })
        .catch(console.error);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    let calculatedDisplayName = form.displayName;
    if (selectedType === 'PERSONAL_NAME') {
      calculatedDisplayName = `${form.title ? form.title + ' ' : ''}${form.professionalName}`.trim();
    } else if (selectedType === 'CENTER_NAME') {
      calculatedDisplayName = form.centerName || 'Centro Psicológico';
    }

    try {
      const res = await fetch('/api/identities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          identityType: selectedType,
          displayName: calculatedDisplayName || form.name,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert('Identidad documental guardada y configurada.');
        if (onIdentitySaved) onIdentitySaved(data.identity);
        onClose();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-200">
        {/* Header Modal */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Building2 className="w-5 h-5 text-sage-400" />
            <div>
              <h3 className="text-sm font-bold">Identidad Documental para Certificados e Informes</h3>
              <p className="text-[11px] text-slate-400">Configura el membrete profesional de tus documentos</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
          {/* Pregunta Principal */}
          <div className="bg-sage-50 border border-sage-200 p-3.5 rounded-xl space-y-2">
            <label className="font-bold text-sage-900 block text-xs">
              ¿Cómo quieres que aparezca tu nombre en tus certificados e informes?
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedType('PERSONAL_NAME')}
                className={`p-2.5 rounded-lg border text-center font-semibold transition-all ${
                  selectedType === 'PERSONAL_NAME'
                    ? 'bg-sage-600 text-white border-sage-700 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                1. Nombre Personal
              </button>
              <button
                type="button"
                onClick={() => setSelectedType('CENTER_NAME')}
                className={`p-2.5 rounded-lg border text-center font-semibold transition-all ${
                  selectedType === 'CENTER_NAME'
                    ? 'bg-sage-600 text-white border-sage-700 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                2. Nombre de Centro
              </button>
              <button
                type="button"
                onClick={() => setSelectedType('CUSTOM')}
                className={`p-2.5 rounded-lg border text-center font-semibold transition-all ${
                  selectedType === 'CUSTOM'
                    ? 'bg-sage-600 text-white border-sage-700 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                3. Personalizado
              </button>
            </div>
          </div>

          {/* Campos dinámicos según tipo */}
          {selectedType === 'PERSONAL_NAME' && (
            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nombre Profesional:</label>
                <input
                  type="text"
                  required
                  value={form.professionalName}
                  onChange={(e) => setForm({ ...form, professionalName: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  placeholder="Max Arteaga"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Título Profesional:</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  placeholder="Psicólogo Clínico"
                />
              </div>
            </div>
          )}

          {selectedType === 'CENTER_NAME' && (
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <label className="block font-semibold text-slate-700 mb-1">Nombre del Consultorio o Centro:</label>
              <input
                type="text"
                required
                value={form.centerName}
                onChange={(e) => setForm({ ...form, centerName: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                placeholder="Centro Psicológico Equilibrio"
              />
            </div>
          )}

          {selectedType === 'CUSTOM' && (
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <label className="block font-semibold text-slate-700 mb-1">Encabezado Impreso Personalizado:</label>
              <input
                type="text"
                required
                value={form.displayName}
                onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                placeholder="Lic. Max Arteaga — Psicología Integral"
              />
            </div>
          )}

          {/* Detalles Profesionales */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">N° Colegiatura / Registro:</label>
              <input
                type="text"
                value={form.colegiatura}
                onChange={(e) => setForm({ ...form, colegiatura: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg"
                placeholder="CPhP 45892"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Especialidad Principal:</label>
              <input
                type="text"
                value={form.specialty}
                onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg"
                placeholder="Terapia Cognitivo-Conductual"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Teléfono / WhatsApp Profesional:</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg"
                placeholder="+51 987654321"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Dirección Profesional:</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg"
                placeholder="Av. Principal 123, Of. 402"
              />
            </div>
          </div>

          {/* Previsualización del Membrete */}
          <div className="p-3 bg-slate-900 text-white rounded-xl text-center space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Previsualización del Encabezado en Documentos</span>
            <p className="font-extrabold text-sm text-emerald-300">
              {selectedType === 'PERSONAL_NAME'
                ? `${form.title ? form.title + ' ' : ''}${form.professionalName || 'Nombre Profesional'}`
                : selectedType === 'CENTER_NAME'
                ? form.centerName || 'Centro Psicológico'
                : form.displayName || 'Identidad Personalizada'}
            </p>
            <p className="text-[10px] text-slate-300">
              Colegiatura: {form.colegiatura || 'CPhP'} • {form.specialty || 'Psicólogo Clínico'}
            </p>
          </div>

          {/* Footer Modal */}
          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-sage-600 hover:bg-sage-700 text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-sm"
            >
              <Check className="w-4 h-4" />
              <span>{saving ? 'Guardando...' : 'Guardar Identidad Documental'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
