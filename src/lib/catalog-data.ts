/**
 * Nombre del archivo: src/lib/catalog-data.ts
 * Descripción: Catálogo precargado de códigos diagnósticos autorizados CIE-11 (OMS 2026) y DSM-5-TR con utilidades de búsqueda semántica.
 * Fecha de última modificación: 2026-09-30
 * Autor: Psicolobos Development Team
 */

export interface ClinicalDiagnosisItem {
  code: string;
  name: string;
  system: 'CIE_11' | 'DSM_5_TR';
  category: string;
  description: string;
  whoUrl?: string;
}

export const DIAGNOSTIC_CATALOG: ClinicalDiagnosisItem[] = [
  // ==========================================
  // CIE-11 (OMS - Clasificación Internacional de Enfermedades, 11.ª revisión MMS)
  // https://icd.who.int/browse/2026-01/mms/es#491063206
  // ==========================================

  // Trastornos del neurodesarrollo
  {
    code: '6A02.0',
    name: 'Trastorno del espectro del autismo sin trastorno del desarrollo intelectual y con deficiencia del lenguaje funcional leve o nula',
    system: 'CIE_11',
    category: 'Trastornos del neurodesarrollo',
    description: 'Caracterizado por dificultades persistentes en la iniciación y mantenimiento de la interacción social comunicativa, así como patrones de comportamiento, intereses o actividades restringidos, repetitivos e inflexibles.',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#491063206',
  },
  {
    code: '6A05.0',
    name: 'Trastorno por déficit de atención e hiperactividad, presentación predominantemente inatenta',
    system: 'CIE_11',
    category: 'Trastornos del neurodesarrollo',
    description: 'Patrón persistente de inatención que interfiere con el funcionamiento o el desarrollo, caracterizado por no prestar atención cercana a los detalles, cometer errores por descuido y dificultad para mantener la concentración.',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#491063206',
  },
  {
    code: '6A05.1',
    name: 'Trastorno por déficit de atención e hiperactividad, presentación predominantemente hiperactivo-impulsiva',
    system: 'CIE_11',
    category: 'Trastornos del neurodesarrollo',
    description: 'Patrón caracterizado por excesiva actividad motora, inquietud motriz física e incapacidad para mantenerse sentado o esperar el turno.',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#491063206',
  },
  {
    code: '6A05.2',
    name: 'Trastorno por déficit de atención e hiperactividad, presentación combinada',
    system: 'CIE_11',
    category: 'Trastornos del neurodesarrollo',
    description: 'Presencia simultánea de síntomas clínicamente significativos tanto de inatención como de hiperactividad-impulsividad.',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#491063206',
  },

  // Trastornos de ansiedad o relacionados con el miedo
  {
    code: '6B00',
    name: 'Trastorno de ansiedad generalizada',
    system: 'CIE_11',
    category: 'Trastornos de ansiedad o relacionados con el miedo',
    description: 'Ansiedad y preocupación excesivas, persistentes y difíciles de controlar sobre múltiples eventos o actividades cotidianas, acompañadas de tensión muscular, fatiga e inquietud.',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#491063206',
  },
  {
    code: '6B01',
    name: 'Trastorno de pánico',
    system: 'CIE_11',
    category: 'Trastornos de ansiedad o relacionados con el miedo',
    description: 'Ataques de pánico recurrentes e inesperados no restringidos a situaciones particulares, seguidos de aprensión persistente ante nuevos ataques y conductas desadaptativas de evitación.',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#491063206',
  },
  {
    code: '6B02',
    name: 'Agorafobia',
    system: 'CIE_11',
    category: 'Trastornos de ansiedad o relacionados con el miedo',
    description: 'Temor o ansiedad marcadamente excesivos en situaciones donde escapar podría ser difícil o la ayuda podría no estar disponible (transporte público, multitudes, espacios abiertos).',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#491063206',
  },
  {
    code: '6B03',
    name: 'Trastorno de ansiedad social',
    system: 'CIE_11',
    category: 'Trastornos de ansiedad o relacionados con el miedo',
    description: 'Temor o ansiedad notables e intensos que ocurren consistentemente en una o más situaciones sociales en las que la persona puede ser evaluada o examinada por otros.',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#491063206',
  },
  {
    code: '6B04',
    name: 'Fobia específica',
    system: 'CIE_11',
    category: 'Trastornos de ansiedad o relacionados con el miedo',
    description: 'Ansiedad o temor excesivo desencadenado por la presencia o anticipación de un objeto o situación específicos (animales, alturas, inyecciones, sangre).',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#491063206',
  },
  {
    code: '6B05',
    name: 'Trastorno de ansiedad por separación',
    system: 'CIE_11',
    category: 'Trastornos de ansiedad o relacionados con el miedo',
    description: 'Temor o ansiedad excesivos e inapropiados para el nivel de desarrollo concerniente a la separación de las figuras de apego.',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#491063206',
  },

  // Trastornos del estado de ánimo
  {
    code: '6A70.0',
    name: 'Trastorno depresivo de episodio único, leve',
    system: 'CIE_11',
    category: 'Trastornos del estado de ánimo',
    description: 'Episodio caracterizado por un estado de ánimo deprimido casi todos los días o anhedonia, acompañado de otros síntomas afectivos, cognitivos y neurovegetativos de intensidad leve.',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#491063206',
  },
  {
    code: '6A70.1',
    name: 'Trastorno depresivo de episodio único, moderado',
    system: 'CIE_11',
    category: 'Trastornos del estado de ánimo',
    description: 'Episodio caracterizado por presencia marcada de estado de ánimo deprimido y pérdida de interés en actividades habituales durante al menos 2 semanas con interferencia significativa.',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#491063206',
  },
  {
    code: '6A70.2',
    name: 'Trastorno depresivo de episodio único, grave sin síntomas psicóticos',
    system: 'CIE_11',
    category: 'Trastornos del estado de ánimo',
    description: 'Episodio depresivo de intensidad grave que incapacita casi totalmente el funcionamiento personal, laboral o social.',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#491063206',
  },
  {
    code: '6A71',
    name: 'Trastorno depresivo recurrente',
    system: 'CIE_11',
    category: 'Trastornos del estado de ánimo',
    description: 'Historia de múltiples episodios depresivos previos sin antecedentes de episodios maníacos o hipomaníacos independientes.',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#491063206',
  },
  {
    code: '6A72',
    name: 'Trastorno distímico',
    system: 'CIE_11',
    category: 'Trastornos del estado de ánimo',
    description: 'Estado de ánimo persistentemente deprimido durante la mayor parte del día durante al menos 2 años sin remisiones prolongadas.',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#491063206',
  },
  {
    code: '6A60',
    name: 'Trastorno bipolar tipo I',
    system: 'CIE_11',
    category: 'Trastornos del estado de ánimo',
    description: 'Trastorno del estado de ánimo caracterizado por la presencia de al menos un episodio maníaco o mixto.',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#491063206',
  },

  // Trastornos obsesivo-compulsivos o relacionados
  {
    code: '6B20',
    name: 'Trastorno obsesivo-compulsivo',
    system: 'CIE_11',
    category: 'Trastorno obsesivo-compulsivo o trastornos relacionados',
    description: 'Presencia de obsesiones persistentes (pensamientos, impulsos o imágenes intrusivas) y/o compulsiones (comportamientos repetitivos o actos mentales).',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#491063206',
  },
  {
    code: '6B21',
    name: 'Trastorno dismórfico corporal',
    system: 'CIE_11',
    category: 'Trastorno obsesivo-compulsivo o trastornos relacionados',
    description: 'Preocupación persistente por uno o más defectos o imperfecciones percibidos en la apariencia física que no son observables o parecen leves a los demás.',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#491063206',
  },
  {
    code: '6B22',
    name: 'Hipocondría / Ansiedad por la salud',
    system: 'CIE_11',
    category: 'Trastorno obsesivo-compulsivo o trastornos relacionados',
    description: 'Preocupación o temor persistente de padecer una o más enfermedades graves y progresivas que amenacen la vida.',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#491063206',
  },

  // Trastornos específicamente asociados con el estrés
  {
    code: '6B40',
    name: 'Trastorno de estrés postraumático (TEPT)',
    system: 'CIE_11',
    category: 'Trastornos específicamente asociados con el estrés',
    description: 'Desarrollado tras la exposición a un evento extremadamente amenazante o horrendo, caracterizado por reexperimentación, evitación de recordatorios e hipervigilancia.',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#491063206',
  },
  {
    code: '6B41',
    name: 'Trastorno de estrés postraumático complejo',
    system: 'CIE_11',
    category: 'Trastornos específicamente asociados con el estrés',
    description: 'Surge tras la exposición a traumas prolongados o repetidos. Incluye síntomas de TEPT más alteraciones graves en la regulación del afecto y la autoimagen.',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#491063206',
  },
  {
    code: '6B42',
    name: 'Trastorno de adaptación',
    system: 'CIE_11',
    category: 'Trastornos específicamente asociados con el estrés',
    description: 'Reacción desadaptativa a un estresor psicosocial identificable (divorcio, problemas económicos, enfermedad) que surge dentro del mes posterior al evento.',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#491063206',
  },

  // Trastornos de la conducta alimentaria
  {
    code: '6B80',
    name: 'Anorexia nerviosa',
    system: 'CIE_11',
    category: 'Trastornos de la conducta alimentaria',
    description: 'Restricción del consumo energético en relación con las necesidades, conduciendo a un peso corporal significativamente bajo para la edad y talla.',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#491063206',
  },
  {
    code: '6B81',
    name: 'Bulimia nerviosa',
    system: 'CIE_11',
    category: 'Trastornos de la conducta alimentaria',
    description: 'Episodios recurrentes de atracones acompañados de conductas compensatorias inapropiadas recurrentes para evitar el aumento de peso.',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#491063206',
  },

  // Trastornos de la personalidad
  {
    code: '6D10',
    name: 'Trastorno de la personalidad límite',
    system: 'CIE_11',
    category: 'Trastornos de la personalidad y rasgos relacionados',
    description: 'Patrón dominante de inestabilidad en las relaciones interpersonales, la autoimagen y los afectos, así como una marcada impulsividad.',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#491063206',
  },
  {
    code: '6D10.0',
    name: 'Trastorno de la personalidad antisocial',
    system: 'CIE_11',
    category: 'Trastornos de la personalidad y rasgos relacionados',
    description: 'Patrón de desprecio y violación de los derechos de los demás, con falta de empatía, comportamiento irresponsable y transgresión de normas sociales.',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#491063206',
  },
  {
    code: '6D10.1',
    name: 'Trastorno de la personalidad narcisista',
    system: 'CIE_11',
    category: 'Trastornos de la personalidad y rasgos relacionados',
    description: 'Patrón dominante de grandeza (en la fantasía o en el comportamiento), necesidad de admiración y falta de empatía.',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#491063206',
  },

  // Trastornos por consumo de sustancias y comportamientos adictivos
  {
    code: '6C40',
    name: 'Trastornos debidos al consumo de alcohol',
    system: 'CIE_11',
    category: 'Trastornos debidos al consumo de sustancias',
    description: 'Condiciones relacionadas con el uso nocivo o dependencia del alcohol, que causan deterioro significativo en la salud o el funcionamiento social.',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#491063206',
  },
  {
    code: '6C41',
    name: 'Trastornos debidos al consumo de cannabis',
    system: 'CIE_11',
    category: 'Trastornos debidos al consumo de sustancias',
    description: 'Uso nocivo o dependencia del cannabis, asociado con deterioro cognitivo, motivacional y social.',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#491063206',
  },
  {
    code: '6C50',
    name: 'Trastorno por juego de videojuegos',
    system: 'CIE_11',
    category: 'Trastornos debidos a comportamientos adictivos',
    description: 'Patrón de comportamiento de juego continuo o recurrente ("digital gaming" o "video gaming"), caracterizado por un control deteriorado sobre el juego.',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#491063206',
  },

  // Esquizofrenia y otros trastornos psicóticos primarios
  {
    code: '6A20',
    name: 'Esquizofrenia',
    system: 'CIE_11',
    category: 'Esquizofrenia y otros trastornos psicóticos primarios',
    description: 'Trastorno caracterizado por distorsiones fundamentales del pensamiento, la percepción y el afecto (delirios, alucinaciones, discurso desorganizado) que dura al menos un mes.',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#491063206',
  },
  {
    code: '6A21',
    name: 'Trastorno esquizoafectivo',
    system: 'CIE_11',
    category: 'Esquizofrenia y otros trastornos psicóticos primarios',
    description: 'Afección en la que coexisten síntomas característicos de la esquizofrenia y de un episodio afectivo (maníaco o depresivo) significativo.',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#491063206',
  },

  // Trastornos del sueño-vigilia
  {
    code: '7A00',
    name: 'Trastorno de insomnio crónico',
    system: 'CIE_11',
    category: 'Trastornos del sueño-vigilia',
    description: 'Dificultad persistente para iniciar o mantener el sueño, o despertar temprano por la mañana, que ocurre a pesar de oportunidades adecuadas para dormir y causa deterioro diurno.',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#491063206',
  },

  // Trastornos neurocognitivos
  {
    code: '6D70',
    name: 'Demencia debida a la enfermedad de Alzheimer',
    system: 'CIE_11',
    category: 'Trastornos neurocognitivos',
    description: 'Deterioro neurocognitivo mayor progresivo caracterizado por pérdida de memoria y otras habilidades cognitivas que interfieren con la vida diaria.',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#491063206',
  },

  // Disfunciones sexuales
  {
    code: 'HA00',
    name: 'Trastorno de deseo sexual hipoactivo',
    system: 'CIE_11',
    category: 'Disfunciones sexuales',
    description: 'Ausencia o reducción significativa de pensamientos, fantasías o deseo de actividad sexual, causando malestar marcado.',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#491063206',
  },

  // ==========================================
  // DSM-5-TR (APA)
  // ==========================================
  {
    code: '300.4',
    name: 'Trastorno depresivo persistente (Distimia)',
    system: 'DSM_5_TR',
    category: 'Trastornos depresivos',
    description: 'Estado de ánimo deprimido durante la mayor parte del día, presente la mayoría de los días durante al menos dos años en adultos.',
  },
  {
    code: '300.02',
    name: 'Trastorno de ansiedad generalizada (TAG)',
    system: 'DSM_5_TR',
    category: 'Trastornos de ansiedad',
    description: 'Ansiedad y preocupación excessive sobre una serie de acontecimientos o actividades que se prolongan durante más de 6 meses.',
  },
  {
    code: '300.23',
    name: 'Trastorno de ansiedad social (Fobia social)',
    system: 'DSM_5_TR',
    category: 'Trastornos de ansiedad',
    description: 'Miedo o ansiedad intensa en una o más situaciones sociales en las que el individuo está expuesto al posible examen por parte de otras personas.',
  },
  {
    code: '309.81',
    name: 'Trastorno de estrés postraumático',
    system: 'DSM_5_TR',
    category: 'Trastornos relacionados con traumas y factores de estrés',
    description: 'Exposición a la muerte, lesión grave o violencia sexual, real o amenaza, con presencia de síntomas intrusivos y evitación.',
  },
  {
    code: '301.83',
    name: 'Trastorno de la personalidad límite',
    system: 'DSM_5_TR',
    category: 'Trastornos de la personalidad',
    description: 'Patrón dominante de inestabilidad de las relaciones interpersonales, de la autoimagen y de los afectos, e impulsividad intensa.',
  }
];

export function searchDiagnosticCatalog(query: string, system?: 'CIE_11' | 'DSM_5_TR'): ClinicalDiagnosisItem[] {
  const cleanQuery = query.toLowerCase().trim();
  return DIAGNOSTIC_CATALOG.filter((item) => {
    if (system && item.system !== system) return false;
    if (!cleanQuery) return true;
    return (
      item.code.toLowerCase().includes(cleanQuery) ||
      item.name.toLowerCase().includes(cleanQuery) ||
      item.category.toLowerCase().includes(cleanQuery) ||
      item.description.toLowerCase().includes(cleanQuery)
    );
  });
}
