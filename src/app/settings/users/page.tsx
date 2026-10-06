/**
 * Qué hace el archivo: Página de Configuración - Usuarios
 * Fecha de última modificación: 2026-10-05
 * Nombre del autor: Psicolobos Development Team
 */

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function SettingsUsersPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/patients" className="p-2 bg-white rounded-full border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors shadow-sm">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-800">Gestión de Usuarios</h1>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <p className="text-slate-600">Módulo para administrar los roles y accesos de otros profesionales o personal administrativo. Próximamente disponible.</p>
      </div>
    </div>
  );
}
