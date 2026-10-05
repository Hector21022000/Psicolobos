/**
 * Nombre del archivo: src/components/layout/Sidebar.tsx
 * Descripción: Menú de navegación lateral profesional con iconos Lucide y módulo de Super Admin.
 * Fecha de última modificación: 2026-09-18
 * Autor: Psicolobos Development Team
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Clock,
  ClipboardCheck,
  FolderOpen,
  FileText,
  Stethoscope,
  Sparkles,
  BarChart3,
  Settings,
  ShieldAlert,
  UserCheck,
  History,
  LogOut,
  BrainCircuit,
} from 'lucide-react';

interface SidebarProps {
  userRole?: string;
  userFullName?: string;
}

export default function Sidebar({ userRole = 'PSYCHOLOGIST', userFullName }: SidebarProps) {
  const pathname = usePathname();

  const mainNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Agenda', href: '/agenda', icon: Calendar },
    { name: 'Pacientes', href: '/pacientes', icon: Users },
    { name: 'Sesiones', href: '/sesiones', icon: Clock },
    { name: 'Evaluaciones', href: '/evaluaciones', icon: ClipboardCheck },
    { name: 'Documentos & OCR', href: '/documentos', icon: FolderOpen },
    { name: 'Informes', href: '/informes', icon: FileText },
    { name: 'Diagnósticos', href: '/diagnosticos', icon: Stethoscope },
    { name: 'Asistente IA', href: '/asistente-ia', icon: Sparkles, badge: 'IA' },
    { name: 'Estadísticas', href: '/estadisticas', icon: BarChart3 },
  ];

  const adminNavigation = [
    { name: 'Gestión Usuarios', href: '/admin', icon: UserCheck },
    { name: 'Bitácora Auditoría', href: '/admin/audit', icon: History },
  ];

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  return (
    <aside className="w-64 bg-slateClinical-900 text-white flex flex-col flex-shrink-0 border-r border-slateClinical-800 h-screen sticky top-0 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slateClinical-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-sage-500 flex items-center justify-center text-white font-bold text-xl shadow-md">
          <BrainCircuit className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-lg leading-none text-white tracking-wide">
            Psicolobos
          </h1>
          <p className="text-[11px] text-sage-300 font-medium tracking-tight mt-1">
            Gestión Clínica Profesional
          </p>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-semibold text-slateClinical-400 uppercase tracking-wider">
          Módulo Clínico
        </div>

        {mainNavigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-sage-600 text-white shadow-sm font-semibold'
                  : 'text-slateClinical-300 hover:bg-slateClinical-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slateClinical-400'}`} />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-amber-400 text-slateClinical-900">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* Super Admin Section */}
        {userRole === 'SUPER_ADMIN' && (
          <div className="pt-5 space-y-1">
            <div className="px-3 pb-2 text-[10px] font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-3 h-3 text-amber-400" /> Super Admin
            </div>
            {adminNavigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                      : 'text-slateClinical-300 hover:bg-slateClinical-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 text-amber-400" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* User Footer & Logout */}
      <div className="p-3 border-t border-slateClinical-800 bg-slateClinical-950/60">
        <Link
          href="/configuracion"
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-slateClinical-800 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-sage-700 flex items-center justify-center font-bold text-xs text-white">
            {userFullName ? userFullName.charAt(0) : 'P'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">
              {userFullName || 'Psicólogo Registrado'}
            </p>
            <p className="text-[10px] text-slateClinical-400 truncate">
              {userRole === 'SUPER_ADMIN' ? 'Super Administrador' : 'Psicólogo Clínico'}
            </p>
          </div>
          <Settings className="w-4 h-4 text-slateClinical-400" />
        </Link>

        <button
          onClick={handleLogout}
          className="w-full mt-2 flex items-center justify-center gap-2 py-2 text-xs font-medium text-red-400 hover:bg-red-950/30 rounded-lg transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
