/**
 * Nombre del archivo: src/app/login/page.tsx
 * Descripción: Página de inicio de sesión clínica para psicólogos y administradores de Psicolobos.
 * Fecha de última modificación: 2026-09-18
 * Autor: Psicolobos Development Team
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Stethoscope, Lock, Mail, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('psicologo@demo.local');
  const [password, setPassword] = useState('Demo1234!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push('/');
        router.refresh();
      } else {
        setError(data.error || 'Credenciales inválidas');
      }
    } catch (err) {
      setError('Error al conectar con el servidor de autenticación');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Glow de Fondo */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sage-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-sage-500 flex items-center justify-center text-white shadow-xl shadow-sage-500/30 mb-4">
          <Stethoscope className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">Psicolobos SaaS</h2>
        <p className="mt-1 text-xs text-slate-400 font-medium">Plataforma de Gestión Clínica Psicológica e IA</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-slate-800/80 backdrop-blur-md py-8 px-6 shadow-2xl rounded-2xl border border-slate-700 sm:px-10 space-y-6">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl text-xs text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Correo Electrónico:</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900/60 border border-slate-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-all placeholder-slate-500"
                  placeholder="psicologo@demo.local"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Contraseña:</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900/60 border border-slate-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-all placeholder-slate-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-sage-500 hover:bg-sage-600 text-white font-bold text-xs shadow-lg shadow-sage-500/25 flex items-center justify-center gap-2 transition-all mt-2"
            >
              <span>{loading ? 'Iniciando sesión...' : 'Ingresar al Expediente'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 space-y-2 text-center">
            {/* Oculto: Credenciales de superadministrador protegidas */}
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          ¿No tienes una cuenta aún?{' '}
          <Link href="/register" className="font-semibold text-sage-400 hover:underline">
            Registrar Profesional
          </Link>
        </p>
      </div>
    </div>
  );
}
