/**
 * Nombre del archivo: src/components/EvaluationCalculator.tsx
 * Descripción: Componente interactivo para aplicación, cálculo automático de percentiles y gráficos evolutivos de tests psicométricos.
 * Fecha de última modificación: 2026-09-18
 * Autor: Psicolobos Development Team
 */

'use client';

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar
} from 'recharts';
import { FileSpreadsheet, CheckCircle, Calculator, TrendingUp, HelpCircle } from 'lucide-react';

interface EvaluationCalculatorProps {
  patientId?: string;
  onSaveEvaluation?: (evalData: any) => void;
}

export default function EvaluationCalculator({ patientId, onSaveEvaluation }: EvaluationCalculatorProps) {
  const [selectedInstrument, setSelectedInstrument] = useState<'BDI_2' | 'HAM_A' | 'SCL_90'>('BDI_2');
  
  // Respuestas del test BDI-II (21 ítems simplificados)
  const [bdiScores, setBdiScores] = useState<number[]>(Array(21).fill(0));
  const [hamScores, setHamScores] = useState<number[]>(Array(14).fill(0));
  const [saving, setSaving] = useState(false);

  // Cálculo del puntaje BDI-II
  const totalBdiScore = bdiScores.reduce((acc, val) => acc + val, 0);
  const getBdiInterpretation = (score: number) => {
    if (score <= 13) return { label: 'Mínima o Ausente', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (score <= 19) return { label: 'Depresión Leve', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    if (score <= 28) return { label: 'Depresión Moderada', color: 'text-orange-700 bg-orange-50 border-orange-200' };
    return { label: 'Depresión Grave', color: 'text-rose-700 bg-rose-50 border-rose-200' };
  };

  // Cálculo de Ansiedad HAM-A
  const totalHamScore = hamScores.reduce((acc, val) => acc + val, 0);
  const getHamInterpretation = (score: number) => {
    if (score <= 17) return { label: 'Ansiedad Leve', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (score <= 24) return { label: 'Ansiedad Moderada', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    if (score <= 30) return { label: 'Ansiedad Severa', color: 'text-rose-700 bg-rose-50 border-rose-200' };
    return { label: 'Ansiedad Muy Severa / Incapacitante', color: 'text-rose-900 bg-rose-100 border-rose-300' };
  };

  // Datos demo para el gráfico evolutivo de evaluaciones del paciente
  const evolutionData = [
    { fecha: 'Sesión 1 (01/08)', bdi: 32, ham: 28 },
    { fecha: 'Sesión 3 (15/08)', bdi: 26, ham: 22 },
    { fecha: 'Sesión 5 (01/09)', bdi: 19, ham: 16 },
    { fecha: 'Sesión 7 (15/09)', bdi: 14, ham: 11 },
  ];

  const handleSave = async () => {
    setSaving(true);
    const score = selectedInstrument === 'BDI_2' ? totalBdiScore : totalHamScore;
    const interpretation = selectedInstrument === 'BDI_2' ? getBdiInterpretation(totalBdiScore).label : getHamInterpretation(totalHamScore).label;

    const evalPayload = {
      patientId,
      evaluationName: selectedInstrument === 'BDI_2' ? 'Inventario de Depresión de Beck (BDI-II)' : 'Escala de Ansiedad de Hamilton (HAM-A)',
      instrumentName: selectedInstrument,
      scoresJson: JSON.stringify({ totalScore: score }),
      percentilesJson: JSON.stringify({ percentile: Math.min(99, Math.round((score / 63) * 100)) }),
      clinicalInterpretation: interpretation,
    };

    try {
      const res = await fetch('/api/evaluations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(evalPayload),
      });

      if (res.ok) {
        alert('Evaluación psicométrica guardada con éxito en el expediente del paciente.');
        if (onSaveEvaluation) onSaveEvaluation(evalPayload);
      }
    } catch (err) {
      console.error('Error al guardar evaluación:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Selector de Instrumento Psicométrico */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
        <button
          onClick={() => setSelectedInstrument('BDI_2')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            selectedInstrument === 'BDI_2'
              ? 'bg-sage-600 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Inventario de Depresión de Beck (BDI-II)
        </button>
        <button
          onClick={() => setSelectedInstrument('HAM_A')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            selectedInstrument === 'HAM_A'
              ? 'bg-sage-600 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Escala de Ansiedad de Hamilton (HAM-A)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Izquierda: Formulario de Calificación */}
        <div className="lg:col-span-2 clinical-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-sage-600" />
              {selectedInstrument === 'BDI_2' ? 'Ítems del BDI-II (0-3 puntos por síntoma)' : 'Ítems del HAM-A (0-4 puntos por síntoma)'}
            </h3>
            <span className="text-xs text-slate-500 font-medium">Escala Cuantitativa Validada</span>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {selectedInstrument === 'BDI_2' ? (
              // Ítems BDI-II
              [
                '1. Tristeza',
                '2. Pesimismo',
                '3. Fracaso percibido',
                '4. Pérdida de placer',
                '5. Sentimientos de culpa',
                '6. Sentimientos de castigo',
                '7. Disconformidad con uno mismo',
                '8. Autocrítica',
                '9. Pensamientos o deseos suicidas',
                '10. Llanto',
                '11. Agitación / Inquietud',
                '12. Pérdida de interés',
                '13. Indecisión',
                '14. Inutilidad',
                '15. Pérdida de energía',
                '16. Cambios en el patrón de sueño',
                '17. Irritabilidad',
                '18. Cambios en el apetito',
                '19. Dificultad de concentración',
                '20. Cansancio o fatiga',
                '21. Pérdida de interés en el sexo',
              ].map((itemTitle, i) => (
                <div key={i} className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs">
                  <span className="font-medium text-slate-700">{itemTitle}</span>
                  <div className="flex gap-1">
                    {[0, 1, 2, 3].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => {
                          const updated = [...bdiScores];
                          updated[i] = val;
                          setBdiScores(updated);
                        }}
                        className={`w-7 h-7 rounded text-xs font-bold transition-all ${
                          bdiScores[i] === val
                            ? 'bg-sage-600 text-white shadow-xs'
                            : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              // Ítems HAM-A
              [
                '1. Estado de ánimo ansioso',
                '2. Tensión psíquica',
                '3. Temores / Fobias',
                '4. Insomnio',
                '5. Funciones intelectuales (concentración)',
                '6. Estado de ánimo depresivo',
                '7. Síntomas somáticos musculares',
                '8. Síntomas somáticos sensoriales',
                '9. Síntomas cardiovasculares',
                '10. Síntomas respiratorios',
                '11. Síntomas gastrointestinales',
                '12. Síntomas genitourinarios',
                '13. Síntomas autónomos (boca seca, palidez)',
                '14. Comportamiento en la entrevista',
              ].map((itemTitle, i) => (
                <div key={i} className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs">
                  <span className="font-medium text-slate-700">{itemTitle}</span>
                  <div className="flex gap-1">
                    {[0, 1, 2, 3, 4].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => {
                          const updated = [...hamScores];
                          updated[i] = val;
                          setHamScores(updated);
                        }}
                        className={`w-6 h-6 rounded text-[11px] font-bold transition-all ${
                          hamScores[i] === val
                            ? 'bg-sage-600 text-white shadow-xs'
                            : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Columna Derecha: Resultado & Gráfico Evolutivo */}
        <div className="space-y-6">
          {/* Card Resumen de Puntaje */}
          <div className="clinical-card p-5">
            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Puntaje Total Directo</h4>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-extrabold text-slate-900">
                {selectedInstrument === 'BDI_2' ? totalBdiScore : totalHamScore}
              </span>
              <span className="text-xs text-slate-400">/ {selectedInstrument === 'BDI_2' ? '63 pts' : '56 pts'}</span>
            </div>

            {/* Clasificación Diagnóstica */}
            <div className="mt-4">
              <span className="block text-xs font-medium text-slate-500 mb-1">Diagnóstico Cualitativo:</span>
              <div
                className={`p-3 rounded-lg border text-xs font-bold text-center ${
                  selectedInstrument === 'BDI_2'
                    ? getBdiInterpretation(totalBdiScore).color
                    : getHamInterpretation(totalHamScore).color
                }`}
              >
                {selectedInstrument === 'BDI_2'
                  ? getBdiInterpretation(totalBdiScore).label
                  : getHamInterpretation(totalHamScore).label}
              </div>
            </div>

            {/* Botón Guardar */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full mt-4 py-2.5 bg-sage-600 hover:bg-sage-700 text-white font-semibold text-xs rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{saving ? 'Guardando...' : 'Registrar en Expediente'}</span>
            </button>
          </div>

          {/* Card Gráfico Evolutivo */}
          <div className="clinical-card p-4">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-3">
              <TrendingUp className="w-4 h-4 text-sage-600" />
              Evolución Psicométrica del Paciente
            </h4>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={evolutionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="fecha" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Line type="monotone" dataKey="bdi" name="BDI-II (Depresión)" stroke="#528970" strokeWidth={2.5} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="ham" name="HAM-A (Ansiedad)" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
