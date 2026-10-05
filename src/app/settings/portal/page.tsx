'use client';

import React, { useState, useEffect } from 'react';
import {
  Home as HomeIcon,
  Video,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  ExternalLink,
  Brain,
  Pencil
} from 'lucide-react';

const EditableText = ({
  text,
  field,
  onSave,
  className = '',
  isTextArea = false
}: {
  text: string;
  field: string;
  onSave: (field: string, val: string) => void;
  className?: string;
  isTextArea?: boolean;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [val, setVal] = useState(text);

  useEffect(() => setVal(text), [text]);

  if (isEditing) {
    return (
      <div className={`flex items-start gap-2 ${className}`}>
        {isTextArea ? (
          <textarea
            value={val}
            onChange={(e) => setVal(e.target.value)}
            className="border-2 border-[#8c654d] text-stone-900 rounded-lg px-2 py-1 outline-none bg-white text-sm shadow-sm w-full min-h-[80px]"
            autoFocus
          />
        ) : (
          <input
            type="text"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            className="border-2 border-[#8c654d] text-stone-900 rounded-lg px-2 py-1 outline-none bg-white text-sm shadow-sm w-full"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onSave(field, val);
                setIsEditing(false);
              }
            }}
          />
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSave(field, val);
            setIsEditing(false);
          }}
          className="p-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md shadow-sm transition-colors mt-0.5"
        >
          <CheckCircle className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <span
      className={`group relative inline-flex items-center gap-2 cursor-pointer ${className} hover:bg-psicoPurple-50 px-1 -mx-1 rounded transition-colors border border-transparent hover:border-psicoPurple-200`}
      onClick={() => setIsEditing(true)}
      title="Haz clic para editar"
    >
      {text}
      <Pencil className="w-3.5 h-3.5 text-psicoPurple-500 opacity-50 group-hover:opacity-100 transition-opacity shrink-0" />
    </span>
  );
};

export default function PortalSettingsWYSIWYG() {
  const [modality, setModality] = useState<'presencial' | 'online'>('online');
  const [selectedDay, setSelectedDay] = useState<number | null>(16);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get settings
    fetch('/api/web-settings')
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const handleSave = async (field: string, value: string) => {
    const newProfile = {
      ...profile,
      webProfile: { ...(profile?.webProfile || {}), [field]: value }
    };
    setProfile(newProfile);

    try {
      await fetch('/api/web-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          webProfile: newProfile.webProfile,
          schedule: profile?.schedule || {}
        })
      });
    } catch (err) {
      console.error('Error guardando:', err);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500 font-medium">Cargando editor visual...</div>;

  const p = profile?.webProfile || {};

  return (
    <div className="flex flex-col h-full bg-slate-100">
      <div className="bg-white p-4 border-b border-slate-200 shadow-sm sticky top-0 z-40 flex justify-between items-center">
        <div>
          <h2 className="font-bold text-lg text-slate-800">Editor Visual de la Página Web</h2>
          <p className="text-xs text-slate-500">Haz clic en los textos con el icono del lápiz para cambiarlos en tiempo real.</p>
        </div>
        <div className="px-4 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> Los cambios se guardan automáticamente
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto rounded-xl shadow-xl overflow-hidden ring-1 ring-slate-200 bg-[#f7f5f2] text-slate-800 font-sans scale-[0.95] origin-top">
          
          {/* Header */}
          <header className="bg-white border-b border-stone-200 px-6 py-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#8c654d] text-white flex items-center justify-center font-bold">
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="font-bold text-lg text-stone-900 tracking-tight flex items-center">
                    <EditableText text={p.title || 'Tu Nombre'} field="title" onSave={handleSave} />
                  </h1>
                  <p className="text-xs text-stone-500 font-medium flex items-center">
                    <EditableText text={p.subtitle || 'Tu bienestar es el mio'} field="subtitle" onSave={handleSave} />
                  </p>
                </div>
              </div>

              <nav className="flex items-center gap-6 text-xs font-semibold text-stone-700">
                <div className="flex flex-col items-center gap-0.5">
                  <EditableText text={p.nav1Label || 'Inicio'} field="nav1Label" onSave={handleSave} />
                  <EditableText text={p.nav1Link || '#'} field="nav1Link" onSave={handleSave} className="text-[9px] text-blue-500 font-normal max-w-[60px] truncate" />
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <EditableText text={p.nav2Label || 'Sobre mí'} field="nav2Label" onSave={handleSave} />
                  <EditableText text={p.nav2Link || '#'} field="nav2Link" onSave={handleSave} className="text-[9px] text-blue-500 font-normal max-w-[60px] truncate" />
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <EditableText text={p.nav3Label || 'Servicios'} field="nav3Label" onSave={handleSave} />
                  <EditableText text={p.nav3Link || '#'} field="nav3Link" onSave={handleSave} className="text-[9px] text-blue-500 font-normal max-w-[60px] truncate" />
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <EditableText text={p.nav4Label || 'Blog'} field="nav4Label" onSave={handleSave} />
                  <EditableText text={p.nav4Link || '#'} field="nav4Link" onSave={handleSave} className="text-[9px] text-blue-500 font-normal max-w-[60px] truncate" />
                </div>
              </nav>

              <div className="flex items-center gap-4">
                <div className="hidden lg:block text-right text-xs">
                  <p className="text-[10px] text-stone-400 flex justify-end">
                    <EditableText text={p.headerQuestion || '¿Tienes alguna pregunta?'} field="headerQuestion" onSave={handleSave} />
                  </p>
                  <p className="font-bold text-stone-800 flex justify-end">
                    <EditableText text={p.publicPhone || '666777888'} field="publicPhone" onSave={handleSave} />
                  </p>
                </div>
                <a 
                  href={p.cardContactLink ? `https://wa.me/${p.cardContactLink.replace(/\D/g, '')}` : '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs hover:bg-emerald-600 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
                <button className="px-4 py-2 bg-[#8c654d] text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <EditableText text={p.headerButtonText || 'Pedir cita'} field="headerButtonText" onSave={handleSave} />
                </button>
              </div>
            </div>
          </header>

          <main className="px-6 py-10 space-y-12">
            
            <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-[#8c654d] mb-4">Sobre mí</h2>
                  <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-wrap flex items-start">
                    <EditableText text={p.biography || 'Escribe tu biografía aquí...'} field="biography" onSave={handleSave} isTextArea className="flex-1" />
                  </p>
                </div>
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-[#8c654d] mb-4">Servicios (separados por comas)</h2>
                  <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-wrap flex items-start mb-2">
                    <EditableText text={p.services || 'Terapia Individual, Pareja, Niños'} field="services" onSave={handleSave} className="flex-1" />
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center space-y-2 max-w-xl mx-auto pt-8">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#8c654d] flex justify-center">
                PIDE CITA
              </span>
              <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight flex justify-center">
                Reserva tu sesión
              </h2>
              <p className="text-xs text-stone-600 flex justify-center">
                Elige el día y la hora que mejor te convenga.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
              <div className="lg:col-span-2 space-y-8">
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-stone-800 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#8c654d] text-white flex items-center justify-center text-[11px]">1</span>
                    Modalidad
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-6 rounded-2xl bg-white border-2 border-stone-200 text-center">
                      <HomeIcon className="w-7 h-7 mx-auto mb-2 text-stone-400" />
                      <p className="font-bold text-sm text-stone-800 flex justify-center">
                        Presencial
                      </p>
                      <p className="text-xs text-stone-500 mt-0.5 flex justify-center">
                        En consulta
                      </p>
                    </div>
                    <div className="p-6 rounded-2xl bg-[#fcfaf7] border-2 border-[#8c654d] shadow-sm text-center">
                      <Video className="w-7 h-7 mx-auto mb-2 text-[#8c654d]" />
                      <p className="font-bold text-sm text-stone-800 flex justify-center">
                        Online
                      </p>
                      <p className="text-xs text-stone-500 mt-0.5 flex justify-center">
                        Por videollamada
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-stone-800 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#8c654d] text-white flex items-center justify-center text-[11px]">2</span>
                    Elige día
                  </h3>
                  <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4 opacity-75">
                    <div className="text-center text-sm font-bold text-stone-400 py-4">
                      [El calendario se mostrará dinámicamente aquí a tus pacientes]
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-3">
                  <h3 className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#8c654d]" />
                    ¿Dónde estoy?
                  </h3>
                  <p className="text-xs text-stone-600 font-medium flex items-center">
                    <EditableText text={p.publicAddress || 'Calle Madrid 5, Madrid'} field="publicAddress" onSave={handleSave} />
                  </p>
                  <div className="relative rounded-xl overflow-hidden border border-stone-200 bg-stone-100 h-44 flex items-center justify-center">
                    <div className="absolute inset-0 bg-stone-200/80 flex items-center justify-center text-center p-4">
                      <div className="space-y-2 flex flex-col items-center w-full">
                        <span className="px-3 py-1 bg-white text-stone-800 text-[10px] font-bold rounded-lg shadow-sm border border-stone-200 inline-flex items-center gap-1">
                          <ExternalLink className="w-3 h-3 text-[#8c654d]" />
                          Abrir en Maps
                        </span>
                        <div className="flex items-center gap-1 bg-white/90 px-2 py-1 rounded text-[10px] border border-stone-200 w-full max-w-[200px] overflow-hidden mt-1">
                          <span className="text-stone-500 font-medium whitespace-nowrap">Link Maps:</span>
                          <EditableText text={p.cardMapLink || 'Pega tu enlace aquí'} field="cardMapLink" onSave={handleSave} className="text-blue-600 truncate" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-3">
                  <h3 className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-[#8c654d]" />
                    Contacto directo
                  </h3>
                  <div className="space-y-2">
                    <div className="p-3 bg-stone-50 rounded-xl text-xs font-semibold text-stone-800 flex items-center gap-2 border border-stone-100">
                      <Phone className="w-4 h-4 text-stone-400" />
                      <EditableText text={p.publicPhone || '666777888'} field="publicPhone" onSave={handleSave} />
                    </div>
                    <div className="p-3 bg-stone-50 rounded-xl text-xs font-semibold text-stone-800 flex items-center gap-2 border border-stone-100">
                      <Mail className="w-4 h-4 text-stone-400" />
                      <EditableText text={p.publicEmail || 'mariagarcia@gmail.com'} field="publicEmail" onSave={handleSave} />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="w-full py-2.5 bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm">
                        <MessageCircle className="w-4 h-4" />
                        WhatsApp
                      </div>
                      <div className="flex items-center justify-center gap-1 bg-emerald-50 px-2 py-1.5 rounded-lg text-[10px] border border-emerald-100 w-full">
                        <span className="text-emerald-700 font-medium">Nº WhatsApp:</span>
                        <EditableText text={p.cardContactLink || 'Ej. 51987654321'} field="cardContactLink" onSave={handleSave} className="text-emerald-900 font-bold" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>

        </div>
      </div>
    </div>
  );
}
