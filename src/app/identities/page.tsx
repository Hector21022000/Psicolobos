/**
 * Nombre del archivo: src/app/identities/page.tsx
 * Descripción: Página para administrar y configurar la Identidad Documental del profesional (Nombre personal, Consultorio Privado, Centro Psicológico).
 * Fecha de última modificación: 2026-09-18
 * Autor: Psicolobos Development Team
 */

'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import AiCopilotDrawer from '@/components/AiCopilotDrawer';
import IdentitySettingsModal from '@/components/IdentitySettingsModal';
import { Building2, Plus, CheckCircle2, ShieldCheck, Award } from 'lucide-react';

export default function IdentitiesPage() {
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [identities, setIdentities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadIdentities = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/identities');
      const data = await res.json();
      if (data.identities) setIdentities(data.identities);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIdentities();
  }, []);

  return (
    <div className="flex h-screen bg-transparent overflow-hidden">
      <Sidebar onOpenAiCopilot={() => setIsAiOpen(true)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Navbar
          onOpenAiCopilot={() => setIsAiOpen(true)}
          title="Configuración de Identidad Documental"
          subtitle="Define cómo debe aparecer tu nombre o centro psicológico en los informes y certificados emitidos"
        />

        <main className="p-6 space-y-6">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-sage-600" />
                Identidades Documentales Configuradas ({identities.length})
              </h3>
              <p className="text-xs text-slate-500">Múltiples membretes profesionales para emitir informes</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-sage-600 hover:bg-sage-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Identidad Documental</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading ? (
              <div className="md:col-span-2 clinical-card p-12 text-center text-xs text-slate-500">Cargando identidades...</div>
            ) : identities.length > 0 ? (
              identities.map((ident) => (
                <div key={ident.id} className="clinical-card p-5 space-y-3 relative">
                  {ident.isDefault && (
                    <span className="absolute top-4 right-4 px-2 py-0.5 rounded bg-sage-100 text-sage-800 text-[10px] font-bold border border-sage-300">
                      Predeterminada
                    </span>
                  )}
                  <h4 className="font-bold text-sm text-slate-900">{ident.displayName}</h4>
                  <div className="text-xs space-y-1 text-slate-600">
                    <p><strong>Tipo:</strong> {ident.identityType}</p>
                    <p><strong>Título / Especialidad:</strong> {ident.title || 'Psicólogo Clínico'} • {ident.specialty || 'General'}</p>
                    <p><strong>Colegiatura:</strong> {ident.colegiatura || 'N/A'}</p>
                    <p><strong>Contacto:</strong> {ident.phone || 'N/A'} • {ident.address || 'Sin dirección'}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="md:col-span-2 clinical-card p-12 text-center text-xs text-slate-500">
                No hay identidades documentales registradas.
              </div>
            )}
          </div>
        </main>
      </div>

      <IdentitySettingsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onIdentitySaved={() => loadIdentities()}
      />

      <AiCopilotDrawer isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
    </div>
  );
}
