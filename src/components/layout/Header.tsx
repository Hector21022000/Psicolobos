/**
 * Nombre del archivo: src/components/layout/Header.tsx
 * Descripción: Topbar de navegación con buscador global, notificaciones y acceso directo a nuevo paciente.
 * Fecha de última modificación: 2026-09-18
 * Autor: Psicolobos Development Team
 */

'use client';

import { useState } from 'react';
import { Search, Bell, Plus, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
  userFullName?: string;
  userColegiatura?: string;
  userRole?: string;
  onOpenNewPatientModal?: () => void;
}

export default function Header({
  userFullName,
  userColegiatura,
  userRole,
  onOpenNewPatientModal,
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="h-16 bg-white border-b border-slateClinical-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      {/* Buscador Global */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slateClinical-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar paciente por nombre, documento o diagnóstico..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-full border border-slateClinical-200 bg-slateClinical-50 text-slateClinical-800 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Saludo y Botones de Acción */}
      <div className="flex items-center gap-4">
        {userRole === 'SUPER_ADMIN' && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>Modo Super Admin</span>
          </div>
        )}

        <button
          onClick={onOpenNewPatientModal}
          className="clinical-btn-primary py-1.5 px-3.5 text-xs shadow-none"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Paciente</span>
        </button>

        {/* Bell notifications */}
        <div className="relative">
          <button className="p-2 rounded-full hover:bg-slateClinical-100 text-slateClinical-600 transition-colors relative">
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-sage-500 absolute top-1.5 right-1.5 ring-2 ring-white"></span>
          </button>
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-slateClinical-200"></div>

        {/* User Info */}
        <div className="text-right hidden md:block">
          <p className="text-xs font-bold text-slateClinical-900 leading-tight">
            {userFullName || 'Dr. Usuario'}
          </p>
          <p className="text-[10px] text-sage-700 font-medium">
            {userColegiatura ? `Colegiatura: ${userColegiatura}` : 'Psicólogo Clínico'}
          </p>
        </div>
      </div>
    </header>
  );
}
