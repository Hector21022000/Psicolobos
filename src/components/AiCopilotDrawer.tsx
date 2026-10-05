/**
 * Nombre del archivo: src/components/AiCopilotDrawer.tsx
 * Descripción: Terminal / Drawer interactivo para el Asistente Clínico Inteligente con soporte de síntesis de expedientes y comandos interactivos.
 * Fecha de última modificación: 2026-09-18
 * Autor: Psicolobos Development Team
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Sparkles, AlertTriangle, HelpCircle, FileText, CheckCircle2, RefreshCw, Info, Terminal, Send, Trash2 } from 'lucide-react';

interface AiCopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPatientId?: string;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export default function AiCopilotDrawer({ isOpen, onClose, selectedPatientId }: AiCopilotDrawerProps) {
  const [patients, setPatients] = useState<any[]>([]);
  const [patientId, setPatientId] = useState<string>(selectedPatientId || '');
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Terminal Interactiva
  const [customPrompt, setCustomPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedPatientId) {
      setPatientId(selectedPatientId);
    }
  }, [selectedPatientId]);

  useEffect(() => {
    if (isOpen && patients.length === 0) {
      fetch('/api/patients')
        .then((res) => res.json())
        .then((data) => {
          if (data.patients) {
            setPatients(data.patients);
            if (!patientId && data.patients.length > 0) {
              setPatientId(data.patients[0].id);
            }
          }
        })
        .catch(console.error);
    }
  }, [isOpen]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, aiResponse]);

  const handleGenerateAi = async () => {
    if (!patientId) {
      setError('Por favor selecciona un paciente');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientId }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setAiResponse(data.aiResult);
      } else {
        setError(data.error || 'Error al invocar asistencia por IA');
      }
    } catch (err) {
      setError('Ocurrió un error al conectar con el motor de IA.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendPrompt = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!customPrompt.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: customPrompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentInput = customPrompt;
    setCustomPrompt('');
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientId: patientId || undefined, prompt: currentInput }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: data.interactiveResponse || 'Consulta procesada correctamente.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        setError(data.error || 'Error en la respuesta de la Terminal de IA');
      }
    } catch (err) {
      setError('Error de conexión con la Terminal de IA.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/30 backdrop-blur-sm flex justify-end transition-opacity">
      <div className="w-full max-w-xl bg-white/40 backdrop-blur-3xl h-full shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] flex flex-col border-l border-white/50 relative overflow-hidden">
        
        {/* Background Orbs internos del drawer */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[30%] bg-purple-400/20 rounded-full blur-3xl mix-blend-multiply animate-blob pointer-events-none"></div>
        <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] bg-blue-400/20 rounded-full blur-3xl mix-blend-multiply animate-blob pointer-events-none" style={{ animationDelay: '2s' }}></div>

        {/* Header del Drawer / Terminal de Gemini */}
        <div className="p-4 bg-[#484496]/70 backdrop-blur-xl text-white flex items-center justify-between border-b border-white/30 shadow-sm relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/20 text-amber-300 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold tracking-tight">Copiloto IA Gemini Psicolobos</h2>
                <span className="bg-emerald-400/30 text-emerald-100 border border-emerald-300/50 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase backdrop-blur-md shadow-sm">
                  Google Gemini 2.5
                </span>
              </div>
              <p className="text-[11px] text-purple-100 font-medium">Asistente clínico inteligente respaldado por Google Gemini</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-all border border-transparent hover:border-white/30"
          >
            <X className="w-5 h-5" />
          </button>
        </div>



        {/* Formulario de Selección de Paciente y Síntesis Rápida */}
        <div className="p-4 bg-white/40 backdrop-blur-md border-b border-white/50 flex items-center gap-3 relative z-10 shadow-sm">
          <div className="flex-1">
            <label className="block text-xs font-bold text-slate-800 mb-1">Paciente en Análisis:</label>
            <select
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="w-full text-xs p-2.5 bg-white/60 backdrop-blur-md border border-white/80 rounded-xl focus:ring-2 focus:ring-[#484496] shadow-sm text-slate-800 font-medium"
            >
              <option value="">-- Seleccionar Paciente --</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.firstName} {p.lastName} {p.identityDoc ? `(DNI: ${p.identityDoc})` : ''}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleGenerateAi}
            disabled={loading || !patientId}
            className="mt-5 px-4 py-2.5 bg-gradient-to-br from-[#484496]/90 to-[#393478]/90 hover:from-[#393478] hover:to-[#2d295f] backdrop-blur-md disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-[#484496]/30 border border-white/20 transition-all hover:scale-105"
          >
            {loading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Analizando...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Sintetizar Caso</span>
              </>
            )}
          </button>
        </div>

        {/* Contenido de la Terminal de Respuestas e Historial */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-transparent relative z-10">
          {error && (
            <div className="p-3 bg-rose-500/20 backdrop-blur-md border border-rose-500/50 text-rose-900 rounded-xl text-xs flex items-center gap-2 shadow-sm font-medium">
              <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Historial de Mensajes de la Terminal */}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed backdrop-blur-md shadow-sm border ${
                  msg.sender === 'user'
                    ? 'bg-[#484496]/80 text-white border-[#484496]/50 rounded-br-none'
                    : 'bg-white/60 text-slate-800 border-white/80 rounded-bl-none font-mono whitespace-pre-wrap'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[10px] text-slate-500 font-medium mt-1 px-1">{msg.timestamp}</span>
            </div>
          ))}

          {/* Síntesis estructurada si fue generada */}
          {aiResponse && (
            <div className="space-y-4 pt-2">
              {/* 1. Resumen Ejecutivo */}
              <div className="bg-white/50 backdrop-blur-xl rounded-2xl p-4 border border-white/60 shadow-sm">
                <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2 mb-2 bg-white/40 inline-flex px-3 py-1 rounded-lg border border-white/50">
                  <CheckCircle2 className="w-4 h-4 text-[#484496]" />
                  Resumen Ejecutivo Clínico
                </h3>
                <p className="text-xs text-slate-800 font-medium leading-relaxed bg-white/40 p-3 rounded-xl border border-white/60 shadow-inner">
                  {aiResponse.executiveSummary}
                </p>
              </div>

              {/* 2. Factores de Riesgo */}
              <div className="bg-white/50 backdrop-blur-xl rounded-2xl p-4 border border-white/60 shadow-sm">
                <h3 className="text-xs font-bold text-amber-900 flex items-center gap-2 mb-2 bg-amber-50/50 inline-flex px-3 py-1 rounded-lg border border-amber-200/50">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Factores de Riesgo o Alerta
                </h3>
                <ul className="space-y-1.5">
                  {aiResponse.identifiedRiskFactors?.map((risk: string, idx: number) => (
                    <li key={idx} className="text-xs text-amber-900 bg-amber-50 border border-amber-200/70 px-3 py-1.5 rounded-lg flex items-start gap-2">
                      <span className="font-bold">•</span>
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 3. Preguntas Sugeridas */}
              <div className="bg-white/50 backdrop-blur-xl rounded-2xl p-4 border border-white/60 shadow-sm">
                <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2 mb-2 bg-white/40 inline-flex px-3 py-1 rounded-lg border border-white/50">
                  <HelpCircle className="w-4 h-4 text-[#484496]" />
                  Preguntas de Exploración Sugeridas
                </h3>
                <div className="space-y-2">
                  {aiResponse.suggestedClinicalQuestions?.map((q: string, idx: number) => (
                    <div key={idx} className="text-xs text-slate-800 font-medium bg-white/60 p-2.5 rounded-xl border border-white/80 flex items-start gap-2 shadow-sm">
                      <span className="font-extrabold text-[#484496] bg-white/50 px-1.5 rounded">{idx + 1}.</span>
                      <span>{q}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Borrador Estructurado */}
              <div className="bg-white/50 backdrop-blur-xl rounded-2xl p-4 border border-white/60 shadow-sm">
                <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2 mb-2 bg-white/40 inline-flex px-3 py-1 rounded-lg border border-white/50">
                  <FileText className="w-4 h-4 text-[#484496]" />
                  Borrador Estructurado de Informe
                </h3>
                <div
                  className="text-xs text-slate-800 font-medium bg-white/60 p-4 rounded-xl border border-white/80 shadow-inner leading-relaxed max-h-60 overflow-y-auto"
                  dangerouslySetInnerHTML={{ __html: aiResponse.reportDraftHtml }}
                />
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Sugerencias Rápidas de Gemini (Chips) */}
        <div className="px-3 pt-2 pb-1 bg-white/40 backdrop-blur-md border-t border-white/50 flex items-center gap-1.5 overflow-x-auto text-[11px] hide-scrollbar relative z-10">
          <span className="text-slate-500 font-bold text-[10px] shrink-0 bg-white/50 px-2 py-0.5 rounded-md">✨ Acciones:</span>
          
          <button type="button" onClick={() => setCustomPrompt('Ayúdame a sintetizar esta sesión.')} className="px-2.5 py-1.5 rounded-full bg-white/60 text-slate-700 hover:bg-white border border-white/80 hover:border-purple-300 shadow-sm shrink-0 font-bold transition-all hover:scale-105">✨ Analizar sesión</button>
          
          <button type="button" onClick={() => setCustomPrompt('Organiza y resume los antecedentes relevantes.')} className="px-2.5 py-1.5 rounded-full bg-white/60 text-slate-700 hover:bg-white border border-white/80 hover:border-purple-300 shadow-sm shrink-0 font-bold transition-all hover:scale-105">✨ Resumir antecedentes</button>
          
          <button type="button" onClick={() => setCustomPrompt('Propón preguntas para profundizar en este caso.')} className="px-2.5 py-1.5 rounded-full bg-white/60 text-slate-700 hover:bg-white border border-white/80 hover:border-purple-300 shadow-sm shrink-0 font-bold transition-all hover:scale-105">✨ Sugerir preguntas</button>
          
          <button type="button" onClick={() => setCustomPrompt('Ayúdame a estructurar un plan de intervención.')} className="px-2.5 py-1.5 rounded-full bg-white/60 text-slate-700 hover:bg-white border border-white/80 hover:border-purple-300 shadow-sm shrink-0 font-bold transition-all hover:scale-105">✨ Proponer objetivos</button>
          
          <button type="button" onClick={() => setCustomPrompt('Sugiere actividades acordes con los objetivos planteados.')} className="px-2.5 py-1.5 rounded-full bg-white/60 text-slate-700 hover:bg-white border border-white/80 hover:border-purple-300 shadow-sm shrink-0 font-bold transition-all hover:scale-105">✨ Ayudar con intervención</button>
          
          <button type="button" onClick={() => setCustomPrompt('Redactar borrador de informe psicológico.')} className="px-2.5 py-1.5 rounded-full bg-white/60 text-slate-700 hover:bg-white border border-white/80 hover:border-emerald-300 shadow-sm shrink-0 font-bold transition-all hover:scale-105">✨ Generar borrador</button>
          
          <button type="button" onClick={() => setCustomPrompt('Compara los cambios observados entre sesiones y analiza la evolución.')} className="px-2.5 py-1.5 rounded-full bg-white/60 text-slate-700 hover:bg-white border border-white/80 hover:border-blue-300 shadow-sm shrink-0 font-bold transition-all hover:scale-105">✨ Analizar evolución</button>
        </div>

        {/* Input Prompter Interactivo de la Terminal */}
        <form onSubmit={handleSendPrompt} className="p-3 bg-white/50 backdrop-blur-xl border-t border-white/60 flex items-center gap-2 relative z-10 shadow-sm">
          <input
            type="text"
            placeholder="Pregunta a Google Gemini..."
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            className="flex-1 px-4 py-2.5 text-xs bg-white/60 backdrop-blur-md border border-white/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#484496] shadow-inner font-medium text-slate-800 placeholder:text-slate-500"
          />
          <button
            type="submit"
            disabled={loading || !customPrompt.trim()}
            className="p-2.5 bg-gradient-to-br from-[#484496] to-[#393478] hover:from-[#393478] hover:to-[#2d295f] disabled:opacity-50 text-white rounded-xl shadow-lg shadow-[#484496]/30 transition-all hover:scale-105 border border-white/20"
            title="Enviar comando a Gemini"
          >
            <Send className="w-4 h-4" />
          </button>
          {messages.length > 0 && (
            <button
              type="button"
              onClick={() => setMessages([])}
              className="p-2.5 text-slate-500 hover:text-rose-600 bg-white/40 hover:bg-white/80 rounded-xl transition-all border border-white/50 shadow-sm"
              title="Limpiar terminal"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </form>

        {/* Footer del Drawer */}
        <div className="px-4 py-2.5 bg-white/40 backdrop-blur-md border-t border-white/50 text-right relative z-10">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white/60 backdrop-blur-md border border-white/80 hover:bg-white shadow-sm text-slate-700 text-xs font-bold rounded-xl transition-all hover:scale-105"
          >
            Cerrar Terminal
          </button>
        </div>
      </div>
    </div>
  );
}

