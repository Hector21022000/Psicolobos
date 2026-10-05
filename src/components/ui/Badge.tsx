/**
 * Nombre del archivo: src/components/ui/Badge.tsx
 * Descripción: Componente de etiquetas (badges) con variantes de color clínico.
 * Fecha de última modificación: 2026-09-18
 * Autor: Psicolobos Development Team
 */

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'active' | 'inactive' | 'archived' | 'confirmed' | 'hypothesis' | 'cie' | 'dsm' | 'scheduled' | 'completed' | 'indigo' | 'blue' | 'red' | 'gray';
  className?: string;
}

export default function Badge({ children, variant = 'active', className = '' }: BadgeProps) {
  const styles = {
    active: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
    inactive: 'bg-amber-50 text-amber-800 border border-amber-200',
    archived: 'bg-slate-100 text-slate-600 border border-slate-300',
    confirmed: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
    hypothesis: 'bg-blue-50 text-blue-800 border border-blue-200',
    cie: 'bg-teal-50 text-teal-800 border border-teal-200 font-mono',
    dsm: 'bg-indigo-50 text-indigo-800 border border-indigo-200 font-mono',
    scheduled: 'bg-amber-100 text-amber-800 border border-amber-300',
    completed: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
    indigo: 'bg-indigo-50 text-indigo-800 border border-indigo-200',
    blue: 'bg-blue-50 text-blue-800 border border-blue-200',
    red: 'bg-rose-50 text-rose-800 border border-rose-200',
    gray: 'bg-slate-100 text-slate-700 border border-slate-200',
  }[variant];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles} ${className}`}>
      {children}
    </span>
  );
}
