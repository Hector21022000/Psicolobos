/**
 * Nombre del archivo: src/components/FichaIntegral2026Anamnesis.tsx
 * Descripción: Módulo digital e interactivo de la Anamnesis - Ficha Integral 2026, conservando fielmente la estructura, terminología y encabezado institucional original (Municipalidad de Chorrillos - OMAPED).
 * Fecha de última modificación: 2026-09-28
 * Autor: Psicolobos Development Team
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  User,
  Heart,
  Utensils,
  Home,
  GraduationCap,
  Users,
  Smile,
  CheckCircle2,
  Save,
  Printer,
  Download,
  Clock,
  Sparkles,
  AlertCircle,
  Check,
  Building2,
} from 'lucide-react';
import Badge from '@/components/ui/Badge';

export interface FichaIntegral2026Data {
  status: 'En progreso' | 'Completa' | 'Revisada';
  lastUpdated: string;
  updatedBy: string;

  // 1. DATOS GENERALES
  apellidosNombres: string;
  fechaNacimiento: string;
  edad: string;
  grado: string;
  colegio: string;
  lugarOcupaFamilia: string;
  nroHermanos: string;
  nombreMadre: string;
  edadMadre: string;
  gradoInstruccionMadre: string;
  profesionMadre: string;
  centroTrabajoMadre: string;
  nombrePadre: string;
  edadPadre: string;
  gradoInstruccionPadre: string;
  profesionPadre: string;
  centroTrabajoPadre: string;
  estadoCivil: string;
  religion: string;

  // 2. DATOS DEL DESARROLLO PSICOMOTOR Y HÁBITOS
  tiempoGestacion: string;
  tipoParto: string;
  complicacionesPerinatales1: string;
  cualComplicacionesPerinatales1: string;
  complicacionesPerinatales2: string;
  cualComplicacionesPerinatales2: string;
  complicacionesPostnatales: string;
  cualComplicacionesPostnatales: string;
  lactanciaMaterna: string;
  modalidadLactancia: string;
  edadDestete: string;
  motivosSigueLactando: string;
  sostuvoCabecita: string;
  seSentoSolo: string;
  seParoSolo: string;
  caminoSolo: string;
  primerasPalabras: string;
  dijoOraciones: string;
  hablaFluido: string;

  // 3. HÁBITOS DE ALIMENTACIÓN Y SUEÑO
  tomaBiberon: string;
  edadDejoBiberon: string;
  comportamientoAlComer: string;
  ambienteComer: string;
  conductasAlComer: {
    juega: boolean;
    veTV: boolean;
    usaCelular: boolean;
    camina: boolean;
    deboPerseguirlo: boolean;
  };
  otrosAlComer: string;
  apetito: string;
  otrosApetito: string;
  leDanDeComer: string;
  tomaSiestas: string;
  horarioSiestas: string;
  compartenLaboresDomesticas: string;
  dificultadesLaboresDomesticas: string;

  // 4. DINÁMICA FAMILIAR Y DISCIPLINA
  dialoganCoordinanDisciplina: string;
  acuerdosTomados: string;
  desautorizanFrenteNino: string;
  quienDesautorizaFrecuencia: string;
  familiarIntervieneConsentir: string;
  quienYQueOcurre: string;
  accionPataletas: string;
  comportamientosInadecuados: string;
  correctivosFrecuentes: string;
  efectosCorrectivos: string;

  // 5. ANTECEDENTES ESCOLARES
  procesoAdaptacionInicial: string;
  problemasEscolares: {
    academicos: boolean;
    conductuales: boolean;
    emocionales: boolean;
    sociales: boolean;
  };
  descripcionProblemasEscolares: string;
  queMasGustaEscuela: string;
  queNoGustaEscuela: string;
  comoEsConTareas: string;
  comoManejaUtiles: string;
  relacionMaestra: string;

  // 6. ANTECEDENTES SOCIALES
  relacionCompaneros: string;
  tipoJuegos: string;
  porqueSueleEnojarse: string;
  queLoHaceFeliz: string;
  queLoEntristece: string;

  // 7. INTERESES Y PASATIEMPOS
  tiempoLibre: string;
}

const defaultFichaIntegralData: FichaIntegral2026Data = {
  status: 'En progreso',
  lastUpdated: new Date().toISOString(),
  updatedBy: 'Psicólogo Titular',

  apellidosNombres: '',
  fechaNacimiento: '',
  edad: '',
  grado: '',
  colegio: '',
  lugarOcupaFamilia: '',
  nroHermanos: '',
  nombreMadre: '',
  edadMadre: '',
  gradoInstruccionMadre: '',
  profesionMadre: '',
  centroTrabajoMadre: '',
  nombrePadre: '',
  edadPadre: '',
  gradoInstruccionPadre: '',
  profesionPadre: '',
  centroTrabajoPadre: '',
  estadoCivil: '',
  religion: '',

  tiempoGestacion: '',
  tipoParto: '',
  complicacionesPerinatales1: 'NO',
  cualComplicacionesPerinatales1: '',
  complicacionesPerinatales2: 'NO',
  cualComplicacionesPerinatales2: '',
  complicacionesPostnatales: 'NO',
  cualComplicacionesPostnatales: '',
  lactanciaMaterna: 'SI',
  modalidadLactancia: 'exclusiva',
  edadDestete: '',
  motivosSigueLactando: '',
  sostuvoCabecita: '',
  seSentoSolo: '',
  seParoSolo: '',
  caminoSolo: '',
  primerasPalabras: '',
  dijoOraciones: '',
  hablaFluido: '',

  tomaBiberon: 'NO',
  edadDejoBiberon: '',
  comportamientoAlComer: '',
  ambienteComer: '',
  conductasAlComer: {
    juega: false,
    veTV: false,
    usaCelular: false,
    camina: false,
    deboPerseguirlo: false,
  },
  otrosAlComer: '',
  apetito: 'bueno',
  otrosApetito: '',
  leDanDeComer: 'come solo',
  tomaSiestas: 'NO',
  horarioSiestas: '',
  compartenLaboresDomesticas: '',
  dificultadesLaboresDomesticas: '',

  dialoganCoordinanDisciplina: 'SI',
  acuerdosTomados: '',
  desautorizanFrenteNino: 'NO',
  quienDesautorizaFrecuencia: '',
  familiarIntervieneConsentir: 'NO',
  quienYQueOcurre: '',
  accionPataletas: '',
  comportamientosInadecuados: '',
  correctivosFrecuentes: '',
  efectosCorrectivos: '',

  procesoAdaptacionInicial: '',
  problemasEscolares: {
    academicos: false,
    conductuales: false,
    emocionales: false,
    sociales: false,
  },
  descripcionProblemasEscolares: '',
  queMasGustaEscuela: '',
  queNoGustaEscuela: '',
  comoEsConTareas: '',
  comoManejaUtiles: '',
  relacionMaestra: '',

  relacionCompaneros: '',
  tipoJuegos: '',
  porqueSueleEnojarse: '',
  queLoHaceFeliz: '',
  queLoEntristece: '',

  tiempoLibre: '',
};

interface FichaIntegral2026AnamnesisProps {
  patientId: string;
  patientData: any;
  onSaved?: () => void;
}

export default function FichaIntegral2026Anamnesis({
  patientId,
  patientData,
  onSaved,
}: FichaIntegral2026AnamnesisProps) {
  const [activeTab, setActiveTab] = useState<number>(1);
  const [formData, setFormData] = useState<FichaIntegral2026Data>(() => {
    // Inicializar con datos del paciente si existen
    const age = patientData?.birthDate
      ? String(new Date().getFullYear() - new Date(patientData.birthDate).getFullYear())
      : '';
    return {
      ...defaultFichaIntegralData,
      apellidosNombres: `${patientData?.lastName || ''} ${patientData?.firstName || ''}`.trim(),
      fechaNacimiento: patientData?.birthDate
        ? new Date(patientData.birthDate).toISOString().slice(0, 10)
        : '',
      edad: age,
    };
  });

  const [saving, setSaving] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<string>('Guardado');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  // Cargar datos previos si están guardados en la base de datos
  useEffect(() => {
    if (patientData?.clinicalHistory?.clinicalObservations) {
      try {
        const obs = patientData.clinicalHistory.clinicalObservations;
        if (obs.trim().startsWith('{')) {
          const parsed = JSON.parse(obs);
          if (parsed.apellidosNombres || parsed.tiempoGestacion) {
            setFormData((prev) => ({ ...prev, ...parsed }));
          }
        }
      } catch (e) {
        console.warn('Error al cargar datos previos de la ficha:', e);
      }
    }
  }, [patientData]);

  // Guardado Automático cada 45 segundos si hay cambios
  useEffect(() => {
    const timer = setInterval(() => {
      handleSave(true);
    }, 45000);
    return () => clearInterval(timer);
  }, [formData]);

  const handleSave = async (isAuto = false) => {
    if (isAuto) setAutoSaveStatus('Guardando...');
    else setSaving(true);

    try {
      const updatedData = {
        ...formData,
        lastUpdated: new Date().toISOString(),
      };

      const res = await fetch(`/api/patients/${patientId}/history`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reasonForConsultation: formData.accionPataletas || 'Evaluación de Anamnesis - Ficha Integral 2026',
          personalBackground: `Desarrollo: Gestación ${formData.tiempoGestacion}. Parto ${formData.tipoParto}. Hitos: Cabecita (${formData.sostuvoCabecita}), Caminó (${formData.caminoSolo}).`,
          familyBackground: `Padres: Madre (${formData.nombreMadre}, ${formData.edadMadre} a. ${formData.profesionMadre}), Padre (${formData.nombrePadre}, ${formData.edadPadre} a. ${formData.profesionPadre}). Estado Civil: ${formData.estadoCivil}`,
          educationalHistory: `Colegio: ${formData.colegio}, Grado: ${formData.grado}. Adaptación: ${formData.procesoAdaptacionInicial}`,
          clinicalObservations: JSON.stringify(updatedData),
        }),
      });

      if (res.ok) {
        setAutoSaveStatus('Guardado automáticamente');
        if (!isAuto) {
          setSaveSuccessMsg('Anamnesis guardada correctamente.');
          if (onSaved) onSaved();
          setTimeout(() => setSaveSuccessMsg(null), 4000);
        }
      }
    } catch (err) {
      console.error('Error al guardar Ficha Integral 2026:', err);
      setAutoSaveStatus('Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    handleSave(true);
    setTimeout(() => {
      window.print();
    }, 200);
  };

  const tabs = [
    { id: 1, name: '1. Datos Generales', icon: User },
    { id: 2, name: '2. Desarrollo Psicomotor', icon: Heart },
    { id: 3, name: '3. Alimentación y Sueño', icon: Utensils },
    { id: 4, name: '4. Dinámica Familiar', icon: Home },
    { id: 5, name: '5. Antecedentes Escolares', icon: GraduationCap },
    { id: 6, name: '6. Antecedentes Sociales', icon: Users },
    { id: 7, name: '7. Intereses y Pasatiempos', icon: Smile },
    { id: 8, name: '8. Revisión Final & PDF', icon: FileText },
  ];

  return (
    <div className="space-y-6">
      {/* Encabezado Superior de Psicolobos con Metadatos del Paciente */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4 print:hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="indigo">Ficha Institucional 2026</Badge>

              <span className="text-xs text-slate-500 font-medium">
                Estado:{' '}
                <strong
                  className={`ml-1 ${
                    formData.status === 'Completa'
                      ? 'text-emerald-600'
                      : formData.status === 'Revisada'
                      ? 'text-indigo-600'
                      : 'text-amber-600'
                  }`}
                >
                  {formData.status}
                </strong>
              </span>
            </div>

            <h2 className="text-lg font-bold text-slate-900 mt-1 flex items-center gap-2">
              <span>Anamnesis e Historia Clínica — Ficha Integral 2026</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Paciente: <strong>{patientData?.firstName} {patientData?.lastName}</strong> • Profesional Responsable: <strong>{patientData?.psychologist?.firstName ? `${patientData.psychologist.firstName} ${patientData.psychologist.lastName}` : 'Dra. Elena Vargas'}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] text-slate-400 font-mono mr-2 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {autoSaveStatus}
            </span>

            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="px-4 py-2 bg-[#484496] hover:bg-[#393478] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Guardando...' : 'Guardar Cambios'}</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Descargar Hoja Rellenada (PDF)</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-2xs transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir</span>
            </button>
          </div>
        </div>

        {saveSuccessMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {/* Pestañas de Navegación por las 8 Secciones */}
        <div className="flex overflow-x-auto gap-1.5 pb-1">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#484496] text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#484496]'}`} />
                <span>{t.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* DOCUMENTO OFICIAL DE LA ANAMNESIS CON EL ENCABEZADO INSTITUCIONAL ORIGINAL */}
      <div
        id="anamnesis-printable-document"
        ref={printRef}
        className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 space-y-6 max-w-4xl mx-auto print:p-0 print:border-none print:shadow-none font-sans text-slate-900"
      >
        {/* ENCABEZADO INSTITUCIONAL IDÉNTICO AL DOCUMENTO FUENTE ORIGINAL */}
        <div className="border-b-2 border-slate-900 pb-4 mb-6">
          <div className="flex flex-col items-center justify-center space-y-2">
            <img
              src="/images/logo-header-pdf.jpg"
              alt="Municipalidad de Chorrillos - OMAPED"
              className="w-full max-w-4xl h-auto object-contain max-h-24 print:max-h-20"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/logo-header-chorrillos-omaped.png';
              }}
            />
            <div className="text-center font-serif mt-1">
              <h1 className="text-base font-extrabold tracking-widest text-slate-900 uppercase">ANAMNESIS</h1>
              <h2 className="text-xs font-bold tracking-widest text-slate-800 uppercase mt-0.5">FICHA INTEGRAL 2026</h2>
            </div>
          </div>
        </div>

        {/* SECCIÓN 1: DATOS GENERALES */}
        <div className={activeTab === 1 ? 'space-y-4' : 'hidden print:block print:space-y-4 print:mt-6'}>
          <h3 className="text-sm font-bold text-center uppercase tracking-wider text-slate-900 border-b pb-1">
            DATOS GENERALES
          </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="md:col-span-2">
                <label className="block font-bold text-slate-800 mb-1">Apellidos y Nombres:</label>
                <input
                  type="text"
                  value={formData.apellidosNombres}
                  onChange={(e) => setFormData({ ...formData, apellidosNombres: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">fecha de nacimiento:</label>
                <input
                  type="date"
                  value={formData.fechaNacimiento}
                  onChange={(e) => setFormData({ ...formData, fechaNacimiento: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">edad:</label>
                  <input
                    type="text"
                    value={formData.edad}
                    onChange={(e) => setFormData({ ...formData, edad: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">grado:</label>
                  <input
                    type="text"
                    value={formData.grado}
                    onChange={(e) => setFormData({ ...formData, grado: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block font-bold text-slate-800 mb-1">Colegio:</label>
                <input
                  type="text"
                  value={formData.colegio}
                  onChange={(e) => setFormData({ ...formData, colegio: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Lugar que ocupa en la familia:</label>
                <input
                  type="text"
                  value={formData.lugarOcupaFamilia}
                  onChange={(e) => setFormData({ ...formData, lugarOcupaFamilia: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Nro. de hermanos:</label>
                <input
                  type="text"
                  value={formData.nroHermanos}
                  onChange={(e) => setFormData({ ...formData, nroHermanos: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              {/* Madre */}
              <div className="md:col-span-2 border-t pt-3 mt-2 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <label className="block font-bold text-slate-800 mb-1">Nombre de la madre:</label>
                  <input
                    type="text"
                    value={formData.nombreMadre}
                    onChange={(e) => setFormData({ ...formData, nombreMadre: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">edad:</label>
                  <input
                    type="text"
                    value={formData.edadMadre}
                    onChange={(e) => setFormData({ ...formData, edadMadre: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Grado de instrucción:</label>
                  <input
                    type="text"
                    value={formData.gradoInstruccionMadre}
                    onChange={(e) => setFormData({ ...formData, gradoInstruccionMadre: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Profesión:</label>
                  <input
                    type="text"
                    value={formData.profesionMadre}
                    onChange={(e) => setFormData({ ...formData, profesionMadre: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Centro de trabajo:</label>
                  <input
                    type="text"
                    value={formData.centroTrabajoMadre}
                    onChange={(e) => setFormData({ ...formData, centroTrabajoMadre: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              {/* Padre */}
              <div className="md:col-span-2 border-t pt-3 mt-2 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <label className="block font-bold text-slate-800 mb-1">Nombre del padre:</label>
                  <input
                    type="text"
                    value={formData.nombrePadre}
                    onChange={(e) => setFormData({ ...formData, nombrePadre: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">edad:</label>
                  <input
                    type="text"
                    value={formData.edadPadre}
                    onChange={(e) => setFormData({ ...formData, edadPadre: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Grado de instrucción:</label>
                  <input
                    type="text"
                    value={formData.gradoInstruccionPadre}
                    onChange={(e) => setFormData({ ...formData, gradoInstruccionPadre: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Profesión:</label>
                  <input
                    type="text"
                    value={formData.profesionPadre}
                    onChange={(e) => setFormData({ ...formData, profesionPadre: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Centro de trabajo:</label>
                  <input
                    type="text"
                    value={formData.centroTrabajoPadre}
                    onChange={(e) => setFormData({ ...formData, centroTrabajoPadre: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              {/* Estado Civil & Religión */}
              <div className="md:col-span-2 border-t pt-3 mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-2">Estado civil:</label>
                  <div className="flex flex-wrap gap-3">
                    {['Casados', 'Solteros', 'Separado', 'Divorciados', 'Convivientes', 'Viudo'].map((est) => (
                      <label key={est} className="flex items-center gap-1.5 text-xs text-slate-800 cursor-pointer">
                        <input
                          type="radio"
                          name="estadoCivil"
                          value={est}
                          checked={formData.estadoCivil === est}
                          onChange={(e) => setFormData({ ...formData, estadoCivil: e.target.value })}
                          className="text-[#484496] focus:ring-[#484496]"
                        />
                        <span>{est}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Religión:</label>
                  <input
                    type="text"
                    value={formData.religion}
                    onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>

        {/* SECCIÓN 2: DATOS DEL DESARROLLO PSICOMOTOR Y HÁBITOS */}
        <div className={activeTab === 2 ? 'space-y-4 text-xs' : 'hidden print:block print:space-y-4 print:text-xs print:mt-6'}>
          <h3 className="text-sm font-bold text-center uppercase tracking-wider text-slate-900 border-b pb-1">
            DATOS DEL DESARROLLO PSICOMOTOR Y HÁBITOS
          </h3>

            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-800 mb-1">¿A qué tiempo de gestación dio a luz?:</label>
                <input
                  type="text"
                  value={formData.tiempoGestacion}
                  onChange={(e) => setFormData({ ...formData, tiempoGestacion: e.target.value })}
                  placeholder="Ej. 39 semanas / 9 meses"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-2">Tipo de parto:</label>
                <div className="flex flex-wrap gap-4">
                  {[
                    { id: 'normal', label: 'normal' },
                    { id: 'instrumental', label: 'con uso de instrumental' },
                    { id: 'cesarea', label: 'Cesárea programada' },
                    { id: 'emergencia', label: 'de emergencia' },
                  ].map((item) => (
                    <label key={item.id} className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="tipoParto"
                        value={item.id}
                        checked={formData.tipoParto === item.id}
                        onChange={(e) => setFormData({ ...formData, tipoParto: e.target.value })}
                        className="text-[#484496]"
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Complicaciones perinatales 1 (Conservar duplicado exacto del PDF) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center border-t pt-2">
                <div>
                  <label className="font-bold text-slate-800">Complicaciones perinatales:</label>
                  <div className="flex gap-4 mt-1">
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="compPer1"
                        value="SI"
                        checked={formData.complicacionesPerinatales1 === 'SI'}
                        onChange={(e) => setFormData({ ...formData, complicacionesPerinatales1: e.target.value })}
                      />
                      <span>(SI)</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="compPer1"
                        value="NO"
                        checked={formData.complicacionesPerinatales1 === 'NO'}
                        onChange={(e) => setFormData({ ...formData, complicacionesPerinatales1: e.target.value })}
                      />
                      <span>(NO)</span>
                    </label>
                  </div>
                </div>
                {formData.complicacionesPerinatales1 === 'SI' && (
                  <div className="md:col-span-2">
                    <label className="font-bold text-slate-800 block mb-1">Cuál?</label>
                    <input
                      type="text"
                      value={formData.cualComplicacionesPerinatales1}
                      onChange={(e) => setFormData({ ...formData, cualComplicacionesPerinatales1: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>
                )}
              </div>

              {/* Complicaciones perinatales 2 (Conservar repetición original del PDF) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center border-t pt-2">
                <div>
                  <label className="font-bold text-slate-800">Complicaciones perinatales:</label>
                  <div className="flex gap-4 mt-1">
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="compPer2"
                        value="SI"
                        checked={formData.complicacionesPerinatales2 === 'SI'}
                        onChange={(e) => setFormData({ ...formData, complicacionesPerinatales2: e.target.value })}
                      />
                      <span>(SI)</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="compPer2"
                        value="NO"
                        checked={formData.complicacionesPerinatales2 === 'NO'}
                        onChange={(e) => setFormData({ ...formData, complicacionesPerinatales2: e.target.value })}
                      />
                      <span>(NO)</span>
                    </label>
                  </div>
                </div>
                {formData.complicacionesPerinatales2 === 'SI' && (
                  <div className="md:col-span-2">
                    <label className="font-bold text-slate-800 block mb-1">Cuál?</label>
                    <input
                      type="text"
                      value={formData.cualComplicacionesPerinatales2}
                      onChange={(e) => setFormData({ ...formData, cualComplicacionesPerinatales2: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>
                )}
              </div>

              {/* Complicaciones postnatales */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center border-t pt-2">
                <div>
                  <label className="font-bold text-slate-800">Complicaciones postnatales:</label>
                  <div className="flex gap-4 mt-1">
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="compPost"
                        value="SI"
                        checked={formData.complicacionesPostnatales === 'SI'}
                        onChange={(e) => setFormData({ ...formData, complicacionesPostnatales: e.target.value })}
                      />
                      <span>(SI)</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="compPost"
                        value="NO"
                        checked={formData.complicacionesPostnatales === 'NO'}
                        onChange={(e) => setFormData({ ...formData, complicacionesPostnatales: e.target.value })}
                      />
                      <span>(NO)</span>
                    </label>
                  </div>
                </div>
                {formData.complicacionesPostnatales === 'SI' && (
                  <div className="md:col-span-2">
                    <label className="font-bold text-slate-800 block mb-1">Cuál?</label>
                    <input
                      type="text"
                      value={formData.cualComplicacionesPostnatales}
                      onChange={(e) => setFormData({ ...formData, cualComplicacionesPostnatales: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>
                )}
              </div>

              {/* Lactancia */}
              <div className="border-t pt-3 space-y-2">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="font-bold text-slate-800">¿Ha tenido lactancia materna?:</span>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="lacMat"
                      value="SI"
                      checked={formData.lactanciaMaterna === 'SI'}
                      onChange={(e) => setFormData({ ...formData, lactanciaMaterna: e.target.value })}
                    />
                    <span>(SI)</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="lacMat"
                      value="NO"
                      checked={formData.lactanciaMaterna === 'NO'}
                      onChange={(e) => setFormData({ ...formData, lactanciaMaterna: e.target.value })}
                    />
                    <span>(NO)</span>
                  </label>

                  <span className="ml-4 font-bold text-slate-800">Modalidad:</span>
                  {['exclusiva', 'mixta', 'artificial'].map((m) => (
                    <label key={m} className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="modLac"
                        value={m}
                        checked={formData.modalidadLactancia === m}
                        onChange={(e) => setFormData({ ...formData, modalidadLactancia: e.target.value })}
                      />
                      <span>{m}</span>
                    </label>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="font-bold text-slate-800 block mb-1">Edad del destete:</label>
                    <input
                      type="text"
                      value={formData.edadDestete}
                      onChange={(e) => setFormData({ ...formData, edadDestete: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-800 block mb-1">Si aún sigue lactando, preguntar los motivos:</label>
                    <input
                      type="text"
                      value={formData.motivosSigueLactando}
                      onChange={(e) => setFormData({ ...formData, motivosSigueLactando: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Hitos del desarrollo */}
              <div className="border-t pt-3 space-y-3">
                <span className="font-bold text-slate-900 block text-xs uppercase tracking-wide">¿A qué edad?:</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { key: 'sostuvoCabecita', label: 'Sostuvo la cabecita' },
                    { key: 'seSentoSolo', label: 'Se sentó solo' },
                    { key: 'seParoSolo', label: 'Se paró solo' },
                    { key: 'caminoSolo', label: 'Caminó solo' },
                    { key: 'primerasPalabras', label: 'Dijo sus primeras palabras' },
                    { key: 'dijoOraciones', label: 'Dijo oraciones' },
                    { key: 'hablaFluido', label: 'Habla fluido' },
                  ].map((hito) => (
                    <div key={hito.key}>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">{hito.label}:</label>
                      <input
                        type="text"
                        value={(formData as any)[hito.key]}
                        onChange={(e) => setFormData({ ...formData, [hito.key]: e.target.value })}
                        placeholder="Ej. 6 meses"
                        className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        {/* SECCIÓN 3: HÁBITOS DE ALIMENTACIÓN Y SUEÑO */}
        <div className={activeTab === 3 ? 'space-y-4 text-xs' : 'hidden print:block print:space-y-4 print:text-xs print:mt-6'}>
          <h3 className="text-sm font-bold text-center uppercase tracking-wider text-slate-900 border-b pb-1">
            HÁBITOS DE ALIMENTACIÓN Y SUEÑO
          </h3>

            {/* Alimentación */}
            <div className="space-y-3">
              <span className="font-bold text-slate-900 block text-xs uppercase tracking-wide">Hábitos de alimentación:</span>

              <div className="flex flex-wrap items-center gap-4">
                <span className="font-bold text-slate-800">toma biberón:</span>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="tomaBib"
                    value="SI"
                    checked={formData.tomaBiberon === 'SI'}
                    onChange={(e) => setFormData({ ...formData, tomaBiberon: e.target.value })}
                  />
                  <span>(SI)</span>
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="tomaBib"
                    value="NO"
                    checked={formData.tomaBiberon === 'NO'}
                    onChange={(e) => setFormData({ ...formData, tomaBiberon: e.target.value })}
                  />
                  <span>(NO)</span>
                </label>

                <div className="flex items-center gap-2 ml-4">
                  <span className="font-bold text-slate-800">¿A qué edad dejo el biberón?:</span>
                  <input
                    type="text"
                    value={formData.edadDejoBiberon}
                    onChange={(e) => setFormData({ ...formData, edadDejoBiberon: e.target.value })}
                    className="p-1.5 bg-slate-50 border border-slate-300 rounded-lg w-32"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">¿Cómo se comporta su niño(a) a la hora de comer?:</label>
                <textarea
                  rows={2}
                  value={formData.comportamientoAlComer}
                  onChange={(e) => setFormData({ ...formData, comportamientoAlComer: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Ambiente de la casa donde habitualmente, toma sus alimentos:</label>
                <input
                  type="text"
                  value={formData.ambienteComer}
                  onChange={(e) => setFormData({ ...formData, ambienteComer: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-2">A la hora de comer:</label>
                <div className="flex flex-wrap gap-4">
                  {[
                    { key: 'juega', label: 'juega' },
                    { key: 'veTV', label: 've TV' },
                    { key: 'usaCelular', label: 'usa celular' },
                    { key: 'camina', label: 'camina' },
                    { key: 'deboPerseguirlo', label: 'debo perseguirlo' },
                  ].map((item) => (
                    <label key={item.key} className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(formData.conductasAlComer as any)[item.key]}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            conductasAlComer: { ...formData.conductasAlComer, [item.key]: e.target.checked },
                          })
                        }
                        className="text-[#484496] rounded-xs"
                      />
                      <span>({item.label})</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Otros:</label>
                <input
                  type="text"
                  value={formData.otrosAlComer}
                  onChange={(e) => setFormData({ ...formData, otrosAlComer: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-2">Su apetito es:</label>
                <div className="flex flex-wrap gap-3">
                  {['bueno', 'variable', 'selectivo', 'come solo papillas', 'otros'].map((ap) => (
                    <label key={ap} className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="apetito"
                        value={ap}
                        checked={formData.apetito === ap}
                        onChange={(e) => setFormData({ ...formData, apetito: e.target.value })}
                      />
                      <span>{ap}</span>
                    </label>
                  ))}
                </div>
                {formData.apetito === 'otros' && (
                  <input
                    type="text"
                    value={formData.otrosApetito}
                    onChange={(e) => setFormData({ ...formData, otrosApetito: e.target.value })}
                    placeholder="Especificar apetito..."
                    className="w-full mt-2 p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-2">Le dan de comer:</label>
                <div className="flex flex-wrap gap-4">
                  {['le dan de comer', 'come con ayuda', 'come solo'].map((ldc) => (
                    <label key={ldc} className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="leDanDeComer"
                        value={ldc}
                        checked={formData.leDanDeComer === ldc}
                        onChange={(e) => setFormData({ ...formData, leDanDeComer: e.target.value })}
                      />
                      <span>({ldc})</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Sueño y Labores */}
            <div className="border-t pt-4 space-y-3">
              <span className="font-bold text-slate-900 block text-xs uppercase tracking-wide">Hábitos de sueño:</span>

              <div className="flex items-center gap-4">
                <span className="font-bold text-slate-800">¿Toma siestas?:</span>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="tomaSiest"
                    value="SI"
                    checked={formData.tomaSiestas === 'SI'}
                    onChange={(e) => setFormData({ ...formData, tomaSiestas: e.target.value })}
                  />
                  <span>(SI)</span>
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="tomaSiest"
                    value="NO"
                    checked={formData.tomaSiestas === 'NO'}
                    onChange={(e) => setFormData({ ...formData, tomaSiestas: e.target.value })}
                  />
                  <span>(NO)</span>
                </label>

                {formData.tomaSiestas === 'SI' && (
                  <div className="flex items-center gap-2 ml-4">
                    <span className="font-bold text-slate-800">horario:</span>
                    <input
                      type="text"
                      value={formData.horarioSiestas}
                      onChange={(e) => setFormData({ ...formData, horarioSiestas: e.target.value })}
                      className="p-1.5 bg-slate-50 border border-slate-300 rounded-lg w-40"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">¿Comparten labores y responsabilidades domésticas?:</label>
                <textarea
                  rows={2}
                  value={formData.compartenLaboresDomesticas}
                  onChange={(e) => setFormData({ ...formData, compartenLaboresDomesticas: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Dificultades al realizar las labores domésticas:</label>
                <textarea
                  rows={2}
                  value={formData.dificultadesLaboresDomesticas}
                  onChange={(e) => setFormData({ ...formData, dificultadesLaboresDomesticas: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>
            </div>
          </div>

        {/* SECCIÓN 4: DINÁMICA FAMILIAR Y DISCIPLINA */}
        <div className={activeTab === 4 ? 'space-y-4 text-xs' : 'hidden print:block print:space-y-4 print:text-xs print:mt-6'}>
          <h3 className="text-sm font-bold text-center uppercase tracking-wider text-slate-900 border-b pb-1">
            DINÁMICA FAMILIAR Y DISCIPLINA
          </h3>

            <div className="space-y-3">
              <div>
                <div className="flex items-center gap-4 mb-1">
                  <label className="font-bold text-slate-800">¿Ambos padres dialogan y coordinan respecto a la disciplina?:</label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="dialCoord"
                      value="SI"
                      checked={formData.dialoganCoordinanDisciplina === 'SI'}
                      onChange={(e) => setFormData({ ...formData, dialoganCoordinanDisciplina: e.target.value })}
                    />
                    <span>(SI)</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="dialCoord"
                      value="NO"
                      checked={formData.dialoganCoordinanDisciplina === 'NO'}
                      onChange={(e) => setFormData({ ...formData, dialoganCoordinanDisciplina: e.target.value })}
                    />
                    <span>(NO)</span>
                  </label>
                </div>
                <label className="block font-bold text-slate-800 mb-1">Acuerdos tomados:</label>
                <textarea
                  rows={2}
                  value={formData.acuerdosTomados}
                  onChange={(e) => setFormData({ ...formData, acuerdosTomados: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="border-t pt-2">
                <div className="flex items-center gap-4 mb-1">
                  <label className="font-bold text-slate-800">¿Se desautorizan frente al niño?:</label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="desaut"
                      value="SI"
                      checked={formData.desautorizanFrenteNino === 'SI'}
                      onChange={(e) => setFormData({ ...formData, desautorizanFrenteNino: e.target.value })}
                    />
                    <span>(SI)</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="desaut"
                      value="NO"
                      checked={formData.desautorizanFrenteNino === 'NO'}
                      onChange={(e) => setFormData({ ...formData, desautorizanFrenteNino: e.target.value })}
                    />
                    <span>(NO)</span>
                  </label>
                </div>
                {formData.desautorizanFrenteNino === 'SI' && (
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">¿Quién desautoriza con frecuencia?:</label>
                    <input
                      type="text"
                      value={formData.quienDesautorizaFrecuencia}
                      onChange={(e) => setFormData({ ...formData, quienDesautorizaFrecuencia: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>
                )}
              </div>

              <div className="border-t pt-2">
                <div className="flex items-center gap-4 mb-1">
                  <label className="font-bold text-slate-800">¿Algún familiar interviene para consentirlo?:</label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="famCons"
                      value="SI"
                      checked={formData.familiarIntervieneConsentir === 'SI'}
                      onChange={(e) => setFormData({ ...formData, familiarIntervieneConsentir: e.target.value })}
                    />
                    <span>(SI)</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="famCons"
                      value="NO"
                      checked={formData.familiarIntervieneConsentir === 'NO'}
                      onChange={(e) => setFormData({ ...formData, familiarIntervieneConsentir: e.target.value })}
                    />
                    <span>(NO)</span>
                  </label>
                </div>
                {formData.familiarIntervieneConsentir === 'SI' && (
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">¿Quién y qué ocurre?:</label>
                    <textarea
                      rows={2}
                      value={formData.quienYQueOcurre}
                      onChange={(e) => setFormData({ ...formData, quienYQueOcurre: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>
                )}
              </div>

              <div className="border-t pt-2 space-y-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Si el niño hace pataletas o no cumple lo indicado ¿cómo actúan?:</label>
                  <textarea
                    rows={2}
                    value={formData.accionPataletas}
                    onChange={(e) => setFormData({ ...formData, accionPataletas: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">¿Qué comportamientos inadecuados presenta su niño(a)?:</label>
                  <textarea
                    rows={2}
                    value={formData.comportamientosInadecuados}
                    onChange={(e) => setFormData({ ...formData, comportamientosInadecuados: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">¿Qué correctivos usan frecuentemente?:</label>
                  <textarea
                    rows={2}
                    value={formData.correctivosFrecuentes}
                    onChange={(e) => setFormData({ ...formData, correctivosFrecuentes: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">¿Qué efectos tienen los correctivos en su hijo(a)?:</label>
                  <textarea
                    rows={2}
                    value={formData.efectosCorrectivos}
                    onChange={(e) => setFormData({ ...formData, efectosCorrectivos: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>

        {/* SECCIÓN 5: ANTECEDENTES ESCOLARES */}
        <div className={activeTab === 5 ? 'space-y-4 text-xs' : 'hidden print:block print:space-y-4 print:text-xs print:mt-6'}>
          <h3 className="text-sm font-bold text-center uppercase tracking-wider text-slate-900 border-b pb-1">
            ANTECEDENTES ESCOLARES
          </h3>

            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-800 mb-1">¿Cómo fue el proceso de adaptación en el nivel inicial?:</label>
                <textarea
                  rows={2}
                  value={formData.procesoAdaptacionInicial}
                  onChange={(e) => setFormData({ ...formData, procesoAdaptacionInicial: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-2">Problemas escolares (académicos, conductuales, emocionales, sociales):</label>
                <div className="flex flex-wrap gap-4 mb-2">
                  {[
                    { key: 'academicos', label: 'académicos' },
                    { key: 'conductuales', label: 'conductuales' },
                    { key: 'emocionales', label: 'emocionales' },
                    { key: 'sociales', label: 'sociales' },
                  ].map((p) => (
                    <label key={p.key} className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(formData.problemasEscolares as any)[p.key]}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            problemasEscolares: { ...formData.problemasEscolares, [p.key]: e.target.checked },
                          })
                        }
                        className="text-[#484496] rounded-xs"
                      />
                      <span>({p.label})</span>
                    </label>
                  ))}
                </div>
                <input
                  type="text"
                  value={formData.descripcionProblemasEscolares}
                  onChange={(e) => setFormData({ ...formData, descripcionProblemasEscolares: e.target.value })}
                  placeholder="Detalle de los problemas escolares observados..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">¿Qué es lo que más le gusta de la escuela?:</label>
                <textarea
                  rows={2}
                  value={formData.queMasGustaEscuela}
                  onChange={(e) => setFormData({ ...formData, queMasGustaEscuela: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">¿Qué es lo que no le gusta de la escuela?:</label>
                <textarea
                  rows={2}
                  value={formData.queNoGustaEscuela}
                  onChange={(e) => setFormData({ ...formData, queNoGustaEscuela: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">¿Cómo es con sus tareas?:</label>
                  <input
                    type="text"
                    value={formData.comoEsConTareas}
                    onChange={(e) => setFormData({ ...formData, comoEsConTareas: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">¿Cómo maneja sus útiles escolares?:</label>
                  <input
                    type="text"
                    value={formData.comoManejaUtiles}
                    onChange={(e) => setFormData({ ...formData, comoManejaUtiles: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">¿Cómo se relaciona con la maestra?:</label>
                <textarea
                  rows={2}
                  value={formData.relacionMaestra}
                  onChange={(e) => setFormData({ ...formData, relacionMaestra: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>
            </div>
          </div>

        {/* SECCIÓN 6: ANTECEDENTES SOCIALES */}
        <div className={activeTab === 6 ? 'space-y-4 text-xs' : 'hidden print:block print:space-y-4 print:text-xs print:mt-6'}>
          <h3 className="text-sm font-bold text-center uppercase tracking-wider text-slate-900 border-b pb-1">
            ANTECEDENTES SOCIALES
          </h3>

            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-800 mb-1">¿Cómo se relaciona con sus compañeros?:</label>
                <textarea
                  rows={2}
                  value={formData.relacionCompaneros}
                  onChange={(e) => setFormData({ ...formData, relacionCompaneros: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">¿Qué tipo de juegos realiza? (con niños y niñas):</label>
                <textarea
                  rows={2}
                  value={formData.tipoJuegos}
                  onChange={(e) => setFormData({ ...formData, tipoJuegos: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">¿por qué suele enojarse? ¿Cómo reacciona?:</label>
                <textarea
                  rows={2}
                  value={formData.porqueSueleEnojarse}
                  onChange={(e) => setFormData({ ...formData, porqueSueleEnojarse: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">¿Qué lo hace feliz? ¿Cómo reacciona?:</label>
                <textarea
                  rows={2}
                  value={formData.queLoHaceFeliz}
                  onChange={(e) => setFormData({ ...formData, queLoHaceFeliz: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">¿Qué lo entristece? ¿Cómo reacciona?:</label>
                <textarea
                  rows={2}
                  value={formData.queLoEntristece}
                  onChange={(e) => setFormData({ ...formData, queLoEntristece: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>
            </div>
          </div>

        {/* SECCIÓN 7: INTERESES Y PASATIEMPOS */}
        <div className={activeTab === 7 ? 'space-y-4 text-xs' : 'hidden print:block print:space-y-4 print:text-xs print:mt-6'}>
          <h3 className="text-sm font-bold text-center uppercase tracking-wider text-slate-900 border-b pb-1">
            INTERESES Y PASATIEMPOS
          </h3>

            <div>
              <label className="block font-bold text-slate-800 mb-1">¿Qué hace en su tiempo libre?:</label>
              <textarea
                rows={5}
                value={formData.tiempoLibre}
                onChange={(e) => setFormData({ ...formData, tiempoLibre: e.target.value })}
                placeholder="Descripción de actividades recreativas, pasatiempos e intereses..."
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-sans"
              />
            </div>
          </div>

        {/* SECCIÓN 8: REVISIÓN FINAL & REPORT GENERATION */}
        {activeTab === 8 && (
          <div className="space-y-6 text-xs print:space-y-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 print:hidden space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Resumen de Estado y Generación del Documento Final
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Revisa el estado de llenado de las 7 secciones del documento original "ANAMNESIS - FICHA INTEGRAL 2026". El PDF impreso conservará fielmente el encabezado institucional original con los logotipos de la Municipalidad de Chorrillos y OMAPED.
              </p>

              <div className="flex items-center gap-3 pt-2 flex-wrap">
                <button
                  onClick={() => setFormData({ ...formData, status: 'Completa' })}
                  className="px-3.5 py-1.5 bg-emerald-600 text-white font-bold rounded-lg text-xs"
                >
                  Marcar como Completa
                </button>
                <button
                  onClick={() => setFormData({ ...formData, status: 'Revisada' })}
                  className="px-3.5 py-1.5 bg-[#484496] text-white font-bold rounded-lg text-xs"
                >
                  Marcar como Revisada
                </button>
                <button
                  onClick={handleDownloadPdf}
                  className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar Hoja Rellenada (PDF)</span>
                </button>
              </div>
            </div>

            {/* Vista Previa del Documento Completo Impreso / Exportable */}
            <div className="space-y-4 border-t pt-4">
              <div className="text-center space-y-1">
                <span className="font-bold text-slate-900 uppercase">RESUMEN CONSOLIDADO DE LA FICHA INTEGRAL 2026</span>
                <p className="text-[11px] text-slate-500">Paciente: {formData.apellidosNombres || 'N/A'}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] leading-relaxed">
                <div className="p-3 bg-slate-50 rounded-xl border">
                  <span className="font-bold block text-slate-900 border-b pb-1 mb-1">1. DATOS GENERALES</span>
                  <p><strong>Apellidos y Nombres:</strong> {formData.apellidosNombres}</p>
                  <p><strong>Nacimiento:</strong> {formData.fechaNacimiento} | <strong>Edad:</strong> {formData.edad}</p>
                  <p><strong>Colegio:</strong> {formData.colegio} | <strong>Grado:</strong> {formData.grado}</p>
                  <p><strong>Madre:</strong> {formData.nombreMadre} ({formData.edadMadre} a. {formData.profesionMadre})</p>
                  <p><strong>Padre:</strong> {formData.nombrePadre} ({formData.edadPadre} a. {formData.profesionPadre})</p>
                  <p><strong>Estado Civil:</strong> {formData.estadoCivil} | <strong>Religión:</strong> {formData.religion}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border">
                  <span className="font-bold block text-slate-900 border-b pb-1 mb-1">2. DESARROLLO Y HÁBITOS</span>
                  <p><strong>Gestación:</strong> {formData.tiempoGestacion} | <strong>Parto:</strong> {formData.tipoParto}</p>
                  <p><strong>Lactancia:</strong> {formData.lactanciaMaterna} ({formData.modalidadLactancia}) | <strong>Destete:</strong> {formData.edadDestete}</p>
                  <p><strong>Hitos:</strong> Cabeza ({formData.sostuvoCabecita}), Paró ({formData.seParoSolo}), Caminó ({formData.caminoSolo}), Palabras ({formData.primerasPalabras})</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border">
                  <span className="font-bold block text-slate-900 border-b pb-1 mb-1">3. ALIMENTACIÓN Y SUEÑO</span>
                  <p><strong>Biberón:</strong> {formData.tomaBiberon} (Dejó: {formData.edadDejoBiberon})</p>
                  <p><strong>Conducta al comer:</strong> {formData.comportamientoAlComer || 'Sin especificar'}</p>
                  <p><strong>Apetito:</strong> {formData.apetito} | <strong>Siestas:</strong> {formData.tomaSiestas}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border">
                  <span className="font-bold block text-slate-900 border-b pb-1 mb-1">4. DINÁMICA FAMILIAR</span>
                  <p><strong>Disciplina coordinada:</strong> {formData.dialoganCoordinanDisciplina}</p>
                  <p><strong>Acción ante pataletas:</strong> {formData.accionPataletas || 'Sin registrar'}</p>
                  <p><strong>Correctivos:</strong> {formData.correctivosFrecuentes || 'Sin registrar'}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border md:col-span-2">
                  <span className="font-bold block text-slate-900 border-b pb-1 mb-1">5. ESCOLAR, SOCIAL E INTERESES</span>
                  <p><strong>Adaptación Inicial:</strong> {formData.procesoAdaptacionInicial || 'Sin registrar'}</p>
                  <p><strong>Relación compañeros:</strong> {formData.relacionCompaneros || 'Sin registrar'}</p>
                  <p><strong>Tiempo Libre:</strong> {formData.tiempoLibre || 'Sin registrar'}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
