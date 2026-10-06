/**
 * Nombre del archivo: src/components/Navbar.tsx
 * Descripción: Componente Header/Navbar superior de la interfaz de Psicolobos adaptado al diseño de PsicoCMS.
 * Fecha de última modificación: 2026-09-18
 * Autor: Psicolobos Development Team
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Bell, Sparkles, HelpCircle, User } from 'lucide-react';

interface PatientSearchResult {
  id: string;
  firstName: string;
  lastName: string;
  identityDoc?: string | null;
  status: string;
}

interface NavbarProps {
  onOpenAiCopilot?: () => void;
  title?: string;
  subtitle?: string;
}

export default function Navbar({ onOpenAiCopilot, title = 'Panel de Gestión Clínica', subtitle }: NavbarProps) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<PatientSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setCurrentUser(data.user);
        }
      } catch (err) {
        console.error('Error al cargar sesión de usuario:', err);
      }
    }
    loadUser();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/patients?search=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.patients || []);
          setShowResults(true);
        }
      } catch (err) {
        console.error('Error en búsqueda de pacientes:', err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <header className="bg-white/40 backdrop-blur-xl border-b border-white/50 sticky top-0 z-10 px-6 py-3 flex items-center justify-between shadow-sm">
      {/* Search Input Píldora estilo PsicoCMS */}
      <div className="relative w-full max-w-lg">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar pacientes, citas, historias, artículos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery.trim() && setShowResults(true)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-psicoPurple-500 focus:bg-white transition-all text-slate-700 placeholder-slate-400"
          />
        </div>

        {/* Dropdown de Resultados de Búsqueda */}
        {showResults && (
          <div className="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl max-h-60 overflow-y-auto z-30">
            {isSearching ? (
              <div className="p-3 text-xs text-slate-500 text-center">Buscando en registros...</div>
            ) : searchResults.length > 0 ? (
              searchResults.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    router.push(`/patients/${p.id}`);
                    setShowResults(false);
                    setSearchQuery('');
                  }}
                  className="w-full px-4 py-2.5 text-left hover:bg-psicoPurple-50 border-b border-slate-100 last:border-b-0 flex items-center justify-between transition-colors"
                >
                  <div>
                    <p className="text-xs font-semibold text-slate-800">
                      {p.firstName} {p.lastName}
                    </p>
                    <p className="text-[10px] text-slate-500">DNI/Doc: {p.identityDoc || 'Sin registro'}</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-psicoPurple-100 text-psicoPurple-700 font-medium">
                    {p.status}
                  </span>
                </button>
              ))
            ) : (
              <div className="p-3 text-xs text-slate-500 text-center">No se encontraron resultados.</div>
            )}
          </div>
        )}
      </div>

      {/* Perfil de Usuario & Acciones PsicoCMS */}
      <div className="flex items-center gap-4">
        {/* Launcher del Copiloto IA */}
        <button
          onClick={onOpenAiCopilot}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-psicoPurple-50 border border-psicoPurple-200 text-psicoPurple-700 text-xs font-semibold hover:bg-psicoPurple-100 transition-all shadow-xs"
          title="Abrir Copiloto IA Psicolobos"
        >
          <Sparkles className="w-3.5 h-3.5 text-psicoPurple-600 animate-pulse" />
          <span>IA Clínica</span>
        </button>

        {/* Campana Notificaciones */}
        <button 
          onClick={() => alert('Pronto podrás ver tus notificaciones aquí.')}
          className="relative w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
            0
          </span>
        </button>

        {/* Ayuda */}
        <button className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors">
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Avatar Usuario */}
        <Link href="/settings/general" className="flex items-center gap-2 pl-2">
          <span className="text-xs font-semibold text-slate-700">
            {currentUser?.role === 'SUPER_ADMIN' ? 'Super Admin' : currentUser ? `Psc. ${currentUser.firstName}` : 'Cargando...'}
          </span>
          <div className="relative w-8 h-8 rounded-full bg-psicoPurple-600 text-white flex items-center justify-center overflow-hidden border-2 border-slate-100 shadow-xs cursor-pointer hover:scale-105 transition-transform" title="Editar Perfil">
            {currentUser?.avatarUrl ? (
              <img src={currentUser.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="w-5 h-5 text-white" />
            )}
          </div>
        </Link>
      </div>
    </header>
  );
}

