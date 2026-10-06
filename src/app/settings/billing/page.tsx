/**
 * Qué hace el archivo: Página de Configuración - Facturación
 * Fecha de última modificación: 2026-10-05
 * Nombre del autor: Psicolobos Development Team
 */

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function SettingsBillingPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/patients" className="p-2 bg-white rounded-full border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors shadow-sm">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-800">Facturación y Planes</h1>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <p className="text-slate-600">Aquí podrás ver tu plan actual, métodos de pago y el historial de tus facturas. Sección en construcción.</p>
      </div>
    </div>
  );
}
