'use client';

import React, { useState, useEffect } from 'react';
import { Save, User, Lock, Mail, Phone, MapPin, Award, Briefcase, Database, Download, Trash2 } from 'lucide-react';

export default function SettingsGeneralPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    colegiatura: '',
    specialty: '',
    phone: '',
    address: '',
    avatarUrl: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/settings/profile');
        if (res.ok) {
          const data = await res.json();
          setFormData({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || '',
            password: '',
            colegiatura: data.colegiatura || '',
            specialty: data.specialty || '',
            phone: data.phone || '',
            address: data.address || '',
            avatarUrl: data.avatarUrl || ''
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('La imagen es muy grande. El tamaño máximo es 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatarUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/settings/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setMessage({ type: 'success', text: 'Datos actualizados correctamente.' });
        setFormData({ ...formData, password: '' });
      } else {
        const errorData = await res.json();
        setMessage({ type: 'error', text: errorData.error || 'Error al actualizar.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Ocurrió un error inesperado.' });
    } finally {
      setSaving(false);
    }
  };

  const handleClearData = async () => {
    if (!window.confirm('¿ESTÁS SEGURO? Esta acción borrará TODOS los pacientes, historiales e informes. No se puede deshacer.')) return;
    
    try {
      const res = await fetch('/api/settings/clear-test-data', { method: 'DELETE' });
      if (res.ok) {
        alert('Datos eliminados correctamente. El sistema está limpio.');
        window.location.reload();
      } else {
        alert('Error al eliminar los datos.');
      }
    } catch (e) {
      alert('Error de red al intentar eliminar los datos.');
    }
  };

  const handleDownloadBackup = () => {
    window.location.href = '/api/settings/backup';
  };

  if (loading) return <div className="p-6 text-slate-500">Cargando datos...</div>;

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Configuración General</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800">Información del Perfil</h2>
          <p className="text-sm text-slate-500">Actualiza tus datos personales, profesionales y credenciales de acceso.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {message.text && (
            <div className={`p-4 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
              {message.text}
            </div>
          )}

          <div className="flex items-center gap-6 mb-6 pb-6 border-b border-slate-100">
            <div className="relative w-24 h-24 rounded-full bg-slate-100 border-4 border-white shadow-md flex items-center justify-center overflow-hidden shrink-0">
              {formData.avatarUrl ? (
                <img src={formData.avatarUrl} alt="Foto de perfil" className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-slate-300" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-800 mb-1">Foto de Perfil</h3>
              <p className="text-xs text-slate-500 mb-3">Sube una foto tuya para mostrar en el menú y a los pacientes (Máx. 2MB).</p>
              <label className="cursor-pointer bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors shadow-sm">
                <span>Subir Foto</span>
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
              {formData.avatarUrl && (
                <button type="button" onClick={() => setFormData({ ...formData, avatarUrl: '' })} className="ml-3 text-xs font-medium text-rose-500 hover:text-rose-600">
                  Quitar foto
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1"><User className="w-3.5 h-3.5"/> Nombres</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-psicoPurple-500" />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Apellidos</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-psicoPurple-500" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1"><Mail className="w-3.5 h-3.5"/> Correo Electrónico</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-psicoPurple-500" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1"><Lock className="w-3.5 h-3.5"/> Nueva Contraseña</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Dejar en blanco para no cambiar" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-psicoPurple-500" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1"><Award className="w-3.5 h-3.5"/> N° Colegiatura (CPhP)</label>
              <input type="text" name="colegiatura" value={formData.colegiatura} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-psicoPurple-500" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1"><Briefcase className="w-3.5 h-3.5"/> Especialidad</label>
              <input type="text" name="specialty" value={formData.specialty} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-psicoPurple-500" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1"><Phone className="w-3.5 h-3.5"/> Teléfono</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-psicoPurple-500" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1"><MapPin className="w-3.5 h-3.5"/> Dirección</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-psicoPurple-500" />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-psicoPurple-600 text-white rounded-lg font-medium text-sm hover:bg-psicoPurple-700 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-6">
        <div className="p-6 border-b border-slate-100 bg-red-50/30">
          <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <Database className="w-5 h-5 text-slate-600" />
            Gestión de Datos y Respaldo
          </h2>
          <p className="text-sm text-slate-500 mt-1">Descarga una copia de seguridad o limpia el sistema para empezar desde cero.</p>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-4 border border-slate-100 rounded-lg">
            <div>
              <h3 className="font-medium text-slate-800">Copia de Seguridad (Backup)</h3>
              <p className="text-xs text-slate-500 mt-0.5">Descarga todos los datos (Pacientes, Historias, Informes) en formato JSON a tu computadora.</p>
            </div>
            <button
              onClick={handleDownloadBackup}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Descargar Respaldo
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-4 border border-red-100 bg-red-50/50 rounded-lg">
            <div>
              <h3 className="font-medium text-red-800">Borrar Datos de Prueba</h3>
              <p className="text-xs text-red-600/80 mt-0.5">Elimina TODOS los pacientes y registros del sistema permanentemente. Usa con precaución.</p>
            </div>
            <button
              onClick={handleClearData}
              className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Vaciar Sistema
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
