/**
 * Nombre del archivo: src/components/WebSessionGuide.tsx
 * Descripción: Guía completa para la primera sesión clínica con campo de respuesta por cada pregunta individual, diseñada para ser usada en vivo durante la entrevista con el paciente y exportable como PDF.
 * Fecha de última modificación: 2026-09-29
 * Autor: Psicolobos Development Team
 */

'use client';

import React, { useState, useCallback } from 'react';
import {
  BookOpen,
  Shield,
  MessageSquare,
  HeartHandshake,
  Users,
  Smile,
  Heart,
  Printer,
  Sparkles,
  Copy,
  Check,
  PenLine,
} from 'lucide-react';
import Badge from '@/components/ui/Badge';

interface WebSessionGuideProps {
  patientId: string;
  patientName: string;
  onStartSessionWithNotes?: (notes: string) => void;
}

// Componente reutilizable para una pregunta con campo de respuesta
function QuestionCard({
  questionId,
  question,
  answer,
  onAnswerChange,
  accentColor = 'slate',
  label,
}: {
  questionId: string;
  question: string;
  answer: string;
  onAnswerChange: (id: string, value: string) => void;
  accentColor?: string;
  label?: string;
}) {
  const colorMap: Record<string, { border: string; bg: string; text: string; label: string; ring: string }> = {
    purple: { border: 'border-purple-200', bg: 'bg-purple-50/60', text: 'text-purple-800', label: 'bg-purple-100 text-purple-700', ring: 'focus:ring-purple-300' },
    blue:   { border: 'border-blue-200',   bg: 'bg-blue-50/60',   text: 'text-blue-800',   label: 'bg-blue-100 text-blue-700',   ring: 'focus:ring-blue-300' },
    emerald:{ border: 'border-emerald-200',bg: 'bg-emerald-50/60',text: 'text-emerald-800',label: 'bg-emerald-100 text-emerald-700',ring:'focus:ring-emerald-300'},
    amber:  { border: 'border-amber-200',  bg: 'bg-amber-50/60',  text: 'text-amber-800',  label: 'bg-amber-100 text-amber-700',  ring: 'focus:ring-amber-300' },
    sky:    { border: 'border-sky-200',    bg: 'bg-sky-50/60',    text: 'text-sky-800',    label: 'bg-sky-100 text-sky-700',    ring: 'focus:ring-sky-300' },
    rose:   { border: 'border-rose-200',   bg: 'bg-rose-50/60',   text: 'text-rose-800',   label: 'bg-rose-100 text-rose-700',   ring: 'focus:ring-rose-300' },
    slate:  { border: 'border-slate-200',  bg: 'bg-slate-50',     text: 'text-slate-800',  label: 'bg-slate-100 text-slate-600', ring: 'focus:ring-slate-300' },
  };

  const c = colorMap[accentColor] || colorMap.slate;
  const hasAnswer = answer?.trim().length > 0;

  return (
    <div className={`rounded-xl border ${c.border} overflow-hidden transition-all duration-200 ${hasAnswer ? 'shadow-sm' : ''} mb-3`}>
      {/* Pregunta */}
      <div className={`p-3.5 ${c.bg} flex items-start gap-3`}>
        <div className="flex-1">
          {label && (
            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${c.label} mr-2 inline-block mb-1`}>
              {label}
            </span>
          )}
          <p className={`text-xs font-semibold ${c.text} leading-relaxed`}>{question}</p>
        </div>
      </div>

      {/* Campo de respuesta SIEMPRE VISIBLE en pantalla */}
      <div className="bg-white border-t border-slate-100 p-3 print:hidden">
        <textarea
          rows={2}
          value={answer}
          onChange={(e) => onAnswerChange(questionId, e.target.value)}
          placeholder="Escribe la respuesta aquí..."
          className={`w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 resize-y focus:outline-none focus:ring-2 ${c.ring} focus:bg-white transition-all`}
        />
      </div>

      {/* Vista de impresión: muestra la respuesta si existe, o una línea si no hay */}
      <div className="hidden print:block bg-white border-t border-slate-100 p-3">
        {hasAnswer ? (
          <p className="text-xs text-slate-800 italic whitespace-pre-wrap">{answer}</p>
        ) : (
          <p className="text-xs text-slate-400 italic">______________________________________________________</p>
        )}
      </div>
    </div>
  );
}

export default function WebSessionGuide({
  patientId,
  patientName,
  onStartSessionWithNotes,
}: WebSessionGuideProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const firstName = patientName.split(' ')[0] || patientName;

  const handleAnswerChange = useCallback((id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleConsolidateNotes = () => {
    const sections: Record<string, string> = {
      'enc-1': '1. El Encuadre',
      'mc-1': '2. Motivo de Consulta',
      'ana-1': '3. Anamnesis',
      'fam-1': '4. Contexto Familiar',
      'for-1': '5. Fortalezas y Recursos',
      'cui-1': '6. Cuidar al Cuidador',
    };
    const grouped: Record<string, string[]> = {};
    Object.entries(answers).forEach(([k, v]) => {
      if (!v?.trim()) return;
      const prefix = Object.keys(sections).find((p) => k.startsWith(p.split('-')[0])) || 'extra';
      const label = sections[Object.keys(sections).find((p) => k.startsWith(p.split('-')[0])) || ''] || 'Otras notas';
      if (!grouped[label]) grouped[label] = [];
      grouped[label].push(v);
    });
    const fullNotes = Object.entries(grouped)
      .map(([label, vals]) => `[${label}]:\n${vals.join('\n')}`)
      .join('\n\n');
    if (onStartSessionWithNotes) {
      onStartSessionWithNotes(fullNotes || 'Sesión guiada efectuada con la Pauta de Primera Sesión Web.');
    }
  };

  const handlePrint = () => window.print();

  const speeches = [
    { key: 'sp-presentacion', label: 'Presentación', text: '"Hola, mi nombre es [Nombre] y soy practicante de psicología. Estaré acompañándolos en este proceso bajo la supervisión de [Nombre del docente/supervisor]."' },
    { key: 'sp-confidencialidad', label: 'Confidencialidad', text: '"Todo lo que hablemos aquí es privado, a menos que haya un riesgo para la vida de alguien. Sus datos están protegidos."' },
    { key: 'sp-frecuencia', label: 'Frecuencia y Duración', text: '"Nuestras sesiones durarán entre 30 a 40 minutos, con una frecuencia de una vez por semana."' },
    { key: 'sp-objetivo', label: 'Objetivo de la Primera Sesión', text: '"Hoy quiero conocerlos, saber qué les preocupa y entender cómo puedo ayudarlos mejor. Voy a hacer una serie de preguntas. En ocasiones les interrumpiré amablemente si necesito volver a preguntar algo para aprovechar al máximo nuestro tiempo."' },
  ];

  const answeredCount = Object.values(answers).filter((v) => v?.trim()).length;
  const totalQuestions = 26; // aprox

  return (
    <div id="session-guide-printable" className="space-y-0">

      {/* BANNER PRINCIPAL */}
      <div className="bg-gradient-to-r from-slate-900 via-[#393478] to-[#484496] rounded-2xl p-5 text-white shadow-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5 print:hidden">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="indigo" className="bg-white/20 text-white border-white/20">Guía Clínica Oficial</Badge>
            <span className="text-xs text-indigo-100 font-medium">Paciente: {patientName}</span>
            {answeredCount > 0 && (
              <span className="text-[10px] bg-emerald-500 text-white font-bold px-2.5 py-0.5 rounded-full">
                {answeredCount} respuestas anotadas
              </span>
            )}
          </div>
          <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2 mt-1">
            <BookOpen className="w-5 h-5 text-amber-300" />
            Guía Completa para Primera Sesión — Con Respuestas
          </h2>
          <p className="text-xs text-indigo-100/80 mt-0.5">
            Escribe directamente en los cuadros debajo de cada pregunta para anotar las respuestas en vivo.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
          <button onClick={handlePrint} className="px-3.5 py-2 bg-white/15 hover:bg-white/25 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 border border-white/20 transition-all">
            <Printer className="w-3.5 h-3.5" />
            <span>Descargar PDF</span>
          </button>
          {onStartSessionWithNotes && (
            <button onClick={handleConsolidateNotes} className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Transferir Notas a Sesión</span>
            </button>
          )}
        </div>
      </div>

      {/* DOCUMENTO COMPLETO */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden print:rounded-none print:border-none print:shadow-none">

        {/* Encabezado */}
        <div className="bg-gradient-to-r from-[#2d3178] to-[#484496] p-5 print:p-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-lg font-black text-white tracking-tight">Guía para Primera Sesión</h1>
              <p className="text-indigo-200 text-xs mt-0.5">Pauta Clínica Estructurada — OMAPED / Psicolobos</p>
              <div className="flex flex-wrap gap-2 mt-2 text-xs">
                <span className="bg-white/15 text-white px-2.5 py-0.5 rounded-full font-semibold">Paciente: {patientName}</span>
                <span className="bg-white/15 text-white px-2.5 py-0.5 rounded-full font-semibold">
                  {new Date().toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' })}
                </span>
                <span className="bg-white/15 text-white px-2.5 py-0.5 rounded-full font-semibold">30–50 min</span>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ SECCIÓN 1: EL ENCUADRE ═══ */}
        <section className="border-b border-slate-100">
          <div className="flex items-center gap-3 px-5 py-3.5 bg-purple-50 border-b border-purple-100">
            <div className="w-8 h-8 bg-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-xs font-black text-purple-900 uppercase tracking-widest">1. El Encuadre</h2>
              <p className="text-[11px] text-purple-500">Estableciendo las reglas del juego y reduciendo la ansiedad inicial</p>
            </div>
          </div>
          <div className="p-5 space-y-4">
            <p className="text-xs text-slate-500 leading-relaxed">Antes de preguntar, preséntate y da seguridad. Este momento reduce la ansiedad del consultante.</p>

            {/* Speeches con botón de copiar */}
            <div className="space-y-2.5">
              {speeches.map((s) => (
                <div key={s.key} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-wider">{s.label}</span>
                    <button
                      onClick={() => handleCopy(s.text.replace(/"/g, ''), s.key)}
                      className="px-2 py-1 bg-white border border-slate-200 text-slate-500 text-[10px] font-semibold rounded-lg hover:bg-slate-100 flex items-center gap-1 print:hidden"
                    >
                      {copiedKey === s.key ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      {copiedKey === s.key ? 'Copiado' : 'Copiar'}
                    </button>
                  </div>
                  <p className="text-xs text-slate-800 italic leading-relaxed">{s.text}</p>
                </div>
              ))}
            </div>

            {/* Pregunta con campo de respuesta */}
            <QuestionCard
              questionId="enc-reaccion"
              question={`¿Cómo reaccionó ${patientName} o su familia al encuadre inicial?`}
              answer={answers['enc-reaccion'] || ''}
              onAnswerChange={handleAnswerChange}
              accentColor="purple"
              label="Observación"
            />
          </div>
        </section>

        {/* ═══ SECCIÓN 2: MOTIVO DE CONSULTA ═══ */}
        <section className="border-b border-slate-100">
          <div className="flex items-center gap-3 px-5 py-3.5 bg-blue-50 border-b border-blue-100">
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-xs font-black text-blue-900 uppercase tracking-widest">2. Motivo de Consulta y Expectativas</h2>
              <p className="text-[11px] text-blue-500">Comprensión profunda de la demanda y expectativas del consultante</p>
            </div>
          </div>
          <div className="p-5 space-y-3">
            <p className="text-xs text-slate-500 leading-relaxed">Es vital entender no solo el síntoma, sino por qué buscan ayuda <strong>ahora</strong>.</p>
            {[
              { id: 'mc-1', q: `¿Qué es lo que más les preocupa en este momento sobre ${firstName}?` },
              { id: 'mc-2', q: '¿Ha ocurrido algo reciente que los haya motivado a venir a OMAPED hoy?' },
              { id: 'mc-3', q: '¿Qué esperan lograr al finalizar este proceso de atención?' },
              { id: 'mc-4', q: '¿Han recibido atención psicológica o terapéutica anteriormente? ¿Qué les sirvió y qué no?' },
            ].map((item, idx) => (
              <QuestionCard
                key={item.id}
                questionId={item.id}
                question={item.q}
                answer={answers[item.id] || ''}
                onAnswerChange={handleAnswerChange}
                accentColor="blue"
                label={`P${idx + 1}`}
              />
            ))}
          </div>
        </section>

        {/* ═══ SECCIÓN 3: ANAMNESIS ═══ */}
        <section className="border-b border-slate-100">
          <div className="flex items-center gap-3 px-5 py-3.5 bg-emerald-50 border-b border-emerald-100">
            <div className="w-8 h-8 bg-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <HeartHandshake className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-xs font-black text-emerald-900 uppercase tracking-widest">3. Anamnesis: Historia y Condición</h2>
              <p className="text-[11px] text-emerald-500">Historia del desarrollo, diagnóstico y condición biopsicosocial</p>
            </div>
          </div>
          <div className="p-5 space-y-3">
            <p className="text-xs text-slate-500 leading-relaxed">En un contexto de discapacidad o neurodiversidad, navega entre el diagnóstico clínico y la vivencia personal.</p>
            {[
              { id: 'ana-1', label: 'Diagnóstico', q: `¿Cuenta ${firstName} con un diagnóstico formal? ¿Cuál es? [Revisar carnet CONADIS] ¿Quién lo realizó y hace cuánto tiempo?` },
              { id: 'ana-2', label: 'Desarrollo', q: '¿Cómo fue el embarazo y el parto? ¿A qué edad empezó a caminar/hablar?' },
              { id: 'ana-3', label: 'Salud', q: `¿Toma ${firstName} alguna medicación actualmente? ¿Tiene otras condiciones de salud o alergias?` },
              { id: 'ana-4', label: 'Autonomía', q: `¿Cómo se desenvuelve ${firstName} en sus actividades diarias (comer, vestirse, ir al baño)?` },
            ].map((item) => (
              <QuestionCard
                key={item.id}
                questionId={item.id}
                question={item.q}
                answer={answers[item.id] || ''}
                onAnswerChange={handleAnswerChange}
                accentColor="emerald"
                label={item.label}
              />
            ))}
          </div>
        </section>

        {/* ═══ SECCIÓN 4: CONTEXTO FAMILIAR ═══ */}
        <section className="border-b border-slate-100">
          <div className="flex items-center gap-3 px-5 py-3.5 bg-amber-50 border-b border-amber-100">
            <div className="w-8 h-8 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Users className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-xs font-black text-amber-900 uppercase tracking-widest">4. Contexto Familiar y Social</h2>
              <p className="text-[11px] text-amber-500">Entorno directo, convivencia, cuidador principal y soporte</p>
            </div>
          </div>
          <div className="p-5 space-y-3">
            <p className="text-xs text-slate-500 leading-relaxed">{firstName} no es una isla; su entorno determina gran parte de su bienestar.</p>
            {[
              { id: 'fam-1', q: '¿Quiénes viven en casa y cómo es la convivencia diaria?' },
              { id: 'fam-2', q: `¿Cómo reaccionó la familia ante el diagnóstico o la condición de ${firstName}?` },
              { id: 'fam-3', q: '¿Quién es el cuidador principal y qué apoyo recibe esa persona?' },
              { id: 'fam-4', q: `¿Asiste ${firstName} al colegio? ¿Cómo es su relación con los profesores y compañeros?` },
            ].map((item, idx) => (
              <QuestionCard
                key={item.id}
                questionId={item.id}
                question={item.q}
                answer={answers[item.id] || ''}
                onAnswerChange={handleAnswerChange}
                accentColor="amber"
                label={`F${idx + 1}`}
              />
            ))}
          </div>
        </section>

        {/* ═══ SECCIÓN 5: FORTALEZAS ═══ */}
        <section className="border-b border-slate-100">
          <div className="flex items-center gap-3 px-5 py-3.5 bg-sky-50 border-b border-sky-100">
            <div className="w-8 h-8 bg-sky-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Smile className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-xs font-black text-sky-900 uppercase tracking-widest">5. Recursos, Fortalezas y Gustos</h2>
              <p className="text-[11px] text-sky-500">Rescate de factores protectores, intereses y comunicación</p>
            </div>
          </div>
          <div className="p-5 space-y-3">
            <p className="text-xs text-slate-500 leading-relaxed">Para no centrarse solo en el déficit, rescata la identidad de {firstName}.</p>
            {[
              { id: 'for-1', q: `¿Qué es lo que más le gusta hacer a ${firstName}? ¿Qué se le da muy bien?` },
              { id: 'for-2', q: `¿Cómo se comunica ${firstName} cuando está feliz o cuando algo le molesta?` },
              { id: 'for-3', q: '¿Qué actividades comparten en familia que resulten agradables para todos?' },
            ].map((item, idx) => (
              <QuestionCard
                key={item.id}
                questionId={item.id}
                question={item.q}
                answer={answers[item.id] || ''}
                onAnswerChange={handleAnswerChange}
                accentColor="sky"
                label={`★ R${idx + 1}`}
              />
            ))}
          </div>
        </section>

        {/* ═══ SECCIÓN 6: CUIDAR AL CUIDADOR ═══ */}
        <section>
          <div className="flex items-center gap-3 px-5 py-3.5 bg-rose-50 border-b border-rose-100">
            <div className="w-8 h-8 bg-rose-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-xs font-black text-rose-900 uppercase tracking-widest">6. Exploración del Estado del Cuidador — Cuidar al que cuida</h2>
              <p className="text-[11px] text-rose-500">Evaluación del nivel de sobrecarga, cansancio y autocuidado</p>
            </div>
          </div>
          <div className="p-5 space-y-5">
            <p className="text-xs text-slate-500 leading-relaxed">Identifica niveles de estrés, redes de apoyo y el impacto de la discapacidad/neurodiversidad en la identidad del padre o madre.</p>

            {/* Bloque A */}
            <div className="space-y-2.5">
              <h3 className="text-[10px] font-black text-rose-700 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-4 h-4 bg-rose-200 text-rose-800 rounded-full flex items-center justify-center font-black text-[8px]">A</span>
                Bienestar Emocional y Carga Diaria
              </h3>
              {[
                { id: 'cui-a1', q: `Además de conversar sobre ${firstName}, ¿cómo se siente usted hoy?` },
                { id: 'cui-a2', q: '¿Cómo es un día normal en su vida desde que se levanta hasta que se duerme? ¿Siente que tiene momentos para descansar?' },
                { id: 'cui-a3', q: '¿Cómo describiría su nivel de energía o cansancio en una escala del 1 al 10?' },
                { id: 'cui-a4', q: '¿Qué es lo que más le genera estrés o preocupación en su día a día actualmente?' },
              ].map((item) => (
                <QuestionCard key={item.id} questionId={item.id} question={item.q} answer={answers[item.id] || ''} onAnswerChange={handleAnswerChange} accentColor="rose" />
              ))}
            </div>

            {/* Bloque B */}
            <div className="space-y-2.5">
              <h3 className="text-[10px] font-black text-rose-700 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-4 h-4 bg-rose-200 text-rose-800 rounded-full flex items-center justify-center font-black text-[8px]">B</span>
                Identidad y Autocuidado
              </h3>
              {[
                { id: 'cui-b1', q: `¿Considera que su vida ha cambiado significativamente desde que conoce el diagnóstico de ${firstName} o asiste a sus terapias?` },
                { id: 'cui-b2', q: '¿Cuándo fue la última vez que hizo algo pensando principalmente en su bienestar (un hobby, salir con amigos, descansar)?' },
                { id: 'cui-b3', q: '¿Por momentos se ha sentido muy abrumado/a al tener que realizar labores de cuidado?' },
              ].map((item) => (
                <QuestionCard key={item.id} questionId={item.id} question={item.q} answer={answers[item.id] || ''} onAnswerChange={handleAnswerChange} accentColor="rose" />
              ))}
            </div>

            {/* Bloque C */}
            <div className="space-y-2.5">
              <h3 className="text-[10px] font-black text-rose-700 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-4 h-4 bg-rose-200 text-rose-800 rounded-full flex items-center justify-center font-black text-[8px]">C</span>
                Redes de Apoyo (Soporte Percibido)
              </h3>
              {[
                { id: 'cui-c1', q: `Si hoy usted tuviera una emergencia o se enfermara, ¿quién podría hacerse cargo de ${firstName}?` },
                { id: 'cui-c2', q: '¿Siente que su pareja/familia comparte la responsabilidad del cuidado de manera equitativa?' },
                { id: 'cui-c3', q: '¿Tiene algún espacio (amigos, grupo de iglesia, otros padres) donde pueda hablar de cómo se siente sin ser juzgado?' },
              ].map((item) => (
                <QuestionCard key={item.id} questionId={item.id} question={item.q} answer={answers[item.id] || ''} onAnswerChange={handleAnswerChange} accentColor="rose" />
              ))}
            </div>

            {/* Bloque D */}
            <div className="space-y-2.5">
              <h3 className="text-[10px] font-black text-rose-700 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-4 h-4 bg-rose-200 text-rose-800 rounded-full flex items-center justify-center font-black text-[8px]">D</span>
                Percepción de Autoeficacia y Duelo
              </h3>
              {[
                { id: 'cui-d1', q: `¿Cómo se siente con respecto a su capacidad para manejar las crisis o conductas de ${firstName}?` },
                { id: 'cui-d2', q: '¿Hay algo que le genere sentimientos de culpa o frustración con frecuencia?' },
                { id: 'cui-d3', q: `¿Qué expectativas tiene sobre el futuro de ${firstName} y cómo le hacen sentir esas ideas?` },
              ].map((item) => (
                <QuestionCard key={item.id} questionId={item.id} question={item.q} answer={answers[item.id] || ''} onAnswerChange={handleAnswerChange} accentColor="rose" />
              ))}
            </div>
          </div>
        </section>

        {/* Pie del documento */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-[11px] text-slate-500">
              <strong>Psicolobos — Gestión Clínica Profesional</strong>{' '}•{' '}
              {new Date().toLocaleDateString('es-PE', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
            {answeredCount > 0 && (
              <p className="text-[10px] text-emerald-600 font-semibold mt-0.5 print:hidden">{answeredCount} respuestas registradas</p>
            )}
          </div>
          <div className="flex items-center gap-2 print:hidden">
            <button onClick={handlePrint} className="px-3.5 py-2 bg-[#484496] hover:bg-[#393478] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all">
              <Printer className="w-3.5 h-3.5" />
              Descargar PDF con Respuestas
            </button>
            {onStartSessionWithNotes && (
              <button onClick={handleConsolidateNotes} className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all">
                <Sparkles className="w-3.5 h-3.5" />
                Transferir Notas
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
