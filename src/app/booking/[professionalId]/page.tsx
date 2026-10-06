'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
  ExternalLink,
  Brain
} from 'lucide-react';

export default function BookingPage() {
  const router = useRouter();
  const params = useParams();
  const professionalId = params.professionalId as string;
  const [modality, setModality] = useState<'presencial' | 'online'>('online');
  const [selectedDay, setSelectedDay] = useState<number | null>(16);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!professionalId) return;
    fetch(`/api/public/profile?id=${professionalId}`)
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .catch(console.error);
  }, [professionalId]);

  const p = profile?.webProfile || {};

  return (
    <div className="min-h-screen text-slate-800 font-sans relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Background Orbs para Liquid Glass */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-300/40 rounded-full blur-3xl mix-blend-multiply animate-blob"></div>
      <div className="fixed top-[20%] right-[-10%] w-[40%] h-[50%] bg-blue-300/40 rounded-full blur-3xl mix-blend-multiply animate-blob" style={{ animationDelay: '2s' }}></div>
      <div className="fixed bottom-[-20%] left-[20%] w-[50%] h-[50%] bg-pink-300/40 rounded-full blur-3xl mix-blend-multiply animate-blob" style={{ animationDelay: '4s' }}></div>

      <div className="relative z-10">
        <header className="bg-white/40 backdrop-blur-xl border-b border-white/50 sticky top-0 z-30 px-6 py-4 shadow-[0_4px_30px_rgba(0,0,0,0.05)]">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8c654d] to-[#6b4c39] text-white flex items-center justify-center font-bold shadow-lg shadow-[#8c654d]/20">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-stone-900 tracking-tight">
                  {p.title || profile?.name || 'Víctor Robles'}
                </h1>
                <p className="text-xs text-stone-600 font-medium">
                  {p.subtitle || 'Tu bienestar es el mio'}
                </p>
              </div>
            </div>

            <nav className="flex items-center gap-6 text-xs font-semibold text-stone-700 bg-white/30 px-6 py-2 rounded-full border border-white/40 backdrop-blur-md shadow-inner">
              <a href={p.nav1Link || '#'} className="hover:text-[#8c654d] transition-colors">{p.nav1Label || 'Inicio'}</a>
              <a href={p.nav2Link || '#'} className="hover:text-[#8c654d] transition-colors">{p.nav2Label || 'Sobre mí'}</a>
              <a href={p.nav3Link || '#'} className="hover:text-[#8c654d] transition-colors">{p.nav3Label || 'Servicios'}</a>
              <a href={p.nav4Link || '#'} className="hover:text-[#8c654d] transition-colors">{p.nav4Label || 'Blog'}</a>
            </nav>

            <div className="flex items-center gap-4">
              <div className="hidden lg:block text-right text-xs bg-white/40 px-3 py-1.5 rounded-xl border border-white/50 backdrop-blur-md shadow-xs">
                <p className="text-[10px] text-stone-500 font-medium">{p.headerQuestion || '¿Tienes alguna pregunta?'}</p>
                <p className="font-bold text-stone-800">{p.publicPhone || profile?.phone || '666777888'}</p>
              </div>

              <a 
                href={p.cardContactLink ? `https://wa.me/${p.cardContactLink.replace(/\D/g, '')}` : '#'} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 hover:scale-105 transition-transform"
              >
                <MessageCircle className="w-5 h-5" />
              </a>

              <button className="px-5 py-2.5 bg-gradient-to-br from-[#8c654d] to-[#6b4c39] hover:from-[#77543e] hover:to-[#5a3f2f] text-white rounded-xl text-xs font-bold shadow-lg shadow-[#8c654d]/30 flex items-center gap-1.5 hover:scale-105 transition-transform">
                <Calendar className="w-3.5 h-3.5" />
                <span>{p.headerButtonText || 'Pedir cita'}</span>
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 py-10 space-y-12">
          {(p.biography || p.services) && (
            <div className="bg-white/50 backdrop-blur-2xl rounded-3xl p-8 border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] relative overflow-hidden">
              {/* Glass Reflection */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-70"></div>
              
              <div className="grid md:grid-cols-2 gap-8 relative z-10">
                {p.biography && (
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-widest text-[#8c654d] mb-4">Sobre mí</h2>
                    <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-wrap font-medium">
                      {p.biography}
                    </p>
                  </div>
                )}
                {p.services && (
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-widest text-[#8c654d] mb-4">Servicios</h2>
                    <div className="flex flex-wrap gap-2">
                      {p.services.split(',').map((service: string, i: number) => (
                        <span key={i} className="px-3 py-1.5 bg-white/60 text-stone-700 rounded-lg text-xs font-semibold border border-white/80 shadow-sm backdrop-blur-md">
                          {service.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        <div className="text-center space-y-2 max-w-xl mx-auto pt-8 relative z-10">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#8c654d] bg-white/40 px-3 py-1 rounded-full backdrop-blur-sm border border-white/50 shadow-sm">PIDE CITA</span>
          <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight mt-4">Reserva tu sesión</h2>
          <p className="text-xs text-stone-700 font-medium bg-white/30 backdrop-blur-sm inline-block px-4 py-1.5 rounded-full border border-white/40">Elige el día y la hora que mejor te convenga.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-stone-800 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#8c654d] to-[#6b4c39] text-white flex items-center justify-center text-[11px] shadow-md shadow-[#8c654d]/20">1</span>
                <span className="bg-white/40 px-3 py-1 rounded-lg backdrop-blur-sm border border-white/50">Modalidad</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => setModality('presencial')}
                  className={`p-6 rounded-2xl bg-white/50 backdrop-blur-xl border border-white/60 text-center transition-all shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:-translate-y-1 ${
                    modality === 'presencial'
                      ? 'ring-2 ring-[#8c654d] bg-white/70 shadow-md'
                      : 'hover:bg-white/60'
                  }`}
                >
                  <HomeIcon className={`w-7 h-7 mx-auto mb-2 transition-colors ${modality === 'presencial' ? 'text-[#8c654d]' : 'text-stone-500'}`} />
                  <p className="font-bold text-sm text-stone-800">Presencial</p>
                  <p className="text-xs text-stone-600 mt-0.5">En consulta</p>
                </button>

                <button
                  onClick={() => setModality('online')}
                  className={`p-6 rounded-2xl bg-white/50 backdrop-blur-xl border border-white/60 text-center transition-all shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:-translate-y-1 ${
                    modality === 'online'
                      ? 'ring-2 ring-[#8c654d] bg-white/70 shadow-md'
                      : 'hover:bg-white/60'
                  }`}
                >
                  <Video className={`w-7 h-7 mx-auto mb-2 transition-colors ${modality === 'online' ? 'text-[#8c654d]' : 'text-stone-500'}`} />
                  <p className="font-bold text-sm text-stone-800">Online</p>
                  <p className="text-xs text-stone-600 mt-0.5">Por videollamada</p>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold text-stone-800 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#8c654d] to-[#6b4c39] text-white flex items-center justify-center text-[11px] shadow-md shadow-[#8c654d]/20">2</span>
                <span className="bg-white/40 px-3 py-1 rounded-lg backdrop-blur-sm border border-white/50">Elige día</span>
              </h3>

              <div className="bg-white/50 backdrop-blur-2xl p-6 rounded-3xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] space-y-4">
                <div className="flex items-center justify-between">
                  <button className="w-8 h-8 rounded-full border border-white/80 bg-white/40 flex items-center justify-center text-stone-700 hover:bg-white/70 shadow-sm transition-all">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <h4 className="font-bold text-sm text-stone-900 bg-white/40 px-4 py-1.5 rounded-xl border border-white/50 shadow-sm">Junio 2026</h4>
                  <button className="w-8 h-8 rounded-full border border-white/80 bg-white/40 flex items-center justify-center text-stone-700 hover:bg-white/70 shadow-sm transition-all">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-2 text-center text-[11px] font-bold text-stone-500 bg-white/30 rounded-xl py-2 border border-white/40">
                  <div>L</div><div>M</div><div>X</div><div>J</div><div>V</div><div>S</div><div>D</div>
                </div>

                <div className="grid grid-cols-7 gap-2 text-xs">
                  {Array.from({ length: 21 }).map((_, i) => {
                    const dayNum = i + 1;
                    const isAvailable = [2, 3, 4, 5, 6, 9, 10, 11, 12, 13, 16, 17, 18, 19, 20].includes(dayNum);
                    const isSelected = selectedDay === dayNum;

                    return (
                      <button
                        key={dayNum}
                        disabled={!isAvailable}
                        onClick={() => setSelectedDay(dayNum)}
                        className={`p-3 rounded-xl font-bold transition-all text-center border ${
                          isSelected
                            ? 'bg-gradient-to-br from-[#8c654d] to-[#6b4c39] text-white shadow-lg shadow-[#8c654d]/30 border-transparent scale-105'
                            : isAvailable
                            ? 'bg-white/60 text-stone-800 border-white/80 hover:bg-white shadow-sm'
                            : 'bg-white/20 text-stone-400 border-transparent cursor-not-allowed opacity-50'
                        }`}
                      >
                        {dayNum}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white/50 backdrop-blur-2xl p-5 rounded-3xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] space-y-3">
              <h3 className="text-xs font-bold text-stone-800 flex items-center gap-1.5 bg-white/40 inline-flex px-3 py-1 rounded-lg border border-white/50">
                <MapPin className="w-4 h-4 text-[#8c654d]" />
                <span>¿Dónde estoy?</span>
              </h3>
              <p className="text-xs text-stone-700 font-medium px-1">{p.publicAddress || profile?.address || 'Calle Madrid 5, Madrid'}</p>

              <div className="relative rounded-2xl overflow-hidden border border-white/60 bg-white/30 backdrop-blur-sm h-44 flex items-center justify-center shadow-inner">
                <div className="absolute inset-0 bg-stone-100/40 flex items-center justify-center text-center p-4">
                  <div className="space-y-2 flex flex-col items-center">
                    <a
                      href={p.cardMapLink || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-white/80 backdrop-blur-md text-stone-800 text-[10px] font-bold rounded-xl shadow-md border border-white hover:bg-white transition-all hover:scale-105 inline-flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3 h-3 text-[#8c654d]" />
                      Abrir en Maps
                    </a>
                    <p className="text-[10px] text-stone-600 font-medium mt-1 bg-white/40 px-2 py-1 rounded-md">{p.publicAddress || profile?.address || 'Calle Madrid 5, 28012 Madrid'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/50 backdrop-blur-2xl p-5 rounded-3xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] space-y-3">
              <h3 className="text-xs font-bold text-stone-800 flex items-center gap-1.5 bg-white/40 inline-flex px-3 py-1 rounded-lg border border-white/50">
                <Phone className="w-4 h-4 text-[#8c654d]" />
                <span>Contacto directo</span>
              </h3>

              <div className="space-y-2 pt-1">
                <div className="p-3 bg-white/60 backdrop-blur-md rounded-xl text-xs font-semibold text-stone-800 flex items-center gap-2 border border-white/80 shadow-sm">
                  <Phone className="w-4 h-4 text-[#8c654d]" />
                  <span>{p.publicPhone || profile?.phone || '666777888'}</span>
                </div>

                <div className="p-3 bg-white/60 backdrop-blur-md rounded-xl text-xs font-semibold text-stone-800 flex items-center gap-2 border border-white/80 shadow-sm">
                  <Mail className="w-4 h-4 text-[#8c654d]" />
                  <span>{p.publicEmail || profile?.email || 'mariagarcia@gmail.com'}</span>
                </div>

                <a
                  href={p.cardContactLink ? `https://wa.me/${p.cardContactLink.replace(/\D/g, '')}` : '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 mt-2 bg-gradient-to-br from-emerald-400 to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 hover:scale-[1.02] transition-all border border-emerald-400/50"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Contactar por WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}
