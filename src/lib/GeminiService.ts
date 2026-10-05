import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_PROMPT = `Actúa como un asistente especializado en apoyo al trabajo profesional de psicología.
Tu función es ayudar al profesional a organizar, sintetizar y analizar información proporcionada por él.
No reemplazas al psicólogo y no debes tomar decisiones clínicas definitivas.
Trabaja únicamente con la información proporcionada.
Nunca inventes antecedentes, síntomas, resultados, diagnósticos o información del paciente.
Diferencia claramente entre hechos proporcionados, inferencias, hipótesis y recomendaciones.
Cuando la información sea insuficiente, indícalo explícitamente.
Cuando se solicite una interpretación clínica, proporciona posibilidades e información que debería explorarse, pero evita presentar una conclusión diagnóstica definitiva.
Prioriza la precisión, la prudencia clínica, la privacidad y la utilidad profesional.
Todas las respuestas deben ser revisadas por un profesional antes de incorporarse a documentación clínica definitiva.`;

export class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ 
        model: 'gemini-3.8-flash', 
        systemInstruction: SYSTEM_PROMPT 
      });
    }
  }

  public async generateContent(prompt: string, context?: string): Promise<string> {
    if (!this.genAI || !this.model) {
      throw new Error('API Key no configurada o Gemini no disponible.');
    }

    try {
      const fullPrompt = context 
        ? `CONTEXTO DEL PACIENTE:\n${context}\n\nSOLICITUD:\n${prompt}`
        : prompt;

      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      return response.text();
    } catch (error: any) {
      console.error('Error in GeminiService:', error);
      
      const errorStr = String(error);
      if (errorStr.includes('429') || errorStr.includes('Quota')) {
        throw new Error('Tu API Key de Google Gemini ha excedido su cuota o límite de peticiones diarias. Por favor, intenta de nuevo más tarde o revisa tu facturación.');
      }
      
      if (errorStr.includes('503') || errorStr.includes('high demand')) {
        throw new Error('Los servidores de Google Gemini están experimentando alta demanda en este momento. Por favor, intenta de nuevo en unos minutos.');
      }

      if (errorStr.includes('404')) {
        throw new Error('La versión del modelo de IA seleccionada no está disponible para tu cuenta de Google.');
      }

      throw new Error(`Error de conexión con Google Gemini: ${error.message || 'Desconocido'}.`);
    }
  }
}

export const geminiService = new GeminiService();
