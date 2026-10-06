/**
 * Nombre del archivo: src/components/Sidebar.tsx
 * Descripción: Componente de navegación lateral (Sidebar) alineado con el diseño visual de PsicoCMS / Psicolobos.
 * Fecha de última modificación: 2026-09-18
 * Autor: Psicolobos Development Team
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  CalendarCheck,
  Calendar as CalendarIcon,
  Users,
  FolderKanban,
  FileText,
  Globe,
  Settings,
  LogOut,
  ExternalLink,
  ChevronDown,
  Sparkles,
  BookOpen,
  Send,
  Building2,
  ShieldCheck,
  HeartPulse,
  Palette
} from 'lucide-react';

interface SidebarProps {
  onOpenAiCopilot?: () => void;
}

export default function Sidebar({ onOpenAiCopilot }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated && data.user) {
          setUserId(data.user.id);
          setUserRole(data.user.role);
        }
      })
      .catch(console.error);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const toggleSubmenu = (menu: string) => {
    setOpenSubmenu(openSubmenu === menu ? null : menu);
  };

  const navItems = [
    { name: 'Inicio', href: '/', icon: Home },
    { name: 'Citas', href: '/appointments', icon: CalendarCheck },
    { name: 'Calendario', href: '/agenda', icon: CalendarIcon },
    { name: 'Pacientes / Historias Clínicas', href: '/patients', icon: Users },
    { name: 'Catálogo CIE-11 / DSM-5', href: '/catalogs', icon: BookOpen },
    { name: 'Informes', href: '/reports', icon: FileText },
    { name: 'Comunicaciones', href: '/communications', icon: Send },
    { name: 'Identidades', href: '/identities', icon: Building2 },
    { name: 'Auditoría', href: '/audit', icon: ShieldCheck },
  ];

  return (
    <aside className="w-64 bg-white/40 backdrop-blur-xl text-slate-700 flex flex-col justify-between h-screen sticky top-0 border-r border-white/50 shadow-sm z-20 select-none">
      <div className="flex flex-col h-full overflow-hidden">
        {/* Header con Isotipo Psicolobos (Igual al mockup) */}
        <div className="p-4 flex items-center gap-3 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-psicoPurple-600 flex items-center justify-center text-white shadow-sm">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-base text-slate-800 leading-tight">PsicoCMS</h1>
            <p className="text-[11px] text-slate-400 font-medium">Panel administrativo</p>
          </div>
        </div>

        {/* Copiloto IA Prominente */}
        <div className="p-3">
          <button
            onClick={onOpenAiCopilot}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-psicoPurple-50 hover:bg-psicoPurple-100 text-psicoPurple-700 font-medium text-xs transition-all border border-psicoPurple-200 group"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-psicoPurple-600 animate-pulse" />
              <span className="font-semibold">Copiloto IA Psicolobos</span>
            </div>
            <span className="text-[10px] bg-psicoPurple-600 text-white px-1.5 py-0.5 rounded font-bold">PRO</span>
          </button>
        </div>

        {/* Enlaces de Navegación Principal */}
        <nav className="px-3 space-y-1 overflow-y-auto flex-1 py-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-psicoPurple-600 text-white shadow-md shadow-psicoPurple-600/20 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}

          {/* Submenús con Desplegable */}
          <div className="pt-2">            <button
              onClick={() => toggleSubmenu('config')}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
            >
              <div className="flex items-center gap-3">
                <Settings className="w-4 h-4 text-slate-500" />
                <span>Configuración</span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openSubmenu === 'config' ? 'rotate-180' : ''}`} />
            </button>
            {openSubmenu === 'config' && (
              <div className="pl-10 pr-3 py-1 space-y-1">
                <Link href="/settings/general" className="block py-1.5 text-xs text-slate-500 hover:text-psicoPurple-600">General</Link>
                <Link href="/settings/portal" className="block py-1.5 text-xs text-slate-500 hover:text-psicoPurple-600">Portal Público</Link>
              </div>
            )}
          </div>
          
          {userRole === 'SUPER_ADMIN' && (
            <div className="pt-4 pb-2">
              <div className="px-3 pb-2 text-[10px] font-bold text-rose-500 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> 
                Super Administración
              </div>
              <Link href="/admin/users" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-rose-50 hover:text-rose-700 transition-all">
                <Users className="w-4 h-4 text-rose-500" />
                <span>Gestión de Profesionales</span>
              </Link>
            </div>
          )}
        </nav>

        {/* Footer del Sidebar con botón Ver tu web */}
        <div className="p-3 border-t border-slate-100 space-y-2 bg-slate-50/50">
          <Link
            href={userId ? `/booking/${userId}` : "#"}
            target="_blank"
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-medium shadow-sm hover:border-psicoPurple-300 hover:text-psicoPurple-700 transition-all"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              <span>Ver tu web</span>
            </div>
          </Link>

          <div className="flex items-center justify-between pt-1 px-1">
            <button
              title="Cambiar tema visual"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <Palette className="w-4 h-4" />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-xs font-medium text-slate-600 hover:text-rose-600 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

