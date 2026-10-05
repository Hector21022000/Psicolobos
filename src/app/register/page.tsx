/**
 * Nombre del archivo: src/app/register/page.tsx
 * Descripción: Página de registro de nuevos profesionales de la psicología en Psicolobos.
 * Fecha de última modificación: 2026-09-18
 * Autor: Psicolobos Development Team
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Stethoscope, User, Mail, Lock, ShieldCheck, Phone, Award } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    colegiatura: '',
    specialty: 'Psicología Clínica',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert('Cuenta creada exitosamente. Redirigiendo al inicio de sesión...');
        router.push('/login');
      } else {
        setError(data.error || 'Error al registrar usuario');
      }
    } catch (err) {
      setError('Ocurrió un error al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <div className="mx-auto w-12 h-12 rounded-2xl bg-sage-500 flex items-center justify-center text-white shadow-xl shadow-sage-500/30 mb-3">
          <Stethoscope className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-extrabold text-white tracking-tight">Registro de Profesional Clínico</h2>
        <p className="mt-1 text-xs text-slate-400">Únete a la plataforma de gestión de salud mental Psicolobos</p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-slate-800/80 backdrop-blur-md py-6 px-6 shadow-2xl rounded-2xl border border-slate-700 sm:px-8 space-y-4">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl text-xs text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nombres:</label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full p-2 bg-slate-900/60 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-sage-500"
                  placeholder="Carlos"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Apellidos:</label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full p-2 bg-slate-900/60 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-sage-500"
                  placeholder="Mendoza"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Correo Electrónico Institucional:</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2 bg-slate-900/60 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-sage-500"
                placeholder="dr.mendoza@clinica.com"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">N° Colegiatura:</label>
                <input
                  type="text"
                  value={formData.colegiatura}
                  onChange={(e) => setFormData({ ...formData, colegiatura: e.target.value })}
                  className="w-full p-2 bg-slate-900/60 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-sage-500"
                  placeholder="CPhP 45892"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Especialidad Principal:</label>
                <select
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  className="w-full p-2 bg-slate-900/60 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-sage-500"
                >
                  <option value="Psicología Clínica">Psicología Clínica</option>
                  <option value="Psicoterapia Cognitivo-Conductual">Terapia Cognitivo-Conductual</option>
                  <option value="Neuropsicología">Neuropsicología</option>
                  <option value="Psicología Infanto-Juvenil">Infanto-Juvenil</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Contraseña Segura:</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full p-2 bg-slate-900/60 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-sage-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-sage-500 hover:bg-sage-600 text-white font-bold text-xs shadow-lg shadow-sage-500/25 transition-all mt-2"
            >
              {loading ? 'Creando cuenta...' : 'Completar Registro'}
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-slate-400">
          ¿Ya posees una cuenta?{' '}
          <Link href="/login" className="font-semibold text-sage-400 hover:underline">
            Iniciar Sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
