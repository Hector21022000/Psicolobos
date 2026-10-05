/**
 * Nombre del archivo: src/lib/cie11-full-catalog.ts
 * Descripción: Catálogo estructurado jerárquico completo CIE-11 (OMS 2026 MMS) con capítulos, bloques y entidades
 *              clínicas para el Navegador Oficial CIE-11 integrado en Psicolobos.
 * Fecha de última modificación: 2026-09-30
 * Autor: Psicolobos Development Team
 */

export interface Cie11Entity {
  id: string;
  code: string;
  title: string;
  description: string;
  parent?: string;
  children?: string[];
  whoUrl?: string;
  isChapter?: boolean;
  isBlock?: boolean;
  browserUrl?: string;
}

/**
 * Estructura jerárquica completa de capítulos CIE-11 MMS (OMS 2026)
 * Fuente: https://icd.who.int/browse/2026-01/mms/es
 */
export const CIE11_CHAPTERS: Cie11Entity[] = [
  {
    id: 'ch01',
    code: '01',
    title: 'Algunas enfermedades infecciosas o parasitarias',
    description: 'Este capítulo incluye las enfermedades generalmente reconocidas como transmisibles o transmitidas. Se incluyen condiciones causadas por organismos infecciosos o parásitos.',
    isChapter: true,
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#1435254666',
    children: ['1A00-1A0Z', '1A20-1A2Z', '1A40-1A4Z', '1A50-1A5Z', '1A60-1A6Z', '1A70-1A7Z', '1B00-1B7Z', '1C00-1C4Z', '1D00-1D0Z', '1E00-1E2Z', '1F00-1F0Z', '1G00-1G0Z', '1H00-1H0Z'],
  },
  {
    id: 'ch02',
    code: '02',
    title: 'Neoplasias',
    description: 'Incluye neoplasias benignas, malignas, in situ e inciertas. Se clasifican según localización anatómica y comportamiento biológico.',
    isChapter: true,
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#1630407678',
    children: ['2A00-2A0Z', '2B00-2B6Z', '2C00-2C0Z', '2D00-2D2Z', '2E00-2E0Z', '2F00-2F0Z'],
  },
  {
    id: 'ch03',
    code: '03',
    title: 'Enfermedades de la sangre o de los órganos hematopoyéticos',
    description: 'Enfermedades que afectan a la sangre, los órganos hematopoyéticos y ciertos trastornos del mecanismo de la inmunidad.',
    isChapter: true,
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#1473747874',
    children: ['3A00-3A7Z', '3B00-3B6Z', '3C00-3C0Z'],
  },
  {
    id: 'ch04',
    code: '04',
    title: 'Enfermedades del sistema inmunitario',
    description: 'Trastornos del sistema inmunitario, incluyendo inmunodeficiencias, enfermedades autoinmunitarias y reacciones alérgicas.',
    isChapter: true,
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#1256772020',
    children: ['4A00-4A0Z', '4A20-4A4Z', '4A60-4A7Z', '4B00-4B4Z'],
  },
  {
    id: 'ch05',
    code: '05',
    title: 'Enfermedades endocrinas, nutricionales o metabólicas',
    description: 'Enfermedades de las glándulas endocrinas, trastornos de la nutrición y del metabolismo, incluyendo diabetes mellitus.',
    isChapter: true,
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#577470983',
    children: ['5A00-5A4Z', '5B00-5B8Z', '5C00-5C8Z', '5D00-5D4Z'],
  },
  {
    id: 'ch06',
    code: '06',
    title: 'Trastornos mentales, del comportamiento y del neurodesarrollo',
    description: 'Incluye los trastornos mentales y del comportamiento en su totalidad: trastornos del neurodesarrollo, esquizofrenia, trastornos del estado de ánimo, trastornos de ansiedad, trastornos obsesivo-compulsivos, trastornos asociados al estrés, trastornos disociativos, trastornos de la conducta alimentaria, trastornos del sueño-vigilia, disfunciones sexuales, trastornos de la personalidad, trastornos parafílicos, trastornos facticios, trastornos del control de impulsos y trastornos debidos al uso de sustancias.',
    isChapter: true,
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#344733281',
    children: [
      'bloque-neurodesarrollo', 'bloque-esquizofrenia', 'bloque-animo',
      'bloque-ansiedad', 'bloque-ocd', 'bloque-estres',
      'bloque-disociativos', 'bloque-alimentaria', 'bloque-personalidad',
      'bloque-adicciones', 'bloque-sueno', 'bloque-sexual',
    ],
  },
  {
    id: 'ch07',
    code: '07',
    title: 'Trastornos del sueño y la vigilia',
    description: 'Incluye insomnio, hipersomnia, trastornos del ritmo circadiano, trastornos respiratorios del sueño, parasomnias y trastornos del movimiento relacionados con el sueño.',
    isChapter: true,
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#1296093776',
    children: ['7A00-7A4Z', '7B00-7B2Z'],
  },
  {
    id: 'ch08',
    code: '08',
    title: 'Enfermedades del sistema nervioso',
    description: 'Enfermedades del sistema nervioso central y periférico, incluyendo enfermedad de Alzheimer, enfermedad de Parkinson, epilepsia, esclerosis múltiple y cefaleas.',
    isChapter: true,
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#1435254666',
    children: ['8A00-8A4Z', '8B00-8B2Z', '8C00-8D0Z'],
  },
  {
    id: 'ch09',
    code: '09',
    title: 'Enfermedades del sistema visual',
    description: 'Trastornos y enfermedades del ojo y sus anexos, incluyendo defectos refractivos, glaucoma, cataratas y enfermedades de la retina.',
    isChapter: true,
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#1448597234',
    children: ['9A00-9A4Z', '9B00-9B6Z'],
  },
  {
    id: 'ch10',
    code: '10',
    title: 'Enfermedades del oído o de la apófisis mastoides',
    description: 'Enfermedades del oído externo, medio e interno, incluyendo hipoacusia, otitis y vértigo de origen ótico.',
    isChapter: true,
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#1301318601',
    children: ['AA00-AA4Z', 'AB00-AB2Z'],
  },
  {
    id: 'ch11',
    code: '11',
    title: 'Enfermedades del sistema circulatorio',
    description: 'Enfermedades del corazón y sistema vascular, incluyendo hipertensión, cardiopatías isquémicas, insuficiencia cardíaca y enfermedades cerebrovasculares.',
    isChapter: true,
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#426429380',
    children: ['BA00-BA9Z', 'BB00-BB4Z', 'BC00-BC0Z', 'BD00-BD1Z', 'BE00-BE2Z'],
  },
  {
    id: 'ch12',
    code: '12',
    title: 'Enfermedades del sistema respiratorio',
    description: 'Infecciones agudas de las vías respiratorias, influenza, neumonía, enfermedades crónicas de las vías respiratorias inferiores (EPOC, asma).',
    isChapter: true,
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#1260115592',
    children: ['CA00-CA4Z', 'CB00-CB4Z'],
  },
  {
    id: 'ch13',
    code: '13',
    title: 'Enfermedades del sistema digestivo',
    description: 'Enfermedades de la cavidad oral, esófago, estómago, intestino, hígado, vesícula biliar y páncreas.',
    isChapter: true,
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#1334770043',
    children: ['DA00-DA9Z', 'DB00-DB9Z', 'DC00-DC0Z', 'DD00-DD9Z', 'DE00-DE2Z'],
  },
  {
    id: 'ch14',
    code: '14',
    title: 'Enfermedades de la piel',
    description: 'Infecciones de la piel, dermatitis, eczema, psoriasis, urticaria y trastornos de los anejos cutáneos.',
    isChapter: true,
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#1710216978',
    children: ['EA00-EA9Z', 'EB00-EB0Z'],
  },
  {
    id: 'ch15',
    code: '15',
    title: 'Enfermedades del sistema musculo esquelético o del tejido conjuntivo',
    description: 'Artropatías, dorsopatías, trastornos de los tejidos blandos, osteopatías y condropatías.',
    isChapter: true,
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#1032aboref',
    children: ['FA00-FA9Z', 'FB00-FB4Z', 'FC00-FC0Z'],
  },
  {
    id: 'ch16',
    code: '16',
    title: 'Enfermedades del sistema genitourinario',
    description: 'Enfermedades glomerulares, tubulointersticiales, urolitiasis, enfermedades de los órganos genitales masculinos y femeninos.',
    isChapter: true,
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#1680089498',
    children: ['GA00-GA9Z', 'GB00-GB4Z', 'GC00-GC0Z'],
  },
  {
    id: 'ch17',
    code: '17',
    title: 'Condiciones relacionadas con la salud sexual',
    description: 'Incluye trastornos de la función sexual, incongruencia de género y condiciones relacionadas con la salud sexual.',
    isChapter: true,
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#577470983',
    children: ['HA00-HA4Z', 'HB00-HB0Z'],
  },
  {
    id: 'ch18',
    code: '18',
    title: 'Embarazo, parto o puerperio',
    description: 'Complicaciones del embarazo, parto y puerperio.',
    isChapter: true,
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#1401395169',
    children: ['JA00-JA9Z', 'JB00-JB4Z'],
  },
  {
    id: 'ch19',
    code: '19',
    title: 'Ciertas afecciones originadas en el período perinatal',
    description: 'Trastornos que se originan en el período perinatal, incluyendo complicaciones respiratorias y cardiovasculares del recién nacido.',
    isChapter: true,
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#1513704966',
    children: ['KA00-KA9Z', 'KB00-KB4Z'],
  },
  {
    id: 'ch20',
    code: '20',
    title: 'Anomalías del desarrollo',
    description: 'Malformaciones congénitas, deformidades y anomalías cromosómicas.',
    isChapter: true,
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#1376029740',
    children: ['LA00-LA9Z', 'LB00-LB4Z'],
  },
  {
    id: 'ch21',
    code: '21',
    title: 'Síntomas, signos o hallazgos clínicos no clasificados en otra parte',
    description: 'Síntomas, signos y hallazgos anormales de procedimientos clínicos o de laboratorio no clasificados en otros capítulos.',
    isChapter: true,
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#1640894358',
    children: ['MA00-MA9Z', 'MB00-MB4Z', 'MC00-MC0Z', 'MD00-MD0Z', 'ME00-ME0Z', 'MF00-MF0Z', 'MG00-MG0Z'],
  },
  {
    id: 'ch22',
    code: '22',
    title: 'Lesiones, envenenamientos u otras consecuencias de causas externas',
    description: 'Lesiones, quemaduras, congelaciones, envenenamientos, efectos adversos de medicamentos y complicaciones de la atención médica.',
    isChapter: true,
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#1062919405',
    children: ['NA00-NA9Z', 'NB00-NB4Z', 'NC00-NC0Z', 'ND00-ND0Z', 'NE00-NE0Z', 'NF00-NF0Z'],
  },
  {
    id: 'ch23',
    code: '23',
    title: 'Causas externas de morbilidad o mortalidad',
    description: 'Clasificación de eventos ambientales, circunstancias y condiciones externas como causa de lesiones y otras condiciones.',
    isChapter: true,
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#1062919405',
    children: ['PA00-PA9Z', 'PB00-PB4Z', 'PC00-PC0Z', 'PD00-PD0Z', 'PE00-PE0Z', 'PF00-PF0Z'],
  },
  {
    id: 'ch24',
    code: '24',
    title: 'Factores que influyen en el estado de salud o en el contacto con los servicios de salud',
    description: 'Factores que influyen en el estado de salud y contactos con los servicios de salud, no clasificados como diagnósticos.',
    isChapter: true,
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#1062919405',
    children: ['QA00-QA9Z', 'QB00-QB4Z', 'QC00-QC0Z', 'QD00-QD0Z', 'QE00-QE0Z'],
  },
  {
    id: 'ch25',
    code: '25',
    title: 'Códigos para propósitos especiales',
    description: 'Incluye códigos para propósitos especiales como la resistencia a medicamentos antimicrobianos y la enfermedad por COVID-19.',
    isChapter: true,
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#1062919405',
    children: ['RA00-RA0Z'],
  },
  {
    id: 'chV',
    code: 'V',
    title: 'Capítulo suplementario: Medicina Tradicional',
    description: 'Módulo suplementario para condiciones de Medicina Tradicional.',
    isChapter: true,
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#1062919405',
    children: [],
  },
  {
    id: 'chX',
    code: 'X',
    title: 'Códigos de extensión',
    description: 'Códigos de extensión que no deben utilizarse como diagnóstico principal.',
    isChapter: true,
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#1062919405',
    children: [],
  },
];

/**
 * Bloques detallados del Capítulo 06 (Trastornos mentales) con sus entidades diagnósticas completas
 */
export const CIE11_CHAPTER06_BLOCKS: Cie11Entity[] = [
  // === BLOQUE: Trastornos del neurodesarrollo ===
  {
    id: 'bloque-neurodesarrollo',
    code: '6A00-6A0Z',
    title: 'Trastornos del neurodesarrollo',
    description: 'Los trastornos del neurodesarrollo son un grupo de condiciones con inicio durante el período de desarrollo que producen deficiencias del funcionamiento personal, social, académico u ocupacional.',
    isBlock: true,
    parent: 'ch06',
    children: ['6A00', '6A01', '6A02.0', '6A03', '6A04', '6A05.0', '6A05.1', '6A05.2'],
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#1257889861',
  },
  {
    id: '6A00',
    code: '6A00',
    title: 'Trastornos del desarrollo intelectual',
    description: 'Grupo de condiciones etiológicamente diversas que se originan durante el período de desarrollo, caracterizado por un funcionamiento intelectual y un comportamiento adaptativo significativamente por debajo del promedio.',
    parent: 'bloque-neurodesarrollo',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#687553013',
  },
  {
    id: '6A01',
    code: '6A01',
    title: 'Trastornos del desarrollo del habla o del lenguaje',
    description: 'Trastornos que implican dificultades en la adquisición y el uso del habla y del lenguaje, no atribuibles a deterioro auditivo ni a trastornos neurológicos.',
    parent: 'bloque-neurodesarrollo',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#1439737935',
  },
  {
    id: '6A02.0',
    code: '6A02.0',
    title: 'Trastorno del espectro del autismo sin trastorno del desarrollo intelectual y con deficiencia del lenguaje funcional leve o nula',
    description: 'Caracterizado por dificultades persistentes en la iniciación y mantenimiento de la interacción social comunicativa, así como patrones de comportamiento, intereses o actividades restringidos, repetitivos e inflexibles.',
    parent: 'bloque-neurodesarrollo',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#491063206',
  },
  {
    id: '6A03',
    code: '6A03',
    title: 'Trastorno del aprendizaje',
    description: 'Dificultades significativas y persistentes en el aprendizaje de aptitudes académicas como lectura, escritura o aritmética, no explicadas por la edad, déficit intelectual, visual, auditivo o neurológico.',
    parent: 'bloque-neurodesarrollo',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#1134603158',
  },
  {
    id: '6A04',
    code: '6A04',
    title: 'Trastorno del desarrollo de la coordinación motora',
    description: 'Caracterizado por un retraso significativo en la adquisición o una ejecución marcadamente deteriorada de las habilidades motoras coordinadas, no atribuible a un trastorno del desarrollo intelectual ni a otra afección neurológica.',
    parent: 'bloque-neurodesarrollo',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#546024571',
  },
  {
    id: '6A05.0',
    code: '6A05.0',
    title: 'Trastorno por déficit de atención e hiperactividad, presentación predominantemente inatenta',
    description: 'Patrón persistente de inatención que interfiere con el funcionamiento o el desarrollo, caracterizado por no prestar atención cercana a los detalles, cometer errores por descuido y dificultad para mantener la concentración.',
    parent: 'bloque-neurodesarrollo',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#821852937',
  },
  {
    id: '6A05.1',
    code: '6A05.1',
    title: 'Trastorno por déficit de atención e hiperactividad, presentación predominantemente hiperactivo-impulsiva',
    description: 'Patrón caracterizado por excesiva actividad motora, inquietud motriz física e incapacidad para mantenerse sentado o esperar el turno.',
    parent: 'bloque-neurodesarrollo',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#821852937',
  },
  {
    id: '6A05.2',
    code: '6A05.2',
    title: 'Trastorno por déficit de atención e hiperactividad, presentación combinada',
    description: 'Presencia simultánea de síntomas clínicamente significativos tanto de inatención como de hiperactividad-impulsividad.',
    parent: 'bloque-neurodesarrollo',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#821852937',
  },

  // === BLOQUE: Esquizofrenia ===
  {
    id: 'bloque-esquizofrenia',
    code: '6A20-6A2Z',
    title: 'Esquizofrenia u otros trastornos psicóticos primarios',
    description: 'Trastornos caracterizados por distorsiones significativas de la percepción, el pensamiento, el afecto, la voluntad y el comportamiento.',
    isBlock: true,
    parent: 'ch06',
    children: ['6A20', '6A21', '6A22', '6A23', '6A24', '6A25'],
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#1683919430',
  },
  {
    id: '6A20',
    code: '6A20',
    title: 'Esquizofrenia',
    description: 'Trastorno caracterizado por perturbaciones del pensamiento (delirios), la percepción (alucinaciones), la experiencia del yo, la cognición, la volición, el afecto y el comportamiento. Los síntomas más frecuentes incluyen delirios persecutorios y de referencia, alucinaciones auditivas (voces comentadoras o que dialogan) y trastorno del pensamiento.',
    parent: 'bloque-esquizofrenia',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#405565289',
  },
  {
    id: '6A21',
    code: '6A21',
    title: 'Trastorno esquizoafectivo',
    description: 'Trastorno episódico en el que se cumplen simultáneamente los criterios diagnósticos tanto para la esquizofrenia como para un episodio del estado de ánimo (depresivo, maníaco o mixto).',
    parent: 'bloque-esquizofrenia',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#405565289',
  },
  {
    id: '6A22',
    code: '6A22',
    title: 'Trastorno esquizotípico',
    description: 'Caracterizado por un patrón duradero de excentricidades del comportamiento, la apariencia y el habla, acompañado de anomalías cognitivas y perceptuales.',
    parent: 'bloque-esquizofrenia',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#405565289',
  },
  {
    id: '6A23',
    code: '6A23',
    title: 'Trastorno psicótico agudo y transitorio',
    description: 'Inicio agudo de síntomas psicóticos que se desarrollan sin un pródromo y alcanzan su máxima gravedad en un plazo de dos semanas.',
    parent: 'bloque-esquizofrenia',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#405565289',
  },
  {
    id: '6A24',
    code: '6A24',
    title: 'Trastorno delirante',
    description: 'Desarrollo de un delirio o un conjunto de delirios relacionados que persisten durante al menos 3 meses sin cumplir los criterios completos de esquizofrenia.',
    parent: 'bloque-esquizofrenia',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#405565289',
  },
  {
    id: '6A25',
    code: '6A25',
    title: 'Episodio psicótico primario, otro especificado',
    description: 'Episodio psicótico que no cumple la definición diagnóstica de ningún otro trastorno psicótico primario especificado.',
    parent: 'bloque-esquizofrenia',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#405565289',
  },

  // === BLOQUE: Trastornos del estado de ánimo ===
  {
    id: 'bloque-animo',
    code: '6A60-6A8Z',
    title: 'Trastornos del estado de ánimo',
    description: 'Los trastornos del estado de ánimo se caracterizan por una perturbación del estado de ánimo (deprimido, maníaco o mixto) como característica clínica central.',
    isBlock: true,
    parent: 'ch06',
    children: ['6A60', '6A62', '6A70.0', '6A70.1', '6A70.2', '6A71', '6A72', '6A73', '6A80'],
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#1076816413',
  },
  {
    id: '6A60',
    code: '6A60',
    title: 'Trastorno bipolar tipo I',
    description: 'Trastorno del estado de ánimo caracterizado por la presencia de al menos un episodio maníaco o mixto. Puede incluir episodios depresivos.',
    parent: 'bloque-animo',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#613592747',
  },
  {
    id: '6A62',
    code: '6A62',
    title: 'Trastorno bipolar tipo II',
    description: 'Al menos un episodio hipomaníaco y al menos un episodio depresivo mayor, sin episodios maníacos completos.',
    parent: 'bloque-animo',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#613592747',
  },
  {
    id: '6A70.0',
    code: '6A70.0',
    title: 'Trastorno depresivo de episodio único, leve',
    description: 'Episodio caracterizado por un estado de ánimo deprimido casi todos los días o anhedonia, acompañado de otros síntomas afectivos, cognitivos y neurovegetativos de intensidad leve.',
    parent: 'bloque-animo',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#578635574',
  },
  {
    id: '6A70.1',
    code: '6A70.1',
    title: 'Trastorno depresivo de episodio único, moderado',
    description: 'Episodio caracterizado por presencia marcada de estado de ánimo deprimido y pérdida de interés en actividades habituales durante al menos 2 semanas con interferencia significativa.',
    parent: 'bloque-animo',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#578635574',
  },
  {
    id: '6A70.2',
    code: '6A70.2',
    title: 'Trastorno depresivo de episodio único, grave sin síntomas psicóticos',
    description: 'Episodio depresivo de intensidad grave que incapacita casi totalmente el funcionamiento personal, laboral o social.',
    parent: 'bloque-animo',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#578635574',
  },
  {
    id: '6A71',
    code: '6A71',
    title: 'Trastorno depresivo recurrente',
    description: 'Historia de múltiples episodios depresivos previos sin antecedentes de episodios maníacos o hipomaníacos independientes.',
    parent: 'bloque-animo',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#578635574',
  },
  {
    id: '6A72',
    code: '6A72',
    title: 'Trastorno distímico',
    description: 'Estado de ánimo persistentemente deprimido durante la mayor parte del día durante al menos 2 años sin remisiones prolongadas.',
    parent: 'bloque-animo',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#578635574',
  },
  {
    id: '6A73',
    code: '6A73',
    title: 'Trastorno mixto depresivo y de ansiedad',
    description: 'Presencia simultánea de síntomas depresivos y de ansiedad, sin que ninguno de los dos conjuntos de síntomas, considerados por separado, sea lo suficientemente grave como para justificar un diagnóstico.',
    parent: 'bloque-animo',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#578635574',
  },
  {
    id: '6A80',
    code: '6A80',
    title: 'Trastorno disfórico premenstrual',
    description: 'Patrón de síntomas del estado de ánimo, ansiedad o irritabilidad excesiva que se produce de forma repetida durante la fase lútea del ciclo menstrual y remite poco después del inicio de la menstruación.',
    parent: 'bloque-animo',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#578635574',
  },

  // === BLOQUE: Trastornos de ansiedad ===
  {
    id: 'bloque-ansiedad',
    code: '6B00-6B0Z',
    title: 'Trastornos de ansiedad o relacionados con el miedo',
    description: 'Los trastornos de ansiedad se caracterizan por miedo y ansiedad excesivos y los trastornos de comportamiento relacionados, con síntomas suficientemente graves como para provocar angustia significativa o deterioro significativo del funcionamiento.',
    isBlock: true,
    parent: 'ch06',
    children: ['6B00', '6B01', '6B02', '6B03', '6B04', '6B05', '6B06'],
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#1336943699',
  },
  {
    id: '6B00',
    code: '6B00',
    title: 'Trastorno de ansiedad generalizada',
    description: 'Ansiedad y preocupación excesivas, persistentes y difíciles de controlar sobre múltiples eventos o actividades cotidianas, acompañadas de tensión muscular, fatiga e inquietud. Los síntomas deben estar presentes la mayor parte de los días durante al menos varios meses.',
    parent: 'bloque-ansiedad',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#337387362',
  },
  {
    id: '6B01',
    code: '6B01',
    title: 'Trastorno de pánico',
    description: 'Ataques de pánico recurrentes e inesperados no restringidos a situaciones particulares, seguidos de aprensión persistente ante nuevos ataques y conductas desadaptativas de evitación.',
    parent: 'bloque-ansiedad',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#337387362',
  },
  {
    id: '6B02',
    code: '6B02',
    title: 'Agorafobia',
    description: 'Temor o ansiedad marcadamente excesivos en situaciones donde escapar podría ser difícil o la ayuda podría no estar disponible (transporte público, multitudes, espacios abiertos). La persona evita activamente dichas situaciones.',
    parent: 'bloque-ansiedad',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#337387362',
  },
  {
    id: '6B03',
    code: '6B03',
    title: 'Trastorno de ansiedad social',
    description: 'Temor o ansiedad notables e intensos que ocurren consistentemente en una o más situaciones sociales en las que la persona puede ser evaluada o examinada por otros. La persona teme actuar de un modo que será evaluado negativamente.',
    parent: 'bloque-ansiedad',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#337387362',
  },
  {
    id: '6B04',
    code: '6B04',
    title: 'Fobia específica',
    description: 'Ansiedad o temor excesivo desencadenado por la presencia o anticipación de un objeto o situación específicos (animales, alturas, inyecciones, sangre, tormentas, espacios cerrados).',
    parent: 'bloque-ansiedad',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#337387362',
  },
  {
    id: '6B05',
    code: '6B05',
    title: 'Trastorno de ansiedad por separación',
    description: 'Temor o ansiedad excesivos e inapropiados para el nivel de desarrollo concerniente a la separación de las figuras de apego.',
    parent: 'bloque-ansiedad',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#337387362',
  },
  {
    id: '6B06',
    code: '6B06',
    title: 'Mutismo selectivo',
    description: 'Incapacidad consistente de hablar en situaciones sociales específicas en las que existe expectativa de hablar, a pesar de hablar en otras situaciones.',
    parent: 'bloque-ansiedad',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#337387362',
  },

  // === BLOQUE: Trastorno obsesivo-compulsivo ===
  {
    id: 'bloque-ocd',
    code: '6B20-6B2Z',
    title: 'Trastorno obsesivo-compulsivo o trastornos relacionados',
    description: 'Trastornos caracterizados por pensamientos repetitivos no deseados y comportamientos repetitivos o actos mentales que el individuo se siente impulsado a realizar.',
    isBlock: true,
    parent: 'ch06',
    children: ['6B20', '6B21', '6B22', '6B23', '6B24', '6B25'],
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#1602669465',
  },
  {
    id: '6B20',
    code: '6B20',
    title: 'Trastorno obsesivo-compulsivo',
    description: 'Presencia de obsesiones persistentes (pensamientos, impulsos o imágenes intrusivas) y/o compulsiones (comportamientos repetitivos o actos mentales) que la persona se siente obligada a realizar en respuesta a una obsesión o según reglas aplicadas rígidamente.',
    parent: 'bloque-ocd',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#825556808',
  },
  {
    id: '6B21',
    code: '6B21',
    title: 'Trastorno dismórfico corporal',
    description: 'Preocupación persistente por uno o más defectos o imperfecciones percibidos en la apariencia física que no son observables o parecen leves a los demás.',
    parent: 'bloque-ocd',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#825556808',
  },
  {
    id: '6B22',
    code: '6B22',
    title: 'Hipocondría / Ansiedad por la salud',
    description: 'Preocupación o temor persistente de padecer una o más enfermedades graves y progresivas que amenacen la vida, con conductas de verificación excesivas o evitación marcada.',
    parent: 'bloque-ocd',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#825556808',
  },
  {
    id: '6B23',
    code: '6B23',
    title: 'Trastorno de acumulación',
    description: 'Acumulación de posesiones, independientemente de su valor real, debido a la necesidad percibida de guardarlos y a la angustia asociada a desprenderse de ellos.',
    parent: 'bloque-ocd',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#825556808',
  },
  {
    id: '6B24',
    code: '6B24',
    title: 'Tricotilomanía (trastorno de arrancarse el cabello)',
    description: 'Arrancamiento recurrente del propio cabello que resulta en pérdida de cabello, acompañado de intentos repetidos de reducir o detener el comportamiento.',
    parent: 'bloque-ocd',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#825556808',
  },
  {
    id: '6B25',
    code: '6B25',
    title: 'Trastorno por excoriación (rascado patológico)',
    description: 'Rascado recurrente de la propia piel que resulta en lesiones cutáneas, acompañado de intentos repetidos de reducir o detener el comportamiento.',
    parent: 'bloque-ocd',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#825556808',
  },

  // === BLOQUE: Trastornos asociados con el estrés ===
  {
    id: 'bloque-estres',
    code: '6B40-6B4Z',
    title: 'Trastornos específicamente asociados con el estrés',
    description: 'Trastornos que surgen directa y exclusivamente como resultado de la exposición a un evento estresante o adverso.',
    isBlock: true,
    parent: 'ch06',
    children: ['6B40', '6B41', '6B42', '6B43', '6B44', '6B45'],
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#1585833559',
  },
  {
    id: '6B40',
    code: '6B40',
    title: 'Trastorno de estrés postraumático (TEPT)',
    description: 'Desarrollado tras la exposición a un evento extremadamente amenazante o horrendo, caracterizado por reexperimentación del evento traumático en el presente (recuerdos intrusivos, flashbacks, pesadillas), evitación de pensamientos y recordatorios del evento, e hipervigilancia persistente.',
    parent: 'bloque-estres',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#585833559',
  },
  {
    id: '6B41',
    code: '6B41',
    title: 'Trastorno de estrés postraumático complejo',
    description: 'Surge tras la exposición a traumas prolongados o repetidos de los que es difícil escapar. Incluye todos los síntomas del TEPT más alteraciones graves en la regulación del afecto, creencias negativas sobre uno mismo y dificultades en las relaciones interpersonales.',
    parent: 'bloque-estres',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#585833559',
  },
  {
    id: '6B42',
    code: '6B42',
    title: 'Trastorno de adaptación',
    description: 'Reacción desadaptativa a un estresor psicosocial identificable (divorcio, problemas económicos, enfermedad) que surge dentro del mes posterior al evento. Caracterizado por preocupación excesiva, recuerdos repetidos o rumiación constante sobre el estresor.',
    parent: 'bloque-estres',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#585833559',
  },
  {
    id: '6B43',
    code: '6B43',
    title: 'Trastorno por duelo prolongado',
    description: 'Respuesta de duelo persistente y generalizada tras la muerte de un ser querido, con una añoranza intensa y angustia emocional marcada que persiste durante un período anormalmente largo.',
    parent: 'bloque-estres',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#585833559',
  },
  {
    id: '6B44',
    code: '6B44',
    title: 'Trastorno de apego reactivo',
    description: 'Patrón de comportamientos de apego marcadamente perturbados e inapropiados para el desarrollo, en el cual el niño raramente o mínimamente recurre a una figura de apego para obtener confort o protección.',
    parent: 'bloque-estres',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#585833559',
  },
  {
    id: '6B45',
    code: '6B45',
    title: 'Trastorno de desinhibición del compromiso social',
    description: 'Patrón de comportamiento en el cual el niño se acerca activamente e interactúa con adultos no familiares de una manera desinhibida y excesivamente familiar.',
    parent: 'bloque-estres',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#585833559',
  },

  // === BLOQUE: Trastornos disociativos ===
  {
    id: 'bloque-disociativos',
    code: '6B60-6B6Z',
    title: 'Trastornos disociativos',
    description: 'Los trastornos disociativos se caracterizan por una interrupción o discontinuidad involuntaria en la integración normal de funciones como la identidad, las sensaciones, la percepción, los afectos, los pensamientos, los recuerdos, el control sobre los movimientos corporales y el comportamiento.',
    isBlock: true,
    parent: 'ch06',
    children: ['6B60', '6B61', '6B62', '6B63', '6B64'],
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#1829103493',
  },
  {
    id: '6B60',
    code: '6B60',
    title: 'Trastorno de identidad disociativa',
    description: 'Presencia de dos o más estados de personalidad distintos (identidades alternantes) asociados con discontinuidades marcadas en el sentido del yo y la agencia.',
    parent: 'bloque-disociativos',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#1829103493',
  },
  {
    id: '6B61',
    code: '6B61',
    title: 'Trastorno de identidad disociativa parcial',
    description: 'Presencia de estados de personalidad no dominantes que no asumen el control ejecutivo recurrente del funcionamiento de la persona, pero con intrusiones notables en la consciencia.',
    parent: 'bloque-disociativos',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#1829103493',
  },
  {
    id: '6B62',
    code: '6B62',
    title: 'Amnesia disociativa',
    description: 'Incapacidad para recordar información autobiográfica importante, generalmente de naturaleza traumática o estresante, inconsistente con el olvido ordinario.',
    parent: 'bloque-disociativos',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#1829103493',
  },
  {
    id: '6B63',
    code: '6B63',
    title: 'Trance disociativo',
    description: 'Estado de trance en el que hay un estrechamiento o una pérdida completa de la consciencia del entorno inmediato, no atribuido a una práctica religiosa o cultural aceptada.',
    parent: 'bloque-disociativos',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#1829103493',
  },
  {
    id: '6B64',
    code: '6B64',
    title: 'Trastorno de despersonalización-desrealización',
    description: 'Experiencias persistentes o recurrentes de despersonalización, desrealización, o ambas. Sensación de ser un observador externo del propio cuerpo, pensamientos o sentimientos.',
    parent: 'bloque-disociativos',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#1829103493',
  },

  // === BLOQUE: Trastornos de la conducta alimentaria ===
  {
    id: 'bloque-alimentaria',
    code: '6B80-6B8Z',
    title: 'Trastornos de la conducta alimentaria o de la ingestión de alimentos',
    description: 'Comportamientos de alimentación anormales o preocupación por la alimentación que no se explican mejor por otra condición médica.',
    isBlock: true,
    parent: 'ch06',
    children: ['6B80', '6B81', '6B82', '6B83', '6B84'],
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#1673330729',
  },
  {
    id: '6B80',
    code: '6B80',
    title: 'Anorexia nerviosa',
    description: 'Restricción del consumo energético en relación con las necesidades, conduciendo a un peso corporal significativamente bajo para la edad, sexo, trayectoria de desarrollo y salud física. Temor intenso a ganar peso o engordar y comportamiento persistente que interfiere con el aumento de peso.',
    parent: 'bloque-alimentaria',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#263889491',
  },
  {
    id: '6B81',
    code: '6B81',
    title: 'Bulimia nerviosa',
    description: 'Episodios recurrentes de atracones acompañados de conductas compensatorias inapropiadas recurrentes para evitar el aumento de peso, como vómitos autoinducidos, uso indebido de laxantes, ayuno o ejercicio excesivo.',
    parent: 'bloque-alimentaria',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#263889491',
  },
  {
    id: '6B82',
    code: '6B82',
    title: 'Trastorno por atracón',
    description: 'Episodios recurrentes de atracones que no van seguidos regularmente de comportamientos compensatorios inapropiados como en la bulimia nerviosa.',
    parent: 'bloque-alimentaria',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#263889491',
  },
  {
    id: '6B83',
    code: '6B83',
    title: 'Trastorno por evitación/restricción de la ingestión de alimentos',
    description: 'Evitación o restricción de la ingesta de alimentos que resulta en una incapacidad persistente para satisfacer las necesidades nutricionales o energéticas.',
    parent: 'bloque-alimentaria',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#263889491',
  },
  {
    id: '6B84',
    code: '6B84',
    title: 'Pica',
    description: 'Ingestión persistente de sustancias no comestibles, no alimentarias, durante un período de al menos un mes, que es lo suficientemente grave como para requerir atención clínica.',
    parent: 'bloque-alimentaria',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#263889491',
  },

  // === BLOQUE: Trastornos de la personalidad ===
  {
    id: 'bloque-personalidad',
    code: '6D10-6D1Z',
    title: 'Trastornos de la personalidad y rasgos relacionados',
    description: 'Los trastornos de la personalidad se caracterizan por patrones duraderos de experiencia interna y comportamiento que se desvían de lo esperado culturalmente, son generalizados e inflexibles, con inicio en la adolescencia o adultez temprana.',
    isBlock: true,
    parent: 'ch06',
    children: ['6D10', '6D11'],
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#21500692',
  },
  {
    id: '6D10',
    code: '6D10',
    title: 'Trastorno de la personalidad',
    description: 'Patrón persistente de perturbación en el funcionamiento del yo (identidad, autodirección) y en el funcionamiento interpersonal (empatía, intimidad). Se clasifica por gravedad: leve, moderado o grave.',
    parent: 'bloque-personalidad',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#21500692',
  },
  {
    id: '6D11',
    code: '6D11',
    title: 'Patrón límite de personalidad',
    description: 'Patrón dominante de inestabilidad en las relaciones interpersonales, la autoimagen y los afectos, así como una marcada impulsividad, con tendencia al autolesionismo, sentimientos crónicos de vacío e ira inapropiada e intensa.',
    parent: 'bloque-personalidad',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#21500692',
  },

  // === BLOQUE: Trastornos debidos a comportamientos adictivos ===
  {
    id: 'bloque-adicciones',
    code: '6C00-6C5Z',
    title: 'Trastornos debidos al consumo de sustancias o a comportamientos adictivos',
    description: 'Trastornos debidos al uso de sustancias psicoactivas (alcohol, cannabis, opioides, estimulantes, etc.) y trastornos debidos a comportamientos adictivos (juego patológico, trastorno por juego de videojuegos).',
    isBlock: true,
    parent: 'ch06',
    children: ['6C40', '6C41', '6C50', '6C51'],
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#1602669465',
  },
  {
    id: '6C40',
    code: '6C40',
    title: 'Trastornos debidos al uso de alcohol',
    description: 'Patrón de consumo de alcohol que ha causado daño a la salud física o mental de una persona, o ha resultado en un comportamiento que daña la salud de otros.',
    parent: 'bloque-adicciones',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#1602669465',
  },
  {
    id: '6C41',
    code: '6C41',
    title: 'Trastornos debidos al uso de cannabis',
    description: 'Patrón de consumo de cannabis que ha causado daño a la salud física o mental de una persona.',
    parent: 'bloque-adicciones',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#1602669465',
  },
  {
    id: '6C50',
    code: '6C50',
    title: 'Trastorno por juego de videojuegos',
    description: 'Patrón de comportamiento de juego continuo o recurrente ("digital gaming" o "video gaming"), caracterizado por un control deteriorado sobre el juego, prioridad creciente al juego sobre otras actividades y continuación o escalada del juego a pesar de las consecuencias negativas.',
    parent: 'bloque-adicciones',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#1602669465',
  },
  {
    id: '6C51',
    code: '6C51',
    title: 'Juego patológico (trastorno por juegos de azar)',
    description: 'Patrón de comportamiento de juegos de azar persistente o recurrente, que puede ser en línea o presencial, manifestado por un control deteriorado sobre el juego.',
    parent: 'bloque-adicciones',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#1602669465',
  },

  // === BLOQUE: Trastornos del sueño ===
  {
    id: 'bloque-sueno',
    code: '7A00-7A4Z',
    title: 'Trastornos del sueño y la vigilia (selección Cap. 06)',
    description: 'Selección de trastornos del sueño relevantes para la práctica psicológica clínica.',
    isBlock: true,
    parent: 'ch06',
    children: ['7A00', '7A01'],
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#1296093776',
  },
  {
    id: '7A00',
    code: '7A00',
    title: 'Insomnio',
    description: 'Dificultad frecuente para iniciar el sueño, mantenerlo o despertar demasiado temprano, a pesar de tener oportunidad y circunstancias adecuadas para dormir, con angustia o deterioro diurno significativos.',
    parent: 'bloque-sueno',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#1296093776',
  },
  {
    id: '7A01',
    code: '7A01',
    title: 'Hipersomnia',
    description: 'Somnolencia excesiva durante la vigilia con dificultad para mantenerse alerta, o episodios prolongados de sueño que no resultan reparadores.',
    parent: 'bloque-sueno',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#1296093776',
  },

  // === BLOQUE: Disfunciones sexuales ===
  {
    id: 'bloque-sexual',
    code: '6D30-6D3Z',
    title: 'Disfunciones sexuales',
    description: 'Síndromes que comprenden las diversas maneras en que la gente adulta puede tener dificultad para experimentar la respuesta sexual personalmente satisfactoria y no coercitiva.',
    isBlock: true,
    parent: 'ch06',
    children: ['6D30', '6D31', '6D32', '6D33', '6D34', '6D35', '6D36'],
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#577470983',
  },
  {
    id: '6D30',
    code: '6D30',
    title: 'Trastorno del deseo sexual hipoactivo',
    description: 'Ausencia o reducción significativa del deseo o la motivación sexual (pensamientos o fantasías sexuales, deseo de iniciar actividad sexual) que es inferior a lo que se podría esperar dado la edad y el contexto relacional.',
    parent: 'bloque-sexual',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#577470983',
  },
  {
    id: '6D31',
    code: '6D31',
    title: 'Trastorno de la excitación sexual',
    description: 'Dificultad significativa o incapacidad para experimentar excitación sexual.',
    parent: 'bloque-sexual',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#577470983',
  },
  {
    id: '6D32',
    code: '6D32',
    title: 'Disfunción orgásmica',
    description: 'Dificultad significativa o incapacidad para alcanzar el orgasmo o sensación de reducción marcada en la intensidad de las sensaciones orgásmicas.',
    parent: 'bloque-sexual',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#577470983',
  },
  {
    id: '6D33',
    code: '6D33',
    title: 'Eyaculación precoz',
    description: 'Patrón persistente o recurrente en el que la eyaculación ocurre durante la actividad sexual dentro de un período muy breve, antes de que la persona lo desee.',
    parent: 'bloque-sexual',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#577470983',
  },
  {
    id: '6D34',
    code: '6D34',
    title: 'Eyaculación retardada',
    description: 'Demora marcada, infrecuencia marcada o ausencia de eyaculación durante la actividad sexual, a pesar de un deseo suficiente de eyacular.',
    parent: 'bloque-sexual',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#577470983',
  },
  {
    id: '6D35',
    code: '6D35',
    title: 'Disfunción eréctil',
    description: 'Dificultad significativa o incapacidad persistente para lograr o mantener una erección suficiente para una actividad sexual satisfactoria.',
    parent: 'bloque-sexual',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#577470983',
  },
  {
    id: '6D36',
    code: '6D36',
    title: 'Trastorno de dolor genito-pélvico por penetración',
    description: 'Dificultades marcadas y persistentes con la penetración vaginal, con dolor vulvovaginal o pélvico durante la penetración, temor o ansiedad ante el dolor y tensión de los músculos del suelo pélvico.',
    parent: 'bloque-sexual',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#577470983',
  },
];

/**
 * Entidades especiales fuera del capítulo 06 pero relevantes en contexto clínico/psicológico
 */
export const CIE11_SPECIAL_ENTITIES: Cie11Entity[] = [
  {
    id: 'maltrato',
    code: 'PL00-PL2Z',
    title: 'Maltrato',
    description: 'Actos no accidentales de fuerza física, actos sexuales forzados o coaccionados, actos verbales o simbólicos, u omisiones significativas de cuidado que resultan en daño o tienen un potencial razonable de daño. Estas categorías se aplican a la víctima del maltrato, no al agresor.',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#491063206',
    isBlock: true,
    parent: 'ch23',
    children: ['PL00', 'PL01', 'PL02'],
  },
  {
    id: 'PL00',
    code: 'PL00',
    title: 'Maltrato infantil',
    description: 'Maltrato físico, sexual, emocional o negligencia hacia un menor de edad.',
    parent: 'maltrato',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#491063206',
  },
  {
    id: 'PL01',
    code: 'PL01',
    title: 'Maltrato de adultos',
    description: 'Maltrato físico, sexual, emocional o negligencia hacia un adulto.',
    parent: 'maltrato',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#491063206',
  },
  {
    id: 'PL02',
    code: 'PL02',
    title: 'Maltrato de persona mayor',
    description: 'Maltrato físico, sexual, emocional, financiero o negligencia hacia una persona de edad avanzada.',
    parent: 'maltrato',
    whoUrl: 'https://icd.who.int/browse/2026-01/mms/es#491063206',
  },
];

/**
 * Función de búsqueda global en todo el catálogo CIE-11
 */
export function searchCie11FullCatalog(query: string): Cie11Entity[] {
  const cleanQ = query.toLowerCase().trim();
  if (!cleanQ) return [];

  const allEntities = [
    ...CIE11_CHAPTERS,
    ...CIE11_CHAPTER06_BLOCKS,
    ...CIE11_SPECIAL_ENTITIES,
  ];

  return allEntities.filter((e) => {
    return (
      e.code.toLowerCase().includes(cleanQ) ||
      e.title.toLowerCase().includes(cleanQ) ||
      e.description.toLowerCase().includes(cleanQ)
    );
  });
}

/**
 * Obtener los hijos directos de una entidad
 */
export function getChildrenOf(parentId: string): Cie11Entity[] {
  const allEntities = [
    ...CIE11_CHAPTERS,
    ...CIE11_CHAPTER06_BLOCKS,
    ...CIE11_SPECIAL_ENTITIES,
  ];
  return allEntities.filter((e) => e.parent === parentId);
}

/**
 * Obtener una entidad por su id
 */
export function getEntityById(id: string): Cie11Entity | undefined {
  const allEntities = [
    ...CIE11_CHAPTERS,
    ...CIE11_CHAPTER06_BLOCKS,
    ...CIE11_SPECIAL_ENTITIES,
  ];
  return allEntities.find((e) => e.id === id);
}
