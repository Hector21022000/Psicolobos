/**
 * Nombre del archivo: src/app/evaluations/page.tsx
 * Descripción: Batería de pruebas psicométricas y calculadora interactiva de evaluaciones en Psicolobos.
 * Fecha de última modificación: 2026-09-18
 * Autor: Psicolobos Development Team
 */

'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import AiCopilotDrawer from '@/components/AiCopilotDrawer';
import EvaluationCalculator from '@/components/EvaluationCalculator';
import { FileSpreadsheet, Sparkles, CheckCircle2, HelpCircle } from 'lucide-react';

export default function EvaluationsPage() {
  const [isAiOpen, setIsAiOpen] = useState(false);

  return (
    <div className="flex h-screen bg-transparent overflow-hidden">
      <Sidebar onOpenAiCopilot={() => setIsAiOpen(true)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Navbar
          onOpenAiCopilot={() => setIsAiOpen(true)}
          title="Baterías Psicométricas y Evaluaciones"
          subtitle="Cálculo cuantitativo de puntajes directos, percentiles y gráficos evolutivos"
        />

        <main className="p-6 space-y-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-sage-600" />
                Catálogo de Instrumentos Psicológicos Cuantitativos
              </h3>
              <p className="text-xs text-slate-500">Selecciona una batería para calificar síntomas del paciente</p>
            </div>
          </div>

          <EvaluationCalculator />
        </main>
      </div>

      <AiCopilotDrawer isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
    </div>
  );
}
