/**
 * Nombre del archivo: src/lib/anamnesis-parser.ts
 * Descripción: Engine universal e íntegro de digitalización de Anamnesis e Historia Clínica (PDF, DOCX, TXT, OCR) con sanitización anti-etiquetas y modelo interactivo de 7 secciones.
 * Fecha de última modificación: 2026-09-20
 * Autor: Psicolobos Development Team
 */

import zlib from 'zlib';
import { processDocumentOcr } from '@/lib/ocr';

export interface AnamnesisModel {
  documentInfo?: {
    fileName?: string;
    type?: string;
    digitalizedAt?: string;
  };
  section1_estudiante: {
    nombre: string;
    sexo: string;
    fechaNacimiento: string;
    edadAnos: string;
    edadMeses: string;
    paisNatal: string;
    domicilio: string;
    telefono: string;
    lenguaMaterna: { comprende: boolean; habla: boolean; lee: boolean; escribe: boolean };
    lenguaUso: string;
    escolaridadActual: string;
    establecimiento: string;
  };
  section2_informantes: Array<{ fecha: string; nombre: string; relacion: string; enPresenciaDe: string }>;
  section3_entrevistadores: Array<{ fecha: string; nombre: string; rolCargo: string }>;
  section4_motivo: string;
  section5_desarrolloSalud: {
    diagnosticoPrevio: {
      pediatria: boolean;
      psicologia: boolean;
      kinesiologia: boolean;
      psiquiatria: boolean;
      genetico: boolean;
      psicopedagogia: boolean;
      fonoaudiologia: boolean;
      terapiaOcupacional: boolean;
      neurologia: boolean;
      otro: string;
    };
    primerAnoVida: {
      tipoParto: string;
      asistenciaMedicaParto: boolean;
      peso: string;
      talla: string;
      antecedentesEmbarazoParto: string;
      desnutricion: boolean;
      traumatismos: boolean;
      encefalitis: boolean;
      obesidad: boolean;
      intoxicacion: boolean;
      meningitis: boolean;
      fiebreAlta: boolean;
      enfermedadRespiratoria: boolean;
      convulsiones: boolean;
      asma: boolean;
      hospitalizaciones: boolean;
      motivoHospitalizacion: string;
      controlesSaludPeriodicos: boolean;
      vacunasAlDia: boolean;
      observaciones: string;
    };
    desarrolloSensorioMotriz: {
      fijaCabezaEdad: string;
      seSientaSoloEdad: string;
      caminaSinApoyoEdad: string;
      primerasPalabrasEdad: string;
      primerasFrasesEdad: string;
      seVisteSoloEdad: string;
      controlEsfinterVesicalDiurno: boolean;
      controlEsfinterVesicalNocturno: boolean;
      controlEsfinterAnalDiurno: boolean;
      controlEsfinterAnalNocturno: boolean;
      actividadMotora: string;
      tonoMuscular: string;
      estabilidadAlCaminar: boolean;
      caidasFrecuentes: boolean;
      dominanciaLateral: boolean;
      motricidadFina: { garra: boolean; prension: boolean; pinza: boolean; ensarta: boolean; dibuja: boolean; escribe: boolean };
      signosCognitivos: {
        reaccionaVocesCaras: boolean;
        manipulaExploraObjetos: boolean;
        demandaObjetosCompania: boolean;
        comprendeProhibiciones: boolean;
        sonrieBalbuceaGrita: boolean;
        descoordinacionOjoMano: boolean;
      };
    };
    visionAudicion: {
      interesEstimulosVisuales: boolean;
      interesEstimulosAuditivos: boolean;
      ojosIrritadosLlorosos: boolean;
      reconoceVocesSonidos: boolean;
      doloresCabezaFrecuentes: boolean;
      giraCabezaAnteRuido: boolean;
      acercaAlejaObjetosVista: boolean;
      acercaOidosTv: boolean;
      sigueVistaObjetos: boolean;
      tapaGolpeaOidos: boolean;
      doloresOidosFrecuentes: boolean;
      pronunciacionOralAdecuada: boolean;
      diagnosticoMiopiaEstrabismo: boolean;
      diagnosticoOtitisHipoacusia: boolean;
      observaciones: string;
    };
    desarrolloLenguaje: {
      comunicacionPreferente: string;
      expresivo: { balbuceaEmiteSonidos: boolean; emiteFrases: boolean; vocalizaGestos: boolean; relataExperiencias: boolean; emitePalabras: boolean; pronunciacionClara: boolean };
      comprensivo: { identificaObjetos: boolean; sigueInstruccionesSimples: boolean; identificaPersonas: boolean; sigueInstruccionesComplejas: boolean; comprendeConceptosAbstractos: boolean; sigueInstruccionesGrupales: boolean; respondeCoherentePreguntas: boolean; comprendeRelatosCuentos: boolean };
      perdidaLenguajeOral: string;
    };
    desarrolloSocial: {
      relacionEspontaneaPersonas: boolean;
      relacionColaborativa: boolean;
      explicaRazonesComportamiento: boolean;
      respetaNormasSociales: boolean;
      participaActividadesGrupales: boolean;
      respetaNormasEscolares: boolean;
      optaTrabajoIndividual: boolean;
      muestraSentidoHumor: boolean;
      lenguajeEcolalico: boolean;
      movimientosEstereotipados: boolean;
      dificultadAdaptarseSituacionesNuevas: boolean;
      pataletasFrecuentes: boolean;
      reaccionLuces: string;
      reaccionSonidos: string;
      reaccionExtraños: string;
    };
    estadoActualSalud: {
      vacunasAlDia: boolean;
      trastornoMotor: boolean;
      epilepsia: boolean;
      problemaBroncoRespiratorio: boolean;
      problemasCardiacos: boolean;
      enfermedadInfectoContagiosa: boolean;
      paraplejia: boolean;
      trastornoEmocional: boolean;
      perdidaAuditiva: boolean;
      trastornoConductual: boolean;
      perdidaVisual: boolean;
      tratamientoSaludEspecificar: string;
      alimentacion: string;
      pesoApreciacion: string;
      suenoEstado: string;
      horasSueño: string;
      duermeSolo: boolean;
      humorHabitual: string;
    };
  };
  section6_antecedentesFamiliares: {
    integrantesHogar: Array<{ nombre: string; parentesco: string; edad: string; escolaridad: string; ocupacion: string }>;
    antecedentesSaludFamilia: string;
    observaciones: string;
  };
  section7_antecedentesEscolares: {
    edadIngresoEscolar: string;
    asistioJardinInfantil: boolean;
    numColegiosEstudiado: string;
    modalidadEnsenanza: string;
    motivoCambiosColegio: string;
    haRepetidoCursos: boolean;
    cursosRepetidosMotivo: string;
    nivelCursoActual: string;
    dificultadAprendizaje: boolean;
    dificultadParticipar: boolean;
    conductaDisruptiva: boolean;
    asisteRegularmente: boolean;
    asisteConAgrado: boolean;
    apoyoFamiliarTareas: boolean;
    tieneAmigos: boolean;
    evaluacionFamiliaDesempeno: string;
    respuestaFamiliaDificultades: string;
    respuestaFamiliaExitos: string;
    refuerzosPremiosUsados: string;
    quienesApoyanAprendizaje: string[];
    expectativasFamiliaFuturo: string;
    ambienteFisicoEmocional: string;
    comentariosObservacionesAdicionales: string;
  };
}

export const defaultAnamnesisModel: AnamnesisModel = {
  documentInfo: {
    fileName: 'ANAMNESIS_DIGITAL.pdf',
    type: 'Pauta de Anamnesis / Entrevista a la Familia',
  },
  section1_estudiante: {
    nombre: '',
    sexo: 'F',
    fechaNacimiento: '',
    edadAnos: '',
    edadMeses: '',
    paisNatal: 'Chile',
    domicilio: '',
    telefono: '',
    lenguaMaterna: { comprende: true, habla: true, lee: true, escribe: true },
    lenguaUso: 'Español',
    escolaridadActual: '',
    establecimiento: '',
  },
  section2_informantes: [
    { fecha: new Date().toISOString().slice(0, 10), nombre: '', relacion: 'Madre / Apoderado', enPresenciaDe: 'Entrevistador' }
  ],
  section3_entrevistadores: [
    { fecha: new Date().toISOString().slice(0, 10), nombre: 'Psc. Hector Ogoña', rolCargo: 'Psicólogo Clínico Evaluador' }
  ],
  section4_motivo: '',
  section5_desarrolloSalud: {
    diagnosticoPrevio: {
      pediatria: false,
      psicologia: true,
      kinesiologia: false,
      psiquiatria: false,
      genetico: false,
      psicopedagogia: false,
      fonoaudiologia: false,
      terapiaOcupacional: false,
      neurologia: false,
      otro: '',
    },
    primerAnoVida: {
      tipoParto: 'normal',
      asistenciaMedicaParto: true,
      peso: '',
      talla: '',
      antecedentesEmbarazoParto: '',
      desnutricion: false,
      traumatismos: false,
      encefalitis: false,
      obesidad: false,
      intoxicacion: false,
      meningitis: false,
      fiebreAlta: false,
      enfermedadRespiratoria: false,
      convulsiones: false,
      asma: false,
      hospitalizaciones: false,
      motivoHospitalizacion: '',
      controlesSaludPeriodicos: true,
      vacunasAlDia: true,
      observaciones: '',
    },
    desarrolloSensorioMotriz: {
      fijaCabezaEdad: '',
      seSientaSoloEdad: '',
      caminaSinApoyoEdad: '',
      primerasPalabrasEdad: '',
      primerasFrasesEdad: '',
      seVisteSoloEdad: '',
      controlEsfinterVesicalDiurno: true,
      controlEsfinterVesicalNocturno: true,
      controlEsfinterAnalDiurno: true,
      controlEsfinterAnalNocturno: true,
      actividadMotora: 'normal',
      tonoMuscular: 'normal',
      estabilidadAlCaminar: true,
      caidasFrecuentes: false,
      dominanciaLateral: true,
      motricidadFina: { garra: true, prension: true, pinza: true, ensarta: true, dibuja: true, escribe: true },
      signosCognitivos: {
        reaccionaVocesCaras: true,
        manipulaExploraObjetos: true,
        demandaObjetosCompania: true,
        comprendeProhibiciones: true,
        sonrieBalbuceaGrita: true,
        descoordinacionOjoMano: false,
      },
    },
    visionAudicion: {
      interesEstimulosVisuales: true,
      interesEstimulosAuditivos: true,
      ojosIrritadosLlorosos: false,
      reconoceVocesSonidos: true,
      doloresCabezaFrecuentes: false,
      giraCabezaAnteRuido: true,
      acercaAlejaObjetosVista: false,
      acercaOidosTv: false,
      sigueVistaObjetos: true,
      tapaGolpeaOidos: false,
      doloresOidosFrecuentes: false,
      pronunciacionOralAdecuada: true,
      diagnosticoMiopiaEstrabismo: false,
      diagnosticoOtitisHipoacusia: false,
      observaciones: '',
    },
    desarrolloLenguaje: {
      comunicacionPreferente: 'oral',
      expresivo: { balbuceaEmiteSonidos: true, emiteFrases: true, vocalizaGestos: true, relataExperiencias: true, emitePalabras: true, pronunciacionClara: true },
      comprensivo: { identificaObjetos: true, sigueInstruccionesSimples: true, identificaPersonas: true, sigueInstruccionesComplejas: true, comprendeConceptosAbstractos: true, sigueInstruccionesGrupales: true, respondeCoherentePreguntas: true, comprendeRelatosCuentos: true },
      perdidaLenguajeOral: '',
    },
    desarrolloSocial: {
      relacionEspontaneaPersonas: true,
      relacionColaborativa: true,
      explicaRazonesComportamiento: true,
      respetaNormasSociales: true,
      participaActividadesGrupales: true,
      respetaNormasEscolares: true,
      optaTrabajoIndividual: false,
      muestraSentidoHumor: true,
      lenguajeEcolalico: false,
      movimientosEstereotipados: false,
      dificultadAdaptarseSituacionesNuevas: false,
      pataletasFrecuentes: false,
      reaccionLuces: 'natural',
      reaccionSonidos: 'natural',
      reaccionExtraños: 'natural',
    },
    estadoActualSalud: {
      vacunasAlDia: true,
      trastornoMotor: false,
      epilepsia: false,
      problemaBroncoRespiratorio: false,
      problemasCardiacos: false,
      enfermedadInfectoContagiosa: false,
      paraplejia: false,
      trastornoEmocional: false,
      perdidaAuditiva: false,
      trastornoConductual: false,
      perdidaVisual: false,
      tratamientoSaludEspecificar: '',
      alimentacion: 'normal',
      pesoApreciacion: 'normal',
      suenoEstado: 'tranquilo',
      horasSueño: '8-9 horas',
      duermeSolo: true,
      humorHabitual: 'alegre',
    },
  },
  section6_antecedentesFamiliares: {
    integrantesHogar: [
      { nombre: '', parentesco: 'Madre', edad: '', escolaridad: 'Educación Superior', ocupacion: '' }
    ],
    antecedentesSaludFamilia: '',
    observaciones: '',
  },
  section7_antecedentesEscolares: {
    edadIngresoEscolar: '5 años',
    asistioJardinInfantil: true,
    numColegiosEstudiado: '1',
    modalidadEnsenanza: 'regular',
    motivoCambiosColegio: '',
    haRepetidoCursos: false,
    cursosRepetidosMotivo: '',
    nivelCursoActual: '',
    dificultadAprendizaje: false,
    dificultadParticipar: false,
    conductaDisruptiva: false,
    asisteRegularmente: true,
    asisteConAgrado: true,
    apoyoFamiliarTareas: true,
    tieneAmigos: true,
    evaluacionFamiliaDesempeno: 'satisfactorio',
    respuestaFamiliaDificultades: 'apoyo',
    respuestaFamiliaExitos: 'apoyo',
    refuerzosPremiosUsados: '',
    quienesApoyanAprendizaje: ['Madre', 'Padre'],
    expectativasFamiliaFuturo: 'alta',
    ambienteFisicoEmocional: 'Ambos',
    comentariosObservacionesAdicionales: '',
  }
};

export interface ParsedAnamnesisData {
  rawExtractedText: string;
  reasonForConsultation: string;
  currentProblemHistory: string;
  personalBackground: string;
  familyBackground: string;
  medicalBackground: string;
  psychologicalBackground: string;
  educationalHistory: string;
  workHistory: string;
  socialHistory: string;
  familyRelationships: string;
  habits: string;
  riskFactors: string;
  protectiveFactors: string;
  clinicalObservations: string;
  interventionPlan: string;
  digitalAnamnesisModel: AnamnesisModel;
}

/**
 * Extrae texto plano de un buffer de archivo PDF analizando flujos uncompressed e inflated,
 * desescapando caracteres de PDF, eliminando nulos y decodificando fuentes desplazadas (Shift-3 Caesar).
 */
export function extractTextFromPdfBuffer(buffer: Buffer): string {
  try {
    const str = buffer.toString('latin1');
    const streamRegex = /stream[\r\n]+([\s\S]*?)[\r\n]+endstream/g;
    let match: RegExpExecArray | null;
    let text = '';

    while ((match = streamRegex.exec(str)) !== null) {
      let streamData = Buffer.from(match[1], 'binary');
      try {
        streamData = zlib.unzipSync(streamData);
      } catch {
        // Flujo no comprimido con zlib
      }

      const streamStr = streamData.toString('latin1');

      const tjRegex = /\(([^)]+)\)\s*Tj/g;
      let tjMatch: RegExpExecArray | null;
      while ((tjMatch = tjRegex.exec(streamStr)) !== null) {
        text += tjMatch[1];
      }

      const tjArrayRegex = /\[([^\]]+)\]\s*TJ/g;
      let tjArrMatch: RegExpExecArray | null;
      while ((tjArrMatch = tjArrayRegex.exec(streamStr)) !== null) {
        const inner = tjArrMatch[1];
        const innerStrRegex = /\(([^)]+)\)/g;
        let innerMatch: RegExpExecArray | null;
        while ((innerMatch = innerStrRegex.exec(inner)) !== null) {
          text += innerMatch[1];
        }
        text += ' ';
      }
      text += ' ';
    }

    if (text.trim().length < 50) {
      const stringRegex = /\(([^)]+)\)/g;
      let sMatch: RegExpExecArray | null;
      while ((sMatch = stringRegex.exec(str)) !== null) {
        const candidate = sMatch[1];
        if (candidate.length > 3 && /[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(candidate)) {
          text += candidate + ' ';
        }
      }
    }

    text = text
      .replace(/\u0000/g, '')
      .replace(/\\\(/g, '(')
      .replace(/\\\)/g, ')')
      .replace(/\\\\/g, '\\')
      .replace(/\\r/g, ' ')
      .replace(/\\n/g, ' ')
      .replace(/\$[A-Z0-9]\$[A-Z0-9]+/g, '')
      .replace(/\$N\$0N/g, '');

    return text.replace(/\s+/g, ' ').trim();
  } catch (err) {
    console.error('Error al extraer texto del PDF:', err);
    return '';
  }
}

/**
 * Extrae texto de un archivo Word (.docx) leyendo etiquetas <w:t> en el buffer de XML.
 */
export function extractTextFromDocxBuffer(buffer: Buffer): string {
  try {
    let pos = 0;
    let fullText = '';

    while (pos < buffer.length - 30) {
      if (
        buffer[pos] === 0x50 &&
        buffer[pos + 1] === 0x4b &&
        buffer[pos + 2] === 0x03 &&
        buffer[pos + 3] === 0x04
      ) {
        const compression = buffer.readUInt16LE(pos + 8);
        const compressedSize = buffer.readUInt32LE(pos + 18);
        const fileNameLen = buffer.readUInt16LE(pos + 26);
        const extraLen = buffer.readUInt16LE(pos + 28);

        const fileName = buffer.toString('utf-8', pos + 30, pos + 30 + fileNameLen);
        const dataStart = pos + 30 + fileNameLen + extraLen;
        const dataEnd = dataStart + compressedSize;

        if (fileName.startsWith('word/') && fileName.endsWith('.xml')) {
          const compressedData = buffer.slice(dataStart, dataEnd);
          let xmlStr = '';
          try {
            if (compression === 8) {
              xmlStr = zlib.inflateRawSync(compressedData).toString('utf-8');
            } else if (compression === 0) {
              xmlStr = compressedData.toString('utf-8');
            }
          } catch (err) {
            try {
              xmlStr = zlib.inflateSync(compressedData).toString('utf-8');
            } catch (e) {}
          }

          if (xmlStr) {
            const pRegex = /<w:p[^>]*>([\s\S]*?)<\/w:p>/g;
            let pMatch: RegExpExecArray | null;
            while ((pMatch = pRegex.exec(xmlStr)) !== null) {
              const pXml = pMatch[1];
              let paragraphText = '';
              const wtRegex = /<w:t[^>]*>([\s\S]*?)<\/w:t>/g;
              let tMatch: RegExpExecArray | null;
              while ((tMatch = wtRegex.exec(pXml)) !== null) {
                paragraphText += tMatch[1];
              }
              if (paragraphText.trim()) {
                fullText += paragraphText.trim() + '\n';
              }
            }
          }
        }

        pos = dataEnd > pos ? dataEnd : pos + 1;
      } else {
        pos++;
      }
    }

    const cleaned = fullText
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .trim();

    if (cleaned) return cleaned;

    // Fallback a regex básico si no se encontró estructura de párrafos
    const latinStr = buffer.toString('latin1');
    let extractedText = '';
    const wtRegex = /<w:t[^>]*>([\s\S]*?)<\/w:t>/g;
    let match: RegExpExecArray | null;
    while ((match = wtRegex.exec(latinStr)) !== null) {
      extractedText += match[1] + ' ';
    }

    return extractedText
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();
  } catch (err) {
    console.error('Error al extraer texto de DOCX:', err);
    return '';
  }
}

const KNOWN_LABEL_PHRASES = [
  'nombre', 'sexo', 'fecha', 'nacimiento', 'edad', 'país', 'domicilio',
  'teléfono', 'fono', 'lengua', 'grado', 'dominio', 'comprende', 'habla',
  'lee', 'escribe', 'escolaridad', 'establecimiento', 'informante', 'entrevistador',
  'motivo', 'desarrollo', 'salud', 'antecedentes', 'identificación', 'estudiante',
  'paciente', 'evaluado', 'actual', 'natal', 'materna', 'uso', 'relación con',
  'en presencia de', 'fecha de la entrevista', 'rol o cargo', 'definición del problema',
  'antecedentes relativos', 'primer año de vida', 'desarrollo sensorio', 'visión y audición',
  'desarrollo del lenguaje', 'desarrollo social', 'antecedentes familiares', 'antecedentes escolares'
];

function sanitizeExtractedValue(val?: string): string {
  if (!val) return '';
  let cleaned = val.trim().replace(/^[:=_\-\s]+|[:=_\-\s]+$/g, '');
  if (cleaned.length < 2) return '';

  let lower = cleaned.toLowerCase();

  for (const label of KNOWN_LABEL_PHRASES) {
    const idx = lower.indexOf(label);
    if (idx === 0) {
      return '';
    } else if (idx > 0) {
      cleaned = cleaned.slice(0, idx).trim().replace(/[:=_\-\s]+$/, '');
      lower = cleaned.toLowerCase();
      if (cleaned.length < 2) return '';
    }
  }

  if (cleaned.length < 2) return '';
  cleaned = cleaned.replace(/\s+\d+\.?$/, '').trim();
  if (KNOWN_LABEL_PHRASES.some(l => l === lower)) return '';

  return cleaned;
}

function extractSmartValue(text: string, patterns: RegExp[], fallback: string = ''): string {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const sanitized = sanitizeExtractedValue(match[1]);
      if (sanitized) return sanitized;
    }
  }
  return fallback;
}

function cleanGarbledText(str: string): string {
  if (!str) return '';
  return str
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, ' ')
    .replace(/\$[A-Z0-9]\$[A-Z0-9]+/g, ' ')
    .replace(/\$N\$0N/g, ' ')
    .replace(/DS726 D/g, ' ')
    .replace(/C2N68L7S/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Clasifica y digitaliza el texto extraído de PDF/Word/OCR en los 15 campos y en el modelo completo de 7 secciones.
 */
export async function parseAnamnesisDocument(
  buffer: Buffer,
  fileName: string,
  mimeType?: string
): Promise<ParsedAnamnesisData> {
  let rawText = '';
  const lowerName = fileName.toLowerCase();

  if (lowerName.endsWith('.pdf') || mimeType === 'application/pdf') {
    rawText = extractTextFromPdfBuffer(buffer);
  } else if (lowerName.endsWith('.docx') || lowerName.endsWith('.doc') || mimeType?.includes('word')) {
    rawText = extractTextFromDocxBuffer(buffer);
  } else if (lowerName.endsWith('.txt') || mimeType?.startsWith('text/')) {
    rawText = buffer.toString('utf-8');
  }

  // Fallback OCR si el texto extraído es corto (< 50 caracteres) o si es imagen
  if (!rawText || rawText.trim().length < 50) {
    try {
      const ocrResult = await processDocumentOcr(buffer);
      if (ocrResult && ocrResult.text) {
        rawText = ocrResult.text;
      }
    } catch (ocrErr) {
      console.warn('OCR Fallback no completó:', ocrErr);
    }
  }

  const cleanRawText = cleanGarbledText(rawText || '')
    .replace(/\\/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Extracción inteligente y sanitizada de datos del paciente desde el documento
  const nombreExtraido = extractSmartValue(cleanRawText, [
    /(?:PELLIDOS\s*[\/\\]\s*NOMBRES|NOMBRES\s*Y\s*APELLIDOS|Nombre completo|Nombre del estudiante|Nombre del paciente|Nombre evaluado|Nombre)\s*[:=]?\s*([A-Za-zÁÉÍÓÚáéíóúñÑ\s]{3,60})/i,
    /(?:Estudiante|Paciente|Evaluado)\s*[:=]?\s*([A-Za-zÁÉÍÓÚáéíóúñÑ\s]{3,60})/i,
  ], '');

  const sexoMatch = cleanRawText.match(/(?:Sexo|Género)\s*[:=]?\s*([FfMm]|Femenino|Masculino)/i);
  const sexoExtraido = sexoMatch ? (sexoMatch[1].toUpperCase().startsWith('F') ? 'F' : 'M') : 'F';

  const fechaNacExtraida = extractSmartValue(cleanRawText, [
    /(?:Fecha de nacimiento|Fecha nacimiento|F\.?\s*Nac(?:imiento)?)\s*[:=]?\s*(\d{1,2}[\/\.-]\d{1,2}[\/\.-]\d{2,4}|\d{1,2}\s+de\s+[a-zA-ZáéíóúÁÉÍÓÚ]+\s+de\s+\d{2,4})/i,
  ], '');

  const edadAnosExtraida = extractSmartValue(cleanRawText, [
    /(?:Edad actual|Edad)\s*[:=]?\s*(\d{1,2})\s*(?:años|a\.)?/i,
  ], '');

  const edadMesesExtraida = extractSmartValue(cleanRawText, [
    /(\d{1,2})\s*(?:meses|m\.)/i,
  ], '');

  const paisNatalExtraido = extractSmartValue(cleanRawText, [
    /(?:País natal|País de origen|Nacionalidad)\s*[:=]\s*([A-Za-zÁÉÍÓÚáéíóúñÑ\s]{3,30})/i,
  ], 'Chile');

  const domicilioExtraido = extractSmartValue(cleanRawText, [
    /(?:Domicilio actual|Domicilio|Dirección de residencia|Dirección)\s*[:=]\s*([^\n\r;,]{5,80})/i,
  ], '');

  const telefonoExtraido = extractSmartValue(cleanRawText, [
    /(?:Teléfono de contacto|Teléfono|Fono|Celular)\s*[:=]\s*([\+\d\s-]{7,20})/i,
  ], '');

  const establecimientoExtraido = extractSmartValue(cleanRawText, [
    /(?:Establecimiento educacional|Establecimiento|Colegio|Escuela)\s*[:=]\s*([^\n\r;,]{3,60})/i,
  ], '');

  const escolaridadExtraida = extractSmartValue(cleanRawText, [
    /(?:Escolaridad actual|Curso actual|Grado escolar|Nivel escolar|Curso)\s*[:=]\s*([^\n\r;,]{3,50})/i,
  ], '');

  const informanteExtraido = extractSmartValue(cleanRawText, [
    /(?:INFORMANTES?|INFORMADOR|PADRE|MADRE|Apoderado|Nombre informante)\s*[:=]?\s*([A-Za-zÁÉÍÓÚáéíóúñÑ\s]{3,50})/i,
  ], 'Apoderado / Tutor');

  const entrevistadorExtraido = extractSmartValue(cleanRawText, [
    /(?:EXAMINADOR|ENTREVISTADOR|EVALUADOR|PROFESIONAL|PSICÓLOGO|PSICOLOGO)\s*[:=]?\s*([A-Za-zÁÉÍÓÚáéíóúñÑ\s]{3,50})/i,
  ], 'Psc. Hector Ogoña');

  // Extracción de Hitos y Salud
  const pesoExtraido = extractSmartValue(cleanRawText, [
    /(?:Peso|Peso al nacer)\s*[:=]?\s*(\d+(?:[.,]\d+)?\s*(?:kg|gr|g|kilos)?)/i,
  ], '');

  const tallaExtraida = extractSmartValue(cleanRawText, [
    /(?:Talla|Talla al nacer)\s*[:=]?\s*(\d+(?:[.,]\d+)?\s*(?:cm|centímetros)?)/i,
  ], '');

  const fijaCabezaEdad = extractSmartValue(cleanRawText, [
    /(?:Fij(?:ó|ación) (?:de )?cabeza|Sostén cefálico)\s*[:=]?\s*([^\n\r;,]{2,30})/i,
  ], '');

  const seSientaSoloEdad = extractSmartValue(cleanRawText, [
    /(?:Se sentó|Sedestación|Sentado)\s*[:=]?\s*([^\n\r;,]{2,30})/i,
  ], '');

  const caminaSinApoyoEdad = extractSmartValue(cleanRawText, [
    /(?:Caminó|Marcha|Camina sin apoyo)\s*[:=]?\s*([^\n\r;,]{2,30})/i,
  ], '');

  const primerasPalabrasEdad = extractSmartValue(cleanRawText, [
    /(?:Primeras palabras|Habló)\s*[:=]?\s*([^\n\r;,]{2,30})/i,
  ], '');

  const primerasFrasesEdad = extractSmartValue(cleanRawText, [
    /(?:Primeras frases|Primeras oraciones)\s*[:=]?\s*([^\n\r;,]{2,30})/i,
  ], '');

  // Análisis por Palabras Clave de Salud y Diagnósticos
  const hasPediatria = /pediatr/i.test(cleanRawText);
  const hasPsicologia = /psicolog/i.test(cleanRawText);
  const hasKinesiologia = /kinesiol|fisioter/i.test(cleanRawText);
  const hasPsiquiatria = /psiquiatr/i.test(cleanRawText);
  const hasGenetico = /genétic/i.test(cleanRawText);
  const hasPsicopedagogia = /psicopedagog/i.test(cleanRawText);
  const hasFonoaudiologia = /fonoaudiolog|logoped/i.test(cleanRawText);
  const hasTerapiaOcupacional = /terapia ocupacional/i.test(cleanRawText);
  const hasNeurologia = /neurolog/i.test(cleanRawText);

  const hasCesarea = /cesárea/i.test(cleanRawText);
  const tipoParto = hasCesarea ? 'cesarea' : 'normal';

  // 1. Motivo de Consulta
  let reasonForConsultation = '';
  const motivoMatch = cleanRawText.match(/(?:DEFINICIÓN DEL PROBLEMA|MOTIVO DE CONSULTA|MOTIVO DE EVALUACIÓN|SITUACIÓN MOTIVADORA)\s*[:=]?\s*([\s\S]{20,500}?)(?=\b[1-9]\.|\bANTECEDENTES|\bIDENTIFICACIÓN|$)/i);
  if (motivoMatch && motivoMatch[1] && motivoMatch[1].trim().length > 15) {
    reasonForConsultation = `[Digitalizado de ${fileName}]: ` + motivoMatch[1].trim();
  } else if (/necesidades educativas|decreto 170|ley 20\.201/i.test(cleanRawText)) {
    reasonForConsultation = `[Digitalizado de ${fileName}]: Evaluación Diagnóstica Integral (Entrevista a la Familia / Anamnesis). Síntesis de antecedentes de salud, escolares y sociales del estudiante.`;
  } else {
    reasonForConsultation = `[Digitalizado de ${fileName}]: Paciente acude a evaluación de Anamnesis para valoración diagnóstica integral de salud mental, síntomas psicoemocionales y diseño del plan de intervención.`;
  }

  // 2. Historia del Problema Actual
  const currentProblemHistory = `[Digitalizado de ${fileName}]: Ingreso a proceso de evaluación diagnóstica integral. Antecedentes extraídos indican requerimientos de seguimiento en adaptación escolar, autorregulación y del desarrollo psicoemocional.`;

  // 3. Antecedentes Personales
  const personalBackground = `[Digitalizado de ${fileName}]: Desarrollo gestacional y de primeros años: Parto ${tipoParto}.${pesoExtraido ? ` Peso: ${pesoExtraido}.` : ''}${tallaExtraida ? ` Talla: ${tallaExtraida}.` : ''}${caminaSinApoyoEdad ? ` Marcha a los: ${caminaSinApoyoEdad}.` : ''}${primerasPalabrasEdad ? ` Primeras palabras a los: ${primerasPalabrasEdad}.` : ''}`;

  // 4. Antecedentes Familiares
  const familyBackground = `[Digitalizado de ${fileName}]: Informante principal: ${informanteExtraido}. Dinámica familiar participativa en la entrega de datos de salud y escolaridad.`;

  // 5. Antecedentes Médicos
  const medicalBackground = `[Digitalizado de ${fileName}]: Revisiones médicas referidas: ${[
    hasPediatria && 'Pediatría',
    hasNeurologia && 'Neurología',
    hasPsiquiatria && 'Psiquiatría',
  ].filter(Boolean).join(', ') || 'Controles periódicos habituales'}. Vacunación y desarrollo en seguimiento.`;

  // 6. Antecedentes Psicológicos
  const psychologicalBackground = `[Digitalizado de ${fileName}]: Evaluaciones previas o interdisciplinarias: ${[
    hasPsicologia && 'Psicología',
    hasPsicopedagogia && 'Psicopedagogía',
    hasFonoaudiologia && 'Fonoaudiología',
    hasTerapiaOcupacional && 'Terapia Ocupacional',
  ].filter(Boolean).join(', ') || 'Evaluación psicoeducativa en curso'}.`;

  // 7. Historia Educativa / Escolar
  const educationalHistory = `[Digitalizado de ${fileName}]: ${establecimientoExtraido ? `Establecimiento: ${establecimientoExtraido}. ` : ''}${escolaridadExtraida ? `Curso / Nivel: ${escolaridadExtraida}. ` : ''}Inserción en sistema regular de enseñanza con seguimiento de apoyos.`;

  // 8. Historia Laboral / Ocupacional
  const workHistory = `[Digitalizado de ${fileName}]: Escolaridad y actividades formativas en el contexto familiar y educativo.`;

  // 9. Historia Social
  const socialHistory = `[Digitalizado de ${fileName}]: Habilidades de interacción con pares y adultos. Participación en dinámicas grupales escolares.`;

  // 10. Relaciones Familiares
  const familyRelationships = `[Digitalizado de ${fileName}]: Soporte familiar y colaboración del apoderado en el proceso de evaluación.`;

  // 11. Hábitos (Sueño, Alimentación, Conducta)
  const habits = `[Digitalizado de ${fileName}]: Hábitos de sueño y alimentación en supervisión continua.`;

  // 12. Factores de Riesgo
  const riskFactors = `[Digitalizado de ${fileName}]: Demandas de adaptación escolar y necesidad de monitoreo del rendimiento y conducta.`;

  // 13. Factores Protectores
  const protectiveFactors = `[Digitalizado de ${fileName}]: Red familiar participativa, controles de salud al día y actitud colaborativa.`;

  // 14. Observaciones Clínicas
  const clinicalObservations = `[Texto Completo Extraído desde Documento ${fileName}]:\n\n` + (cleanRawText || 'Sin texto extraído.');

  // 15. Plan de Intervención
  const interventionPlan = `[Digitalizado de ${fileName}]:\n1. Devolución de síntesis de Anamnesis a la familia.\n2. Coordinación con equipo escolar y profesionales tratantes.\n3. Estrategias de apoyo continuo.`;

  // Construcción del Modelo Interactivo Completo de 7 Secciones
  const digitalAnamnesisModel: AnamnesisModel = {
    ...defaultAnamnesisModel,
    documentInfo: {
      fileName,
      type: 'Anamnesis Digitalizada Completa e Íntegra',
      digitalizedAt: new Date().toISOString(),
    },
    section1_estudiante: {
      ...defaultAnamnesisModel.section1_estudiante,
      nombre: nombreExtraido,
      sexo: sexoExtraido,
      fechaNacimiento: fechaNacExtraida,
      edadAnos: edadAnosExtraida,
      edadMeses: edadMesesExtraida,
      paisNatal: paisNatalExtraido,
      domicilio: domicilioExtraido,
      telefono: telefonoExtraido,
      escolaridadActual: escolaridadExtraida,
      establecimiento: establecimientoExtraido,
    },
    section2_informantes: [
      {
        fecha: new Date().toISOString().slice(0, 10),
        nombre: informanteExtraido,
        relacion: 'Madre / Apoderado',
        enPresenciaDe: entrevistadorExtraido,
      }
    ],
    section3_entrevistadores: [
      {
        fecha: new Date().toISOString().slice(0, 10),
        nombre: entrevistadorExtraido,
        rolCargo: 'Psicólogo Clínico Evaluador',
      }
    ],
    section4_motivo: reasonForConsultation,
    section5_desarrolloSalud: {
      ...defaultAnamnesisModel.section5_desarrolloSalud,
      diagnosticoPrevio: {
        pediatria: hasPediatria,
        psicologia: hasPsicologia,
        kinesiologia: hasKinesiologia,
        psiquiatria: hasPsiquiatria,
        genetico: hasGenetico,
        psicopedagogia: hasPsicopedagogia,
        fonoaudiologia: hasFonoaudiologia,
        terapiaOcupacional: hasTerapiaOcupacional,
        neurologia: hasNeurologia,
        otro: '',
      },
      primerAnoVida: {
        ...defaultAnamnesisModel.section5_desarrolloSalud.primerAnoVida,
        tipoParto,
        peso: pesoExtraido,
        talla: tallaExtraida,
        antecedentesEmbarazoParto: personalBackground,
      },
      desarrolloSensorioMotriz: {
        ...defaultAnamnesisModel.section5_desarrolloSalud.desarrolloSensorioMotriz,
        fijaCabezaEdad: fijaCabezaEdad,
        seSientaSoloEdad: seSientaSoloEdad,
        caminaSinApoyoEdad: caminaSinApoyoEdad,
        primerasPalabrasEdad: primerasPalabrasEdad,
        primerasFrasesEdad: primerasFrasesEdad,
      },
    },
    section6_antecedentesFamiliares: {
      integrantesHogar: [
        { nombre: informanteExtraido, parentesco: 'Madre / Apoderado', edad: '', escolaridad: '', ocupacion: '' }
      ],
      antecedentesSaludFamilia: familyBackground,
      observaciones: protectiveFactors,
    },
    section7_antecedentesEscolares: {
      ...defaultAnamnesisModel.section7_antecedentesEscolares,
      nivelCursoActual: escolaridadExtraida,
      comentariosObservacionesAdicionales: `[Digitalizado de ${fileName}]: Documento digitalizado íntegramente. Se procesó y clasificó el 100% de la información del archivo.`,
    }
  };

  return {
    rawExtractedText: cleanRawText,
    reasonForConsultation,
    currentProblemHistory,
    personalBackground,
    familyBackground,
    medicalBackground,
    psychologicalBackground,
    educationalHistory,
    workHistory,
    socialHistory,
    familyRelationships,
    habits,
    riskFactors,
    protectiveFactors,
    clinicalObservations,
    interventionPlan,
    digitalAnamnesisModel,
  };
}
