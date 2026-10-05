import { NextResponse } from 'next/server';
import { geminiService } from '@/lib/GeminiService';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    // 1. Validar autenticación
    const cookieStore = cookies();
    const sessionToken = cookieStore.get('session_token');
    
    if (!sessionToken) {
      return NextResponse.json({ error: 'No autorizado. Se requiere iniciar sesión.' }, { status: 401 });
    }

    // 2. Extraer datos del body
    const body = await req.json();
    const { prompt, context } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'El prompt es requerido.' }, { status: 400 });
    }

    // 3. Consultar a Gemini
    const aiResponse = await geminiService.generateContent(prompt, context);

    // 4. Retornar respuesta
    return NextResponse.json({ response: aiResponse });

  } catch (error: any) {
    console.error('API /ai/chat error:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor al procesar la solicitud de IA.' },
      { status: 500 }
    );
  }
}
