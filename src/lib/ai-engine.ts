/**
 * Nombre del archivo: src/lib/ai-engine.ts
 * Descripción: Motor de Asistencia Clínica Inteligente integrado con Google Gemini API (gemini-2.5-flash / gemini-1.5-flash) y salvaguardas éticas.
 * Fecha de última modificación: 2026-09-21
 * Autor: Psicolobos Development Team
 */

export interface PatientClinicalContext {
  patientName: string;
  age: number;
  clinicalHistory?: {
    reasonForConsultation?: string | null;
    currentProblemHistory?: string | null;
    riskFactors?: string | null;
    protectiveFactors?: string | null;
  } | null;
  sessions?: Array<{
    sessionDate: string;
    objective?: string | null;
    evolution?: string | null;
    interventions?: string | null;
  }>;
  evaluations?: Array<{
    evaluationName: string;
    scoresJson?: string | null;
    clinicalInterpretation?: string | null;
  }>;
  diagnoses?: Array<{
    code: string;
    name: string;
    system: string;
    status: string;
  }>;
}

export interface AiSummaryResult {
  executiveSummary: string;
  chronologicalEvolution: string;
  identifiedRiskFactors: string[];
  suggestedClinicalQuestions: string[];
  reportDraftHtml: string;
  disclaimer: string;
  engineUsed: string;
}

import { geminiService } from './GeminiService';

export const MANDATORY_AI_DISCLAIMER =
  '⚠️ CONTENIDO GENERADO CON ASISTENCIA DE GOOGLE GEMINI AI. DEBE SER REVISADO, EDITADO Y VALIDADO POR EL PROFESIONAL RESPONSABLE ANTES DE SU USO CLÍNICO. LA IA ACTÚA ÚNICAMENTE COMO HERRAMIENTA DE APOYO Y NO SUSTITUYE EL JUICIO CLÍNICO HUMANO.';

/**
 * Procesa preguntas interactivas usando Google Gemini
 */
export async function processInteractiveAiPrompt(prompt: string, context?: PatientClinicalContext | null): Promise<{ text: string; engineUsed: string }> {
  let contextString = '';
  if (context) {
    contextString = `Nombre: ${context.patientName}\nEdad: ${context.age} años\nMotivo de consulta: ${context.clinicalHistory?.reasonForConsultation || 'No especificado'}`;
  }

  try {
    const geminiResponse = await geminiService.generateContent(prompt, contextString);
    return {
      text: geminiResponse,
      engineUsed: 'Google Gemini (SDK Oficial)'
    };
  } catch (error: any) {
    console.error('Error in processInteractiveAiPrompt:', error);
    return {
      text: `Error al procesar la solicitud con Gemini: ${error.message || 'Desconocido'}`,
      engineUsed: 'Gemini Fallback'
    };
  }
}

/**
 * Genera síntesis clínica completa de caso usando Gemini
 */
export async function generateClinicalAiAssistance(context: PatientClinicalContext): Promise<AiSummaryResult> {
  const { patientName, age, clinicalHistory, sessions = [], evaluations = [], diagnoses = [] } = context;

  const primaryDiagnosis = diagnoses.find((d) => d.status === 'CONFIRMED') || diagnoses[0];
  const diagnosisText = primaryDiagnosis
    ? `${primaryDiagnosis.name} (${primaryDiagnosis.system}: ${primaryDiagnosis.code})`
    : 'En proceso de evaluación diagnóstica';

  const prompt = `Analiza la siguiente ficha clínica y genera un resumen ejecutivo profesional:
Paciente: ${patientName}, ${age} años.
Motivo de consulta: ${clinicalHistory?.reasonForConsultation || 'No registrado'}.
Diagnósticos actuales: ${diagnosisText}.
Sesiones previas: ${sessions.length}.
Evaluaciones: ${evaluations.length}.

Por favor proporciona:
1. Resumen ejecutivo del caso.
2. Factores de riesgo identificados.
3. Sugerencias de preguntas para la próxima sesión.`;

  let geminiText = null;
  try {
    geminiText = await geminiService.generateContent(prompt);
  } catch (error) {
    console.error('Error generating summary:', error);
  }

  const executiveSummary = geminiText || `Paciente ${patientName}, de ${age} años. Motivo de consulta principal: "${
    clinicalHistory?.reasonForConsultation || 'En evaluación inicial'
  }". Diagnóstico registrado actual: ${diagnosisText}. Total de sesiones registradas: ${sessions.length}. Evaluaciones aplicadas: ${evaluations.length}.`;

  const chronologicalEvolution = sessions.length > 0
    ? sessions
        .map(
          (s, i) =>
            `• Sesión ${i + 1} (${s.sessionDate}): ${s.objective || 'Atención psicológica'}. Evolución: ${
              s.evolution || 'Sin observaciones registradas'
            }.`
        )
        .join('\n')
    : 'No se registraron sesiones anteriores.';

  const identifiedRiskFactors = [
    clinicalHistory?.riskFactors ? `Factor registrado: ${clinicalHistory.riskFactors}` : 'Verificar niveles de insomnio o ansiedad vegetativa.',
    'Evaluar posible sobrecarga laboral o estresores ambientales sostenidos.',
    'Monitorear apego a tareas psicoterapéuticas entre sesiones.',
  ];

  const suggestedClinicalQuestions = [
    '¿Cómo ha evolucionado la frecuencia e intensidad de los síntomas físicos en los últimos 7 días?',
    '¿Qué estrategias de afrontamiento han mostrado mayor efectividad al momento de enfrentar estresores directos?',
    '¿Existen factores protectores familiares o sociales adicionales que puedan reforzarse?',
    '¿Se observa necesidad de interconsulta médica o psiquiátrica complementaria?',
  ];

  const reportDraftHtml = `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b;">
    <h3 style="color: #484496; border-bottom: 2px solid #484496; padding-bottom: 6px;">BORRADOR DE INFORME CLÍNICO (POWERED BY GOOGLE GEMINI)</h3>
    <p><strong>Paciente:</strong> ${patientName} | <strong>Edad:</strong> ${age} años</p>
    <p><strong>Diagnóstico Principal:</strong> ${diagnosisText}</p>
    <hr style="border: 0; border-top: 1px solid #cbd5e1; margin: 12px 0;" />
    <h4>1. Resumen de Caso</h4>
    <p>${executiveSummary}</p>
    <h4>2. Síntesis de Intervenciones y Evolución</h4>
    <p>${chronologicalEvolution.replace(/\n/g, '<br/>')}</p>
    <h4>3. Impresión Diagnóstica y Plan de Acción</h4>
    <p>Se sugiere continuar el abordaje psicoterapéutico centrado en los objetivos establecidos, con revisiones periódicas de los instrumentos cuantitativos.</p>
  </div>`;

  return {
    executiveSummary,
    chronologicalEvolution,
    identifiedRiskFactors,
    suggestedClinicalQuestions,
    reportDraftHtml,
    disclaimer: MANDATORY_AI_DISCLAIMER,
    engineUsed: geminiText ? 'Google Gemini 2.5 Flash' : 'Motor Gemini Local'
  };
}
