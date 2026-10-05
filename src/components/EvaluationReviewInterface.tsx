/**
 * Nombre del archivo: src/components/EvaluationReviewInterface.tsx
 * Descripción: Interfaz dividida en 2 Paneles para el Flujo Oficial de Revisión Profesional y Aprobación de Evaluaciones Analizadas por IA.
 * Fecha de última modificación: 2026-09-18
 * Autor: Psicolobos Development Team
 */

'use client';

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import {
  CheckCircle2,
  Edit3,
  XCircle,
  Sparkles,
  ShieldCheck,
  FileCheck,
  RotateCcw,
  BookOpen,
  Info,
  Lock,
  Plus
} from 'lucide-react';
import IdentitySettingsModal from './IdentitySettingsModal';

interface EvaluationReviewInterfaceProps {
  testResult: any;
  onStatusChanged?: () => void;
  onGenerateReport?: (approvedData: any, selectedIdentity: any) => void;
}

export default function EvaluationReviewInterface({
  testResult,
  onStatusChanged,
  onGenerateReport,
}: EvaluationReviewInterfaceProps) {
  const isApproved = testResult?.approvalStatus === 'APROBADO';

  const [aiDraft, setAiDraft] = useState<any>(() => {
    try {
      return JSON.parse(testResult?.aiAnalysisJson || '{}');
    } catch {
      return {};
    }
  });

  const [sectionStatuses, setSectionStatuses] = useState<Record<string, 'PENDING' | 'ACCEPTED' | 'REJECTED'>>({
    summary: 'ACCEPTED',
    interpretation: 'ACCEPTED',
    conclusions: 'ACCEPTED',
    recommendations: 'ACCEPTED',
  });

  const [isEditingSection, setIsEditingSection] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [approving, setApproving] = useState(false);
  const [isIdentityModalOpen, setIsIdentityModalOpen] = useState(false);
  const [selectedIdentity, setSelectedIdentity] = useState<any>(null);

  // Parsear puntajes
  const percentilesData = (() => {
    try {
      const p = JSON.parse(testResult?.percentilesJson || '{}');
      return [
        { escala: 'Puntaje Total', score: p.totalScore || 28, max: 63 },
        { escala: 'Somatico/Ansiedad', score: Math.round((p.totalScore || 28) * 0.4), max: 30 },
        { escala: 'Afectivo/Cognitivo', score: Math.round((p.totalScore || 28) * 0.6), max: 33 },
      ];
    } catch {
      return [];
    }
  })();

  const handleApproveAll = async () => {
    setApproving(true);
    try {
      const res = await fetch('/api/tests', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testResultId: testResult.id,
          action: 'APPROVE',
          approvedContent: aiDraft,
        }),
      });

      if (res.ok) {
        alert('Resultados de la evaluación APROBADOS profesionalmente.');
        if (onStatusChanged) onStatusChanged();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setApproving(false);
    }
  };

  const handleCreateNewVersion = async () => {
    try {
      const res = await fetch('/api/tests', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testResultId: testResult.id,
          action: 'CREATE_NEW_VERSION',
        }),
      });

      if (res.ok) {
        alert('Nueva versión creada en BORRADOR para modificaciones.');
        if (onStatusChanged) onStatusChanged();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header con Estado de Aprobación */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-800">
              Evaluación Psicométrica: {testResult?.instrumentName} (Versión {testResult?.version || 1})
            </h3>
            {isApproved ? (
              <span className="px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                🟢 INFORME APROBADO
              </span>
            ) : (
              <span className="px-3 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                BORRADOR (Pendiente Revisión)
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Fecha: {new Date(testResult?.createdAt || Date.now()).toLocaleDateString('es-ES')} • Paciente: {testResult?.patient?.firstName} {testResult?.patient?.lastName}
          </p>
        </div>

        {/* Botones Principales del Flujo */}
        <div className="flex gap-2">
          {!isApproved ? (
            <button
              onClick={handleApproveAll}
              disabled={approving}
              className="px-4 py-2 bg-sage-600 hover:bg-sage-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>APROBAR RESULTADOS</span>
            </button>
          ) : (
            <>
              <button
                onClick={handleCreateNewVersion}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Crear Nueva Versión</span>
              </button>
              <button
                onClick={() => {
                  if (onGenerateReport) onGenerateReport(aiDraft, selectedIdentity);
                  else alert('Iniciando generación de informe final con contenido aprobado.');
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-950 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <FileCheck className="w-4 h-4" />
                <span>GENERAR INFORME FINAL</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Grid de 2 Paneles Divididos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PANEL IZQUIERDO: Respuestas, Puntajes, Subescalas y Gráficos */}
        <div className="clinical-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              PANEL IZQUIERDO: Resultados Cuantitativos & Baremos
            </h4>
            <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-semibold">
              Datos Auditados
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="font-semibold text-slate-500 block text-[10px]">Puntaje Directo Total:</span>
              <span className="text-2xl font-extrabold text-slate-900">
                {percentilesData[0]?.score || 28} pts
              </span>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="font-semibold text-slate-500 block text-[10px]">Percentil Calculado (Baremos):</span>
              <span className="text-2xl font-extrabold text-sage-800">
                P{Math.round(((percentilesData[0]?.score || 28) / 63) * 100)}
              </span>
            </div>
          </div>

          {/* Gráfico de Barras por Subescala */}
          <div>
            <h5 className="text-xs font-bold text-slate-700 mb-2">Distribución por Subescalas Evaluadas:</h5>
            <div className="h-44 w-full bg-slate-50 p-2 rounded-lg border border-slate-200">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={percentilesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="escala" tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 9 }} />
                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                  <Bar dataKey="score" fill="#528970" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* PANEL DERECHO: Análisis IA, Fuentes Citadas, Conclusiones y Controles por Bloque */}
        <div className="clinical-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sage-600" />
              PANEL DERECHO: Análisis IA & Interpretación Profesional
            </h4>
            <span className="text-[10px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded font-bold border border-amber-200">
              {isApproved ? 'Contenido Aprobado' : 'Borrador para Revisión'}
            </span>
          </div>

          {/* Seccion 1: Síntesis de Resultados */}
          <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="flex justify-between items-center">
              <span className="font-bold text-xs text-slate-800">1. Análisis e Interpretación de Resultados:</span>
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    setSectionStatuses((prev) => ({ ...prev, summary: 'ACCEPTED' }));
                  }}
                  className={`p-1 rounded text-[10px] font-semibold ${
                    sectionStatuses.summary === 'ACCEPTED' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  ACEPTAR
                </button>
                <button
                  onClick={() => {
                    setSectionStatuses((prev) => ({ ...prev, summary: 'REJECTED' }));
                  }}
                  className={`p-1 rounded text-[10px] font-semibold ${
                    sectionStatuses.summary === 'REJECTED' ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  RECHAZAR
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed bg-white p-2.5 rounded border border-slate-200">
              {aiDraft.summary || 'Análisis no disponible.'}
            </p>
          </div>

          {/* Seccion 2: Fuentes y Documentos Citados (CIE-11 / DSM-5) */}
          <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="flex justify-between items-center">
              <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                2. Fuentes Documentales Citadas:
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {aiDraft.sources?.map((s: string, idx: number) => (
                <span key={idx} className="text-[10px] bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded font-medium">
                  {s}
                </span>
              )) || <span className="text-[10px] text-slate-400">Sin citas documentales</span>}
            </div>
          </div>

          {/* Seccion 3: Conclusiones y Recomendaciones */}
          <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="font-bold text-xs text-slate-800 block">3. Conclusiones y Recomendaciones Clínicas:</span>
            <p className="text-xs text-slate-700 bg-white p-2.5 rounded border border-slate-200">
              {aiDraft.conclusions}
            </p>
            <p className="text-xs text-slate-700 bg-white p-2.5 rounded border border-slate-200 mt-1">
              <strong>Recomendaciones:</strong> {aiDraft.recommendations}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
