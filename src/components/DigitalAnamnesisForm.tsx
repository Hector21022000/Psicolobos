/**
 * Nombre del archivo: src/components/DigitalAnamnesisForm.tsx
 * Descripción: Formulario e interfaz digital interactiva completa para Anamnesis e Historia de Salud Mental (Modelo Dec. 170 / Ley 20.201).
 * Fecha de última modificación: 2026-09-20
 * Autor: Psicolobos Development Team
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  User,
  Users,
  Heart,
  Brain,
  Eye,
  MessageSquare,
  Smile,
  Activity,
  Home,
  GraduationCap,
  Save,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  FileCheck
} from 'lucide-react';

export interface AnamnesisModel {
  documentInfo?: {
    fileName?: string;
    type?: string;
    digitalizedAt?: string;
  };
  section1_estudiante: {
    nombre: string;
    sexo: string; // 'M' | 'F'
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
      tipoParto: string; // 'normal' | 'inducido' | 'forceps' | 'cesarea'
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
      actividadMotora: string; // 'normal' | 'activo' | 'hiperactivo' | 'hipoactivo'
      tonoMuscular: string; // 'normal' | 'hipertonico' | 'hipotonico'
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
      comunicacionPreferente: string; // 'oral' | 'gestual' | 'mixto' | 'otro'
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
      reaccionLuces: string; // 'natural' | 'desmesurada'
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
      alimentacion: string; // 'normal' | 'otro'
      pesoApreciacion: string; // 'normal' | 'bajo_peso' | 'obesidad'
      suenoEstado: string; // 'tranquilo' | 'inquieto' | 'insomnio'
      horasSueño: string;
      duermeSolo: boolean;
      humorHabitual: string; // 'alegre' | 'triste' | 'serio' | 'violento'
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
    modalidadEnsenanza: string; // 'regular' | 'especial' | 'tecnica'
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
    evaluacionFamiliaDesempeno: string; // 'satisfactorio' | 'insatisfactorio'
    respuestaFamiliaDificultades: string; // 'apoyo' | 'castigo' | 'indiferencia' | 'tension'
    respuestaFamiliaExitos: string; // 'apoyo' | 'indiferencia'
    refuerzosPremiosUsados: string;
    quienesApoyanAprendizaje: string[];
    expectativasFamiliaFuturo: string; // 'alta' | 'mediana' | 'baja'
    ambienteFisicoEmocional: string; // 'Ambos' | 'Fisico' | 'Emocional'
    comentariosObservacionesAdicionales: string;
  };
}

interface DigitalAnamnesisFormProps {
  initialData?: Partial<AnamnesisModel>;
  patientName?: string;
  onSave: (model: AnamnesisModel) => Promise<void>;
  onDelete?: () => void;
  saving?: boolean;
}

export const emptyAnamnesisModel: AnamnesisModel = {
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
  section2_informantes: [],
  section3_entrevistadores: [],
  section4_motivo: '',
  section5_desarrolloSalud: {
    diagnosticoPrevio: {
      pediatria: false,
      psicologia: false,
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
      motricidadFina: { garra: false, prension: false, pinza: false, ensarta: false, dibuja: false, escribe: false },
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
      expresivo: { balbuceaEmiteSonidos: false, emiteFrases: false, vocalizaGestos: false, relataExperiencias: false, emitePalabras: false, pronunciacionClara: false },
      comprensivo: { identificaObjetos: false, sigueInstruccionesSimples: false, identificaPersonas: false, sigueInstruccionesComplejas: false, comprendeConceptosAbstractos: false, sigueInstruccionesGrupales: false, respondeCoherentePreguntas: false, comprendeRelatosCuentos: false },
      perdidaLenguajeOral: '',
    },
    desarrolloSocial: {
      relacionEspontaneaPersonas: false,
      relacionColaborativa: false,
      explicaRazonesComportamiento: false,
      respetaNormasSociales: false,
      participaActividadesGrupales: false,
      respetaNormasEscolares: false,
      optaTrabajoIndividual: false,
      muestraSentidoHumor: false,
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
      horasSueño: '',
      duermeSolo: true,
      humorHabitual: 'alegre',
    },
  },
  section6_antecedentesFamiliares: {
    integrantesHogar: [],
    antecedentesSaludFamilia: '',
    observaciones: '',
  },
  section7_antecedentesEscolares: {
    edadIngresoEscolar: '',
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
    quienesApoyanAprendizaje: [],
    expectativasFamiliaFuturo: 'alta',
    ambienteFisicoEmocional: 'Ambos',
    comentariosObservacionesAdicionales: '',
  }
};

export const defaultAnamnesisModel: AnamnesisModel = emptyAnamnesisModel;

export default function DigitalAnamnesisForm({
  initialData,
  patientName = 'Paciente',
  onSave,
  onDelete,
  saving = false
}: DigitalAnamnesisFormProps) {
  const getInitialState = (data?: Partial<AnamnesisModel>) => {
    const hasData = data && Object.keys(data).length > 0;
    const base = hasData ? data : emptyAnamnesisModel;
    return {
      ...emptyAnamnesisModel,
      ...base,
      section1_estudiante: {
        ...emptyAnamnesisModel.section1_estudiante,
        nombre: patientName || '',
        ...(base?.section1_estudiante || {}),
      }
    };
  };

  const [form, setForm] = useState<AnamnesisModel>(() => getInitialState(initialData));

  useEffect(() => {
    setForm(getInitialState(initialData));
  }, [initialData, patientName]);

  const [activeSection, setActiveSection] = useState<number>(1);

  const toggleCheck = (path: string[]) => {
    setForm((prev: any) => {
      const next = JSON.parse(JSON.stringify(prev));
      let curr = next;
      for (let i = 0; i < path.length - 1; i++) {
        curr = curr[path[i]];
      }
      curr[path[path.length - 1]] = !curr[path[path.length - 1]];
      return next;
    });
  };

  const updateField = (path: string[], val: any) => {
    setForm((prev: any) => {
      const next = JSON.parse(JSON.stringify(prev));
      let curr = next;
      for (let i = 0; i < path.length - 1; i++) {
        curr = curr[path[i]];
      }
      curr[path[path.length - 1]] = val;
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(form);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
      {/* Header oficial del modelo de Anamnesis */}
      <div className="bg-gradient-to-r from-[#484496] via-[#393478] to-slate-900 text-white p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold tracking-tight">
              Pauta Oficial de Anamnesis e Historia Clínica Digital
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Modelo interactivo oficial: Evaluación Diagnóstica Integral y Entrevista a la Familia para <span className="font-semibold text-white">{patientName}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="px-3.5 py-2 bg-rose-600/90 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
              title="Eliminar y resetear la Anamnesis del expediente"
            >
              <Trash2 className="w-4 h-4" />
              <span>Eliminar Anamnesis</span>
            </button>
          )}

          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Guardando en BD...' : 'Guardar Anamnesis Digitalizada'}</span>
          </button>
        </div>
      </div>

      {/* Navegación por las 7 secciones del modelo */}
      <div className="flex overflow-x-auto border-b border-slate-200 bg-slate-50 p-2 gap-1.5 scrollbar-thin">
        {[
          { id: 1, title: '1. Estudiante', icon: User },
          { id: 2, title: '2. Informantes', icon: Users },
          { id: 3, title: '3. Entrevistadores', icon: Users },
          { id: 4, title: '4. Motivo Consulta', icon: MessageSquare },
          { id: 5, title: '5. Desarrollo & Salud', icon: Heart },
          { id: 6, title: '6. Antecedentes Familiares', icon: Home },
          { id: 7, title: '7. Historia Escolar', icon: GraduationCap },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#484496] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200/60 border border-slate-200'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#484496]'}`} />
              <span>{tab.title}</span>
            </button>
          );
        })}
      </div>

      <div className="p-6 space-y-6">
        {/* SECCIÓN 1: Identificación del Estudiante */}
        {activeSection === 1 && (
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-[#484496]" />
              1. IDENTIFICACIÓN DEL ESTUDIANTE / PACIENTE
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Nombre Completo:</label>
                <input
                  type="text"
                  value={form.section1_estudiante.nombre}
                  onChange={(e) => updateField(['section1_estudiante', 'nombre'], e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#484496]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Sexo Biológico:</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => updateField(['section1_estudiante', 'sexo'], 'F')}
                    className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all ${
                      form.section1_estudiante.sexo === 'F' ? 'bg-purple-600 text-white border-purple-600' : 'bg-slate-50 text-slate-600'
                    }`}
                  >
                    Femenino (F)
                  </button>
                  <button
                    type="button"
                    onClick={() => updateField(['section1_estudiante', 'sexo'], 'M')}
                    className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all ${
                      form.section1_estudiante.sexo === 'M' ? 'bg-[#484496] text-white border-[#484496]' : 'bg-slate-50 text-slate-600'
                    }`}
                  >
                    Masculino (M)
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Fecha Nacimiento:</label>
                <input
                  type="date"
                  value={form.section1_estudiante.fechaNacimiento}
                  onChange={(e) => updateField(['section1_estudiante', 'fechaNacimiento'], e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#484496]"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Edad (Años):</label>
                <input
                  type="text"
                  value={form.section1_estudiante.edadAnos}
                  onChange={(e) => updateField(['section1_estudiante', 'edadAnos'], e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#484496]"
                  placeholder="Ej. 10"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Edad (Meses):</label>
                <input
                  type="text"
                  value={form.section1_estudiante.edadMeses}
                  onChange={(e) => updateField(['section1_estudiante', 'edadMeses'], e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#484496]"
                  placeholder="Ej. 6"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">País Natal:</label>
                <input
                  type="text"
                  value={form.section1_estudiante.paisNatal}
                  onChange={(e) => updateField(['section1_estudiante', 'paisNatal'], e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#484496]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Domicilio Actual:</label>
                <input
                  type="text"
                  value={form.section1_estudiante.domicilio}
                  onChange={(e) => updateField(['section1_estudiante', 'domicilio'], e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#484496]"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Teléfono de Contacto:</label>
                <input
                  type="text"
                  value={form.section1_estudiante.telefono}
                  onChange={(e) => updateField(['section1_estudiante', 'telefono'], e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#484496]"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <label className="font-bold text-slate-800">Dominio de Lengua Materna:</label>
              <div className="flex flex-wrap gap-4 text-xs">
                {[
                  { key: 'comprende', label: 'Comprende' },
                  { key: 'habla', label: 'Habla' },
                  { key: 'lee', label: 'Lee' },
                  { key: 'escribe', label: 'Escribe' },
                ].map((item) => (
                  <label key={item.key} className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={(form.section1_estudiante.lenguaMaterna as any)[item.key]}
                      onChange={() => toggleCheck(['section1_estudiante', 'lenguaMaterna', item.key])}
                      className="w-4 h-4 text-[#484496] rounded-xs"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SECCIÓN 2: Informantes */}
        {activeSection === 2 && (
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-800 border-b pb-2 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#484496]" />
                2. IDENTIFICACIÓN DEL O LOS INFORMANTES
              </span>
              <button
                type="button"
                onClick={() => setForm(prev => ({
                  ...prev,
                  section2_informantes: [...prev.section2_informantes, { fecha: new Date().toISOString().slice(0, 10), nombre: '', relacion: '', enPresenciaDe: '' }]
                }))}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Agregar Informante
              </button>
            </h3>

            {form.section2_informantes.map((inf, idx) => (
              <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 relative">
                <div className="flex justify-between items-center font-bold text-slate-700">
                  <span>Informante #{idx + 1}</span>
                  {form.section2_informantes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setForm(prev => ({
                        ...prev,
                        section2_informantes: prev.section2_informantes.filter((_, i) => i !== idx)
                      }))}
                      className="text-rose-600 hover:text-rose-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Fecha Entrevista:</label>
                    <input
                      type="date"
                      value={inf.fecha}
                      onChange={(e) => {
                        const newInf = [...form.section2_informantes];
                        newInf[idx].fecha = e.target.value;
                        setForm({ ...form, section2_informantes: newInf });
                      }}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Nombre Informante:</label>
                    <input
                      type="text"
                      value={inf.nombre}
                      onChange={(e) => {
                        const newInf = [...form.section2_informantes];
                        newInf[idx].nombre = e.target.value;
                        setForm({ ...form, section2_informantes: newInf });
                      }}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                      placeholder="Nombre del apoderado o tutor"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Relación con el Paciente:</label>
                    <input
                      type="text"
                      value={inf.relacion}
                      onChange={(e) => {
                        const newInf = [...form.section2_informantes];
                        newInf[idx].relacion = e.target.value;
                        setForm({ ...form, section2_informantes: newInf });
                      }}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                      placeholder="Ej. Madre, Padre, Abuela"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">En presencia de:</label>
                    <input
                      type="text"
                      value={inf.enPresenciaDe}
                      onChange={(e) => {
                        const newInf = [...form.section2_informantes];
                        newInf[idx].enPresenciaDe = e.target.value;
                        setForm({ ...form, section2_informantes: newInf });
                      }}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                      placeholder="Ej. Evaluador, Intérprete"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SECCIÓN 3: Entrevistadores */}
        {activeSection === 3 && (
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
              <Users className="w-4 h-4 text-[#484496]" />
              3. IDENTIFICACIÓN DEL O LOS ENTREVISTADORES
            </h3>

            {form.section3_entrevistadores.map((ent, idx) => (
              <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Fecha Entrevista:</label>
                  <input
                    type="date"
                    value={ent.fecha}
                    onChange={(e) => {
                      const list = [...form.section3_entrevistadores];
                      list[idx].fecha = e.target.value;
                      setForm({ ...form, section3_entrevistadores: list });
                    }}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Nombre Entrevistador:</label>
                  <input
                    type="text"
                    value={ent.nombre}
                    onChange={(e) => {
                      const list = [...form.section3_entrevistadores];
                      list[idx].nombre = e.target.value;
                      setForm({ ...form, section3_entrevistadores: list });
                    }}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Rol / Cargo Professional:</label>
                  <input
                    type="text"
                    value={ent.rolCargo}
                    onChange={(e) => {
                      const list = [...form.section3_entrevistadores];
                      list[idx].rolCargo = e.target.value;
                      setForm({ ...form, section3_entrevistadores: list });
                    }}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SECCIÓN 4: Motivo */}
        {activeSection === 4 && (
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#484496]" />
              4. DEFINICIÓN DEL PROBLEMA O SITUACIÓN QUE MOTIVA LA ENTREVISTA
            </h3>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Motivo Principal de Consulta / Entrevista:</label>
              <textarea
                rows={5}
                value={form.section4_motivo}
                onChange={(e) => updateField(['section4_motivo'], e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#484496]"
                placeholder="Describa ampliamente la situación que motiva la entrevista clínica o de evaluación..."
              />
            </div>
          </div>
        )}

        {/* SECCIÓN 5: Desarrollo y Salud */}
        {activeSection === 5 && (
          <div className="space-y-6 text-xs">
            <h3 className="text-sm font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
              <Heart className="w-4 h-4 text-[#484496]" />
              5. ANTECEDENTES RELATIVOS AL DESARROLLO Y A LA SALUD
            </h3>

            {/* Diagnóstico Previo */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <label className="font-bold text-slate-800 block mb-1">5.0 Diagnóstico Previo (Seleccione las áreas pertinentes):</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {[
                  { key: 'pediatria', label: 'Pediatría' },
                  { key: 'psicologia', label: 'Psicología' },
                  { key: 'kinesiologia', label: 'Kinesiología' },
                  { key: 'psiquiatria', label: 'Psiquiatría' },
                  { key: 'genetico', label: 'Genético' },
                  { key: 'psicopedagogia', label: 'Psicopedagogía' },
                  { key: 'fonoaudiologia', label: 'Fonoaudiología' },
                  { key: 'terapiaOcupacional', label: 'Terapia Ocupacional' },
                  { key: 'neurologia', label: 'Neurología' },
                ].map((diag) => (
                  <label key={diag.key} className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={(form.section5_desarrolloSalud.diagnosticoPrevio as any)[diag.key]}
                      onChange={() => toggleCheck(['section5_desarrolloSalud', 'diagnosticoPrevio', diag.key])}
                      className="w-4 h-4 text-[#484496] rounded-xs"
                    />
                    <span>{diag.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 5.1 Primer Año de Vida */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
              <h4 className="font-bold text-slate-800">5.1 Primer Año de Vida, Embarazo y Parto</h4>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tipo de Parto:</label>
                  <select
                    value={form.section5_desarrolloSalud.primerAnoVida.tipoParto}
                    onChange={(e) => updateField(['section5_desarrolloSalud', 'primerAnoVida', 'tipoParto'], e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                  >
                    <option value="normal">Normal</option>
                    <option value="inducido">Inducido</option>
                    <option value="forceps">Fórceps</option>
                    <option value="cesarea">Cesárea</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Peso al Nacer:</label>
                  <input
                    type="text"
                    value={form.section5_desarrolloSalud.primerAnoVida.peso}
                    onChange={(e) => updateField(['section5_desarrolloSalud', 'primerAnoVida', 'peso'], e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Talla al Nacer:</label>
                  <input
                    type="text"
                    value={form.section5_desarrolloSalud.primerAnoVida.talla}
                    onChange={(e) => updateField(['section5_desarrolloSalud', 'primerAnoVida', 'talla'], e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Vacunas al Día:</label>
                  <button
                    type="button"
                    onClick={() => toggleCheck(['section5_desarrolloSalud', 'primerAnoVida', 'vacunasAlDia'])}
                    className={`w-full py-2 rounded-lg font-bold text-xs ${
                      form.section5_desarrolloSalud.primerAnoVida.vacunasAlDia ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {form.section5_desarrolloSalud.primerAnoVida.vacunasAlDia ? 'Sí (Al Día)' : 'No Pendientes'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Factores Observados en Primer Año (Marque los aplicables):</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { key: 'desnutricion', label: 'Desnutrición' },
                    { key: 'traumatismos', label: 'Traumatismos' },
                    { key: 'encefalitis', label: 'Encefalitis' },
                    { key: 'obesidad', label: 'Obesidad' },
                    { key: 'intoxicacion', label: 'Intoxicación' },
                    { key: 'meningitis', label: 'Meningitis' },
                    { key: 'fiebreAlta', label: 'Fiebre Alta' },
                    { key: 'enfermedadRespiratoria', label: 'Resp. Crónica' },
                    { key: 'convulsiones', label: 'Convulsiones' },
                    { key: 'asma', label: 'Asma' },
                    { key: 'hospitalizaciones', label: 'Hospitalizaciones' },
                  ].map((item) => (
                    <label key={item.key} className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                      <input
                        type="checkbox"
                        checked={(form.section5_desarrolloSalud.primerAnoVida as any)[item.key]}
                        onChange={() => toggleCheck(['section5_desarrolloSalud', 'primerAnoVida', item.key])}
                        className="w-4 h-4 text-[#484496] rounded-xs"
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* 5.2 Desarrollo Sensorio Motriz */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
              <h4 className="font-bold text-slate-800">5.2 Desarrollo Sensorio Motriz</h4>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Fija Cabeza (Edad):</label>
                  <input
                    type="text"
                    value={form.section5_desarrolloSalud.desarrolloSensorioMotriz.fijaCabezaEdad}
                    onChange={(e) => updateField(['section5_desarrolloSalud', 'desarrolloSensorioMotriz', 'fijaCabezaEdad'], e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Se Sienta Solo/a (Edad):</label>
                  <input
                    type="text"
                    value={form.section5_desarrolloSalud.desarrolloSensorioMotriz.seSientaSoloEdad}
                    onChange={(e) => updateField(['section5_desarrolloSalud', 'desarrolloSensorioMotriz', 'seSientaSoloEdad'], e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Camina sin Apoyo (Edad):</label>
                  <input
                    type="text"
                    value={form.section5_desarrolloSalud.desarrolloSensorioMotriz.caminaSinApoyoEdad}
                    onChange={(e) => updateField(['section5_desarrolloSalud', 'desarrolloSensorioMotriz', 'caminaSinApoyoEdad'], e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Actividad Motora General:</label>
                  <select
                    value={form.section5_desarrolloSalud.desarrolloSensorioMotriz.actividadMotora}
                    onChange={(e) => updateField(['section5_desarrolloSalud', 'desarrolloSensorioMotriz', 'actividadMotora'], e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                  >
                    <option value="normal">Normal</option>
                    <option value="activo">Activo</option>
                    <option value="hiperactivo">Hiperactivo</option>
                    <option value="hipoactivo">Hipoactivo</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tono Muscular General:</label>
                  <select
                    value={form.section5_desarrolloSalud.desarrolloSensorioMotriz.tonoMuscular}
                    onChange={(e) => updateField(['section5_desarrolloSalud', 'desarrolloSensorioMotriz', 'tonoMuscular'], e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                  >
                    <option value="normal">Normal</option>
                    <option value="hipertonico">Hipertónico</option>
                    <option value="hipotonico">Hipotónico</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECCIÓN 6: Antecedentes Familiares */}
        {activeSection === 6 && (
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-800 border-b pb-2 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Home className="w-4 h-4 text-[#484496]" />
                6. ANTECEDENTES FAMILIARES (INTEGRANTES DEL HOGAR)
              </span>
              <button
                type="button"
                onClick={() => setForm(prev => ({
                  ...prev,
                  section6_antecedentesFamiliares: {
                    ...prev.section6_antecedentesFamiliares,
                    integrantesHogar: [...prev.section6_antecedentesFamiliares.integrantesHogar, { nombre: '', parentesco: '', edad: '', escolaridad: '', ocupacion: '' }]
                  }
                }))}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Agregar Integrante
              </button>
            </h3>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">Nombre</th>
                    <th className="p-2.5">Parentesco</th>
                    <th className="p-2.5">Edad</th>
                    <th className="p-2.5">Escolaridad</th>
                    <th className="p-2.5">Ocupación</th>
                    <th className="p-2.5 text-center">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {form.section6_antecedentesFamiliares.integrantesHogar.map((row, idx) => (
                    <tr key={idx} className="bg-white hover:bg-slate-50">
                      <td className="p-2">
                        <input
                          type="text"
                          value={row.nombre}
                          onChange={(e) => {
                            const list = [...form.section6_antecedentesFamiliares.integrantesHogar];
                            list[idx].nombre = e.target.value;
                            updateField(['section6_antecedentesFamiliares', 'integrantesHogar'], list);
                          }}
                          className="w-full p-1.5 border border-slate-200 rounded-lg"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={row.parentesco}
                          onChange={(e) => {
                            const list = [...form.section6_antecedentesFamiliares.integrantesHogar];
                            list[idx].parentesco = e.target.value;
                            updateField(['section6_antecedentesFamiliares', 'integrantesHogar'], list);
                          }}
                          className="w-full p-1.5 border border-slate-200 rounded-lg"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={row.edad}
                          onChange={(e) => {
                            const list = [...form.section6_antecedentesFamiliares.integrantesHogar];
                            list[idx].edad = e.target.value;
                            updateField(['section6_antecedentesFamiliares', 'integrantesHogar'], list);
                          }}
                          className="w-full p-1.5 border border-slate-200 rounded-lg"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={row.escolaridad}
                          onChange={(e) => {
                            const list = [...form.section6_antecedentesFamiliares.integrantesHogar];
                            list[idx].escolaridad = e.target.value;
                            updateField(['section6_antecedentesFamiliares', 'integrantesHogar'], list);
                          }}
                          className="w-full p-1.5 border border-slate-200 rounded-lg"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={row.ocupacion}
                          onChange={(e) => {
                            const list = [...form.section6_antecedentesFamiliares.integrantesHogar];
                            list[idx].ocupacion = e.target.value;
                            updateField(['section6_antecedentesFamiliares', 'integrantesHogar'], list);
                          }}
                          className="w-full p-1.5 border border-slate-200 rounded-lg"
                        />
                      </td>
                      <td className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            const list = form.section6_antecedentesFamiliares.integrantesHogar.filter((_, i) => i !== idx);
                            updateField(['section6_antecedentesFamiliares', 'integrantesHogar'], list);
                          }}
                          className="text-rose-600 hover:text-rose-800 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECCIÓN 7: Historia Escolar */}
        {activeSection === 7 && (
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#484496]" />
              7. ANTECEDENTES ESCOLARES Y APOYO DE LA FAMILIA
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Edad de Ingreso a Escuela:</label>
                <input
                  type="text"
                  value={form.section7_antecedentesEscolares.edadIngresoEscolar}
                  onChange={(e) => updateField(['section7_antecedentesEscolares', 'edadIngresoEscolar'], e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nº Colegios Estudiados:</label>
                <input
                  type="text"
                  value={form.section7_antecedentesEscolares.numColegiosEstudiado}
                  onChange={(e) => updateField(['section7_antecedentesEscolares', 'numColegiosEstudiado'], e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Modalidad de Enseñanza:</label>
                <select
                  value={form.section7_antecedentesEscolares.modalidadEnsenanza}
                  onChange={(e) => updateField(['section7_antecedentesEscolares', 'modalidadEnsenanza'], e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                >
                  <option value="regular">Regular</option>
                  <option value="especial">Especial</option>
                  <option value="tecnica">Técnica</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Comentarios y Observaciones Adicionales:</label>
              <textarea
                rows={4}
                value={form.section7_antecedentesEscolares.comentariosObservacionesAdicionales}
                onChange={(e) => updateField(['section7_antecedentesEscolares', 'comentariosObservacionesAdicionales'], e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#484496]"
                placeholder="Observaciones de la evaluación diagnóstica integral..."
              />
            </div>
          </div>
        )}
      </div>

      {/* Botón flotante inferior de guardado */}
      <div className="bg-slate-50 border-t border-slate-200 p-4 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="px-6 py-2.5 bg-[#484496] hover:bg-[#393478] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Guardando...' : 'Guardar Cambios de Anamnesis'}</span>
        </button>
      </div>
    </div>
  );
}
