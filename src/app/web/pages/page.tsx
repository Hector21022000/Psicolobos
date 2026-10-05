'use client';

import React, { useState, useEffect } from 'react';
import { Save, Globe, Clock, LayoutTemplate } from 'lucide-react';

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export default function WebSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [webProfile, setWebProfile] = useState({
    title: '',
    subtitle: '',
    biography: '',
    services: '',
    publicPhone: '',
    publicEmail: '',
    publicAddress: ''
  });
  
  const [schedule, setSchedule] = useState(
    DAYS.reduce((acc, day) => ({ ...acc, [day]: { active: false, start: '09:00', end: '18:00' } }), {} as any)
  );

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/web-settings');
        if (res.ok) {
          const data = await res.json();
          if (data.webProfile) setWebProfile(data.webProfile);
          if (data.schedule) {
            setSchedule((prev: any) => ({ ...prev, ...data.schedule }));
          }
        }
      } catch (err) {}
      setLoading(false);
    }
    loadData();
  }, []);

  const handleWebChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setWebProfile({ ...webProfile, [e.target.name]: e.target.value });
  };

  const handleScheduleChange = (day: string, field: string, value: any) => {
    setSchedule({
      ...schedule,
      [day]: { ...schedule[day], [field]: value }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    
    try {
      const res = await fetch('/api/web-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webProfile, schedule })
      });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Datos guardados correctamente.' });
      } else {
        setMessage({ type: 'error', text: 'Error al guardar.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Ocurrió un error inesperado.' });
    }
    setSaving(false);
  };

  if (loading) return <div className="p-6 text-slate-500">Cargando datos...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Gestión Web y Horarios</h1>
        <p className="text-slate-500 text-sm">Configura la información de tu página pública y tus horarios de atención.</p>
      </div>

      {message.text && (
        <div className={`p-4 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sección: Información Web */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
            <Globe className="w-5 h-5 text-psicoPurple-600" />
            <h2 className="font-semibold text-slate-800">Información Pública (Tu Web)</h2>
          </div>
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 uppercase">Título de tu página (Ej. Psicólogo Especialista)</label>
                <input type="text" name="title" value={webProfile.title} onChange={handleWebChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-psicoPurple-500 outline-none" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 uppercase">Subtítulo (Lema o enfoque)</label>
                <input type="text" name="subtitle" value={webProfile.subtitle} onChange={handleWebChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-psicoPurple-500 outline-none" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase">Biografía o Presentación</label>
              <textarea name="biography" value={webProfile.biography || ''} onChange={handleWebChange} rows={3} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-psicoPurple-500 outline-none" placeholder="Hola, soy..." />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase">Servicios que ofreces (separados por comas)</label>
              <input type="text" name="services" value={webProfile.services || ''} onChange={handleWebChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-psicoPurple-500 outline-none" placeholder="Terapia de Pareja, Ansiedad, Depresión" />
            </div>
            
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-sm font-semibold text-slate-800 mb-4">Información de Contacto Pública</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 uppercase">Teléfono Público</label>
                  <input type="text" name="publicPhone" value={webProfile.publicPhone || ''} onChange={handleWebChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-psicoPurple-500 outline-none" placeholder="+51 987 654 321" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 uppercase">Email Público</label>
                  <input type="email" name="publicEmail" value={webProfile.publicEmail || ''} onChange={handleWebChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-psicoPurple-500 outline-none" placeholder="contacto@tudominio.com" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 uppercase">Dirección de Consultorio</label>
                  <input type="text" name="publicAddress" value={webProfile.publicAddress || ''} onChange={handleWebChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-psicoPurple-500 outline-none" placeholder="Av. Principal 123, Lima" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección: Horarios Disponibles */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
            <Clock className="w-5 h-5 text-psicoPurple-600" />
            <h2 className="font-semibold text-slate-800">Horarios de Disponibilidad Semanal</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {DAYS.map((day) => (
                <div key={day} className={`p-4 rounded-xl border ${schedule[day]?.active ? 'border-psicoPurple-300 bg-psicoPurple-50/30' : 'border-slate-200 bg-slate-50/50'}`}>
                  <label className="flex items-center gap-2 cursor-pointer mb-3">
                    <input 
                      type="checkbox" 
                      checked={schedule[day]?.active || false} 
                      onChange={(e) => handleScheduleChange(day, 'active', e.target.checked)}
                      className="rounded text-psicoPurple-600 focus:ring-psicoPurple-500 w-4 h-4 cursor-pointer"
                    />
                    <span className={`font-semibold text-sm ${schedule[day]?.active ? 'text-psicoPurple-700' : 'text-slate-500'}`}>{day}</span>
                  </label>
                  
                  {schedule[day]?.active ? (
                    <div className="flex items-center gap-2">
                      <input 
                        type="time" 
                        value={schedule[day]?.start || '09:00'} 
                        onChange={(e) => handleScheduleChange(day, 'start', e.target.value)}
                        className="w-full p-1.5 text-xs bg-white border border-slate-300 rounded-md outline-none"
                      />
                      <span className="text-slate-400 text-xs">a</span>
                      <input 
                        type="time" 
                        value={schedule[day]?.end || '18:00'} 
                        onChange={(e) => handleScheduleChange(day, 'end', e.target.value)}
                        className="w-full p-1.5 text-xs bg-white border border-slate-300 rounded-md outline-none"
                      />
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400 italic py-1.5">Día no laborable</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-psicoPurple-600 text-white rounded-lg font-medium text-sm hover:bg-psicoPurple-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Guardando...' : 'Guardar Configuración'}
          </button>
        </div>
      </form>
    </div>
  );
}
