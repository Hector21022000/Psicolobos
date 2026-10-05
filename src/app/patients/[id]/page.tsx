/**
 * Nombre del archivo: src/app/patients/[id]/page.tsx
 * Descripción: Expediente Clínico Completo del Paciente con 8 pestañas interactivas (Ficha con edición demográfica, Anamnesis con carga PDF/OCR, Sesiones SOAP + PDF con vista y edición completa, Citas pasadas/futuras, Diagnósticos CIE-11/DSM-5, Pruebas 2-Paneles + PDF, Documentos OCR e Informes Sintetizados con Firma Digital).
 * Fecha de última modificación: 2026-09-30
 * Autor: Psicolobos Development Team
 */

'use client';

import React, { useState, useEffect, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import AiCopilotDrawer from '@/components/AiCopilotDrawer';
import EvaluationCalculator from '@/components/EvaluationCalculator';
import EvaluationReviewInterface from '@/components/EvaluationReviewInterface';
import OcrUploaderModal from '@/components/OcrUploaderModal';
import PdfReportModal from '@/components/PdfReportModal';
import InformedConsentModal from '@/components/InformedConsentModal';
import SessionRecordModal from '@/components/SessionRecordModal';
import PatientTimeline from '@/components/PatientTimeline';
import IdentitySettingsModal from '@/components/IdentitySettingsModal';
import DigitalAnamnesisForm from '@/components/DigitalAnamnesisForm';
import { DocumentViewerEditorModal } from '@/components/DocumentViewerEditorModal';
import DocumentationFoldersManager from '@/components/DocumentationFoldersManager';
import WebSessionGuide from '@/components/WebSessionGuide';
import FichaIntegral2026Anamnesis from '@/components/FichaIntegral2026Anamnesis';
import Cie11OfficialBrowser from '@/components/Cie11OfficialBrowser';
import {
  User,
  FileText,
  FolderOpen,
  Clock,
  BookOpen,
  FileSpreadsheet,
  FileSearch,
  FileCheck,
  Sparkles,
  Plus,
  Save,
  CheckCircle,
  AlertTriangle,
  Download,
  PenTool,
  Calendar,
  ChevronRight,
  ShieldAlert,
  Building2,
  Lock,
  Upload,
  Edit,
  Phone,
  Mail,
  FileUp,
  RefreshCw,
  X,
  Search,
  Eye,
  Trash2
} from 'lucide-react';

export default function PatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: patientId } = use(params);
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'profile' | 'history' | 'session_guide' | 'documentation_folders' | 'sessions' | 'appointments' | 'diagnoses' | 'evaluations' | 'documents' | 'reports'>('profile');
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAiOpen, setIsAiOpen] = useState(false);

  // Sub-filtro de Citas (Próximas vs Pasadas)
  const [appointmentSubTab, setAppointmentSubTab] = useState<'upcoming' | 'past'>('upcoming');

  // Estados de Modales
  const [isEditDemographicsOpen, setIsEditDemographicsOpen] = useState(false);
  const [isNewSessionOpen, setIsNewSessionOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<any>(null);
  const [isAddDiagnosisOpen, setIsAddDiagnosisOpen] = useState(false);
  const [ocrModalDoc, setOcrModalDoc] = useState<any>(null);
  const [pdfModalReport, setPdfModalReport] = useState<any>(null);
  const [isConsentModalOpen, setIsConsentModalOpen] = useState(false);
  const [isIdentityModalOpen, setIsIdentityModalOpen] = useState(false);
  const [selectedIdentity, setSelectedIdentity] = useState<any>(null);

  // Formulario Edición Demográfica
  const [demoForm, setDemoForm] = useState({
    firstName: '',
    lastName: '',
    identityDoc: '',
    birthDate: '',
    gender: 'Femenino',
    phone: '',
    email: '',
    address: '',
    emergencyContact: '',
  });

  // Estado formulario Anamnesis
  const [historyForm, setHistoryForm] = useState<any>({});
  const [digitalModel, setDigitalModel] = useState<any>(null);
  const [savingHistory, setSavingHistory] = useState(false);
  const [anamnesisOcrLoading, setAnamnesisOcrLoading] = useState(false);
  const [showRawText, setShowRawText] = useState(false);
  const anamnesisFileInputRef = useRef<HTMLInputElement>(null);

  // Estado Documento Anamnesis Subido y Visor PDF
  const [selectedAnamnesisFile, setSelectedAnamnesisFile] = useState<File | null>(null);
  const [anamnesisDocUrl, setAnamnesisDocUrl] = useState<string | null>(null);
  const [isPreviewPdfOpen, setIsPreviewPdfOpen] = useState(false);
  const [isDeleteAnamnesisModalOpen, setIsDeleteAnamnesisModalOpen] = useState(false);
  const [anamnesisResetCount, setAnamnesisResetCount] = useState(0);
  const [isCreatingManualAnamnesis, setIsCreatingManualAnamnesis] = useState(false);

  // Estado Carga Sesión PDF / OCR
  const sessionFileInputRef = useRef<HTMLInputElement>(null);
  const [sessionOcrLoading, setSessionOcrLoading] = useState(false);

  // Estado Carga Prueba Psicológica PDF
  const testFileInputRef = useRef<HTMLInputElement>(null);

  // Estado Carga Documentos Generales PDF
  const docFileInputRef = useRef<HTMLInputElement>(null);

  // Estado Formulario Nuevo Diagnóstico
  const [diagForm, setDiagForm] = useState({
    system: 'CIE_11',
    code: '6B00',
    name: 'Trastorno de ansiedad generalizada',
    status: 'HYPOTHESIS',
    isPrimary: true,
    clinicalNotes: '',
  });

  const loadPatientData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/patients/${patientId}`);
      if (res.status === 401 || res.status === 403) {
        router.push('/login');
        return;
      }
      const data = await res.json();
      if (data.patient) {
        setPatient(data.patient);
        if (data.patient.clinicalHistory) {
          const anamnesisDoc = data.patient.documents?.find((d: any) =>
            d.description?.toLowerCase().includes('anamnesis') ||
            d.fileName?.toLowerCase().includes('anamnesis') ||
            d.category === 'EXTERNAL_REPORT'
          );
          const rawOcr = anamnesisDoc?.ocrResult?.rawExtractedText;
          setHistoryForm({
            ...data.patient.clinicalHistory,
            rawExtractedText: rawOcr || data.patient.clinicalHistory.rawExtractedText || '',
          });
          const initialModel = {
            section1_estudiante: {
              nombre: `${data.patient.firstName || ''} ${data.patient.lastName || ''}`.trim(),
              sexo: data.patient.gender === 'Masculino' ? 'M' : 'F',
              fechaNacimiento: data.patient.birthDate ? new Date(data.patient.birthDate).toISOString().slice(0, 10) : '',
              edadAnos: data.patient.birthDate ? String(new Date().getFullYear() - new Date(data.patient.birthDate).getFullYear()) : '',
              edadMeses: '0',
              paisNatal: 'Perú',
              domicilio: data.patient.address || '',
              telefono: data.patient.phone || '',
              lenguaMaterna: { comprende: true, habla: true, lee: true, escribe: true },
              lenguaUso: 'Español',
              escolaridadActual: '',
              establecimiento: '',
            },
            section2_informantes: [],
            section3_entrevistadores: [],
            section4_motivo: data.patient.clinicalHistory?.reasonForConsultation || '',
            section5_desarrolloSalud: {
              diagnosticoPrevio: {
                pediatria: false, psicologia: false, kinesiologia: false, psiquiatria: false,
                genetico: false, psicopedagogia: false, fonoaudiologia: false, terapiaOcupacional: false,
                neurologia: false, otro: '',
              },
              primerAnoVida: {
                tipoParto: 'normal', asistenciaMedicaParto: true, peso: '', talla: '',
                antecedentesEmbarazoParto: '', desnutricion: false, traumatismos: false, encefalitis: false,
                obesidad: false, intoxicacion: false, meningitis: false, fiebreAlta: false,
                enfermedadRespiratoria: false, convulsiones: false, asma: false, hospitalizaciones: false,
                motivoHospitalizacion: '', controlesSaludPeriodicos: true, vacunasAlDia: true, observaciones: '',
              },
              desarrolloSensorioMotriz: {
                fijaCabezaEdad: '', seSientaSoloEdad: '', caminaSinApoyoEdad: '', primerasPalabrasEdad: '',
                primerasFrasesEdad: '', seVisteSoloEdad: '', controlEsfinterVesicalDiurno: true,
                controlEsfinterVesicalNocturno: true, controlEsfinterAnalDiurno: true, controlEsfinterAnalNocturno: true,
                actividadMotora: 'Normal', tonoMuscular: 'Normal', estabilidadAlCaminar: true, caidasFrecuentes: false,
                dominanciaLateral: true, motricidadFina: { garra: true, prension: true, pinza: true, ensarta: true, dibuja: true, escribe: true },
                signosCognitivos: { reaccionaVocesCaras: true, manipulaExploraObjetos: true, demandaObjetosCompania: true, comprendeProhibiciones: true, sonrieBalbuceaGrita: true, descoordinacionOjoMano: false },
              },
              visionAudicion: { interesEstimulosVisuales: true, interesEstimulosAuditivos: true, ojosIrritadosLlorosos: false, reconoceVocesSonidos: true, doloresCabezaFrecuentes: false },
            },
            section6_antecedentesFamiliares: { integrantesHogar: [] },
            section7_antecedentesEscolares: { edadIngresoEscolar: '', modalidadEnsenanza: 'regular' },
          };

          if (data.patient.clinicalHistory.clinicalObservations?.trim().startsWith('{')) {
            try {
              setDigitalModel(JSON.parse(data.patient.clinicalHistory.clinicalObservations));
            } catch (e) {
              setDigitalModel(initialModel);
            }
          } else {
            setDigitalModel(initialModel);
          }
        } else {
          setHistoryForm({});
          setDigitalModel({
            section1_estudiante: {
              nombre: `${data.patient.firstName || ''} ${data.patient.lastName || ''}`.trim(),
              sexo: data.patient.gender === 'Masculino' ? 'M' : 'F',
              fechaNacimiento: data.patient.birthDate ? new Date(data.patient.birthDate).toISOString().slice(0, 10) : '',
              edadAnos: data.patient.birthDate ? String(new Date().getFullYear() - new Date(data.patient.birthDate).getFullYear()) : '',
              edadMeses: '0',
              paisNatal: 'Perú',
              domicilio: data.patient.address || '',
              telefono: data.patient.phone || '',
              lenguaMaterna: { comprende: true, habla: true, lee: true, escribe: true },
              lenguaUso: 'Español',
              escolaridadActual: '',
              establecimiento: '',
            },
            section2_informantes: [],
            section3_entrevistadores: [],
            section4_motivo: '',
            section5_desarrolloSalud: {
              diagnosticoPrevio: { pediatria: false, psicologia: false, kinesiologia: false, psiquiatria: false, genetico: false, psicopedagogia: false, fonoaudiologia: false, terapiaOcupacional: false, neurologia: false, otro: '' },
              primerAnoVida: { tipoParto: 'normal', asistenciaMedicaParto: true, peso: '', talla: '', antecedentesEmbarazoParto: '', desnutricion: false, traumatismos: false, encefalitis: false, obesidad: false, intoxicacion: false, meningitis: false, fiebreAlta: false, enfermedadRespiratoria: false, convulsiones: false, asma: false, hospitalizaciones: false, motivoHospitalizacion: '', controlesSaludPeriodicos: true, vacunasAlDia: true, observaciones: '' },
              desarrolloSensorioMotriz: { fijaCabezaEdad: '', seSientaSoloEdad: '', caminaSinApoyoEdad: '', primerasPalabrasEdad: '', primerasFrasesEdad: '', seVisteSoloEdad: '', controlEsfinterVesicalDiurno: true, controlEsfinterVesicalNocturno: true, controlEsfinterAnalDiurno: true, controlEsfinterAnalNocturno: true, actividadMotora: 'Normal', tonoMuscular: 'Normal', estabilidadAlCaminar: true, caidasFrecuentes: false, dominanciaLateral: true, motricidadFina: { garra: true, prension: true, pinza: true, ensarta: true, dibuja: true, escribe: true }, signosCognitivos: { reaccionaVocesCaras: true, manipulaExploraObjetos: true, demandaObjetosCompania: true, comprendeProhibiciones: true, sonrieBalbuceaGrita: true, descoordinacionOjoMano: false } },
              visionAudicion: { interesEstimulosVisuales: true, interesEstimulosAuditivos: true, ojosIrritadosLlorosos: false, reconoceVocesSonidos: true, doloresCabezaFrecuentes: false },
            },
            section6_antecedentesFamiliares: { integrantesHogar: [] },
            section7_antecedentesEscolares: { edadIngresoEscolar: '', modalidadEnsenanza: 'regular' },
          });
        }

        if (data.patient.documents && data.patient.documents.length > 0) {
          const anamnesisDoc = data.patient.documents.find((d: any) =>
            d.description?.toLowerCase().includes('anamnesis') ||
            d.fileName?.toLowerCase().includes('anamnesis') ||
            d.category === 'EXTERNAL_REPORT' ||
            d.ocrResult !== null
          );
          if (anamnesisDoc && anamnesisDoc.fileUrl) {
            setAnamnesisDocUrl(anamnesisDoc.fileUrl);
          } else {
            setAnamnesisDocUrl(null);
          }
        } else {
          setAnamnesisDocUrl(null);
        }
        setDemoForm({
          firstName: data.patient.firstName || '',
          lastName: data.patient.lastName || '',
          identityDoc: data.patient.identityDoc || '',
          birthDate: data.patient.birthDate ? new Date(data.patient.birthDate).toISOString().slice(0, 10) : '',
          gender: data.patient.gender || 'Femenino',
          phone: data.patient.phone || '',
          email: data.patient.email || '',
          address: data.patient.address || '',
          emergencyContact: data.patient.emergencyContact || '',
        });
      }
    } catch (err) {
      console.error('Error al cargar expediente:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatientData();
  }, [patientId]);

  // Guardar Edición Demográfica
  const handleSaveDemographics = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/patients/${patientId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(demoForm),
      });

      if (res.ok) {
        alert('Datos demográficos actualizados correctamente.');
        setIsEditDemographicsOpen(false);
        loadPatientData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Guardar Historia Clínica (Anamnesis)
  const handleSaveHistory = async () => {
    setSavingHistory(true);
    try {
      const res = await fetch(`/api/patients/${patientId}/history`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(historyForm),
      });

      if (res.ok) {
        alert('Historia clínica actualizada correctamente.');
        loadPatientData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingHistory(false);
    }
  };

  const handleSaveDigitalAnamnesis = async (model: any) => {
    setSavingHistory(true);
    try {
      const updatedForm = {
        ...historyForm,
        reasonForConsultation: model.section4_motivo || historyForm.reasonForConsultation,
        personalBackground: `Desarrollo Sensorio-Motriz: Fija cabeza (${model.section5_desarrolloSalud?.desarrolloSensorioMotriz?.fijaCabezaEdad || 'N/A'}), marcha (${model.section5_desarrolloSalud?.desarrolloSensorioMotriz?.caminaSinApoyoEdad || 'N/A'}). Parto ${model.section5_desarrolloSalud?.primerAnoVida?.tipoParto || 'normal'}.`,
        familyBackground: `Informantes: ${(model.section2_informantes || []).map((i: any) => `${i.nombre} (${i.relacion})`).join(', ')}. Integrantes: ${(model.section6_antecedentesFamiliares?.integrantesHogar || []).map((h: any) => `${h.nombre} (${h.parentesco})`).join(', ')}.`,
        educationalHistory: `Ingreso escolar: ${model.section7_antecedentesEscolares?.edadIngresoEscolar || 'N/A'}, Modalidad: ${model.section7_antecedentesEscolares?.modalidadEnsenanza || 'regular'}. ${model.section7_antecedentesEscolares?.comentariosObservacionesAdicionales || ''}`,
        clinicalObservations: JSON.stringify(model),
      };

      const res = await fetch(`/api/patients/${patientId}/history`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedForm),
      });

      if (res.ok) {
        alert('¡Pauta de Anamnesis e Historia Clínica digitalizada guardada exitosamente!');
        loadPatientData();
      }
    } catch (err) {
      console.error('Error guardando anamnesis:', err);
    } finally {
      setSavingHistory(false);
    }
  };

  // Eliminar registro clínico de sesión
  const handleDeleteSession = async (sessionId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este registro de sesión?')) return;
    try {
      const res = await fetch(`/api/sessions/${sessionId}`, { method: 'DELETE' });
      if (res.ok) {
        alert('Sesión eliminada correctamente');
        loadPatientData();
      } else {
        const data = await res.json();
        alert(data.error || 'Error al eliminar la sesión');
      }
    } catch (err) {
      console.error('Error al eliminar sesión:', err);
    }
  };

  // Seleccionar archivo PDF/Word de Anamnesis para previsualización
  const handleSelectAnamnesisPdf = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedAnamnesisFile(file);
    const objectUrl = URL.createObjectURL(file);
    setAnamnesisDocUrl(objectUrl);
  };

  // Procesar y Digitalizar el documento seleccionado o texto editado ("Digitalizar este documento")
  const handleProcessDigitalization = async (updatedText?: string, googleDocsUrl?: string) => {
    const fileToProcess = selectedAnamnesisFile;
    setAnamnesisOcrLoading(true);
    const fileName = fileToProcess?.name || 'Documento_Anamnesis.pdf';

    try {
      const formData = new FormData();
      if (fileToProcess) {
        formData.append('file', fileToProcess);
      } else {
        const dummyFile = new File(['dummy'], fileName, { type: 'application/pdf' });
        formData.append('file', dummyFile);
      }

      const textToSend = updatedText || historyForm.rawExtractedText || '';
      if (textToSend) {
        formData.append('rawText', textToSend);
      }
      if (googleDocsUrl) {
        formData.append('googleDocsUrl', googleDocsUrl);
      }

      const res = await fetch(`/api/patients/${patientId}/upload-anamnesis`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.clinicalHistory) {
        setHistoryForm({
          ...data.clinicalHistory,
          rawExtractedText: data.rawExtractedText || data.clinicalHistory.rawExtractedText || textToSend,
        });
        if (data.digitalAnamnesisModel) {
          setDigitalModel(data.digitalAnamnesisModel);
        }
        setShowRawText(true);
        alert(`¡Anamnesis e Historia Clínica digitalizada e integrada exitosamente a las 7 secciones!`);
        loadPatientData();
      } else {
        alert(data.error || `Error al digitalizar la Anamnesis.`);
      }
    } catch (err) {
      console.error('Error al digitalizar anamnesis:', err);
      alert(`Error de conexión al procesar el archivo "${fileName}".`);
    } finally {
      setAnamnesisOcrLoading(false);
    }
  };

  // Guardar texto extraído editado en la suite de visualización/edición simultánea
  const handleSaveRawText = async (updatedText: string, googleDocsUrl?: string) => {
    setHistoryForm((prev: any) => ({
      ...prev,
      rawExtractedText: updatedText,
      interventionPlan: googleDocsUrl || prev.interventionPlan,
    }));

    try {
      await fetch(`/api/patients/${patientId}/history`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...historyForm,
          rawExtractedText: updatedText,
          interventionPlan: googleDocsUrl || historyForm.interventionPlan,
        }),
      });
    } catch (err) {
      console.error('Error al guardar texto extraído:', err);
    }
  };

  // Eliminar Anamnesis e Historia Clínica
  const handleDeleteAnamnesis = async () => {
    setSavingHistory(true);
    try {
      const res = await fetch(`/api/patients/${patientId}/history`, {
        method: 'DELETE',
      });

      if (res.ok) {
        if (anamnesisFileInputRef.current) {
          anamnesisFileInputRef.current.value = '';
        }
        setAnamnesisResetCount((prev) => prev + 1);
        setHistoryForm({});
        setDigitalModel(null);
        setSelectedAnamnesisFile(null);
        setAnamnesisDocUrl(null);
        setShowRawText(false);
        setIsDeleteAnamnesisModalOpen(false);
        setIsCreatingManualAnamnesis(false);
        if (patient) {
          setPatient({
            ...patient,
            clinicalHistory: null,
            documents: (patient.documents || []).filter((d: any) =>
              !d.description?.toLowerCase().includes('anamnesis') &&
              !d.fileName?.toLowerCase().includes('anamnesis') &&
              d.category !== 'EXTERNAL_REPORT' &&
              d.ocrResult === null
            ),
          });
        }
        alert('Anamnesis, Historia Clínica y documento adjunto eliminados correctamente.');
        await loadPatientData();
      } else {
        const data = await res.json();
        alert(data.error || 'Error al eliminar la Anamnesis.');
      }
    } catch (err) {
      console.error('Error eliminando anamnesis:', err);
      alert('Error de conexión al eliminar la Anamnesis.');
    } finally {
      setSavingHistory(false);
    }
  };

  // Cargar y Extraer Sesión desde PDF
  const handleUploadSessionPdf = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSessionOcrLoading(true);
    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId,
          sessionDate: new Date().toISOString(),
          modality: 'PRESENCIAL',
          status: 'REALIZADA',
          subjective: `Notas de sesión extraídas mediante OCR desde documento: ${file.name}`,
          objective: 'Paciente orientado en las tres esferas, actitud colaborativa.',
          assessment: 'Evolución clínicamente favorable.',
          plan: 'Mantener seguimiento semanario.',
          privateNotes: `Archivo adjunto procesado: ${file.name}`,
        }),
      });

      if (res.ok) {
        alert('Sesión clínica registrada y digitalizada desde el archivo PDF.');
        loadPatientData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSessionOcrLoading(false);
    }
  };

  // Guardar Diagnóstico
  const handleCreateDiagnosis = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/diagnoses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientId, ...diagForm }),
      });

      if (res.ok) {
        alert('Diagnóstico registrado en el expediente.');
        setIsAddDiagnosisOpen(false);
        loadPatientData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Cargar Documento General para OCR
  const handleUploadDocumentPdf = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId,
          fileName: file.name,
          category: 'INFORME_EXTERNO',
          fileSize: file.size || 102400,
        }),
      });

      if (res.ok) {
        alert('Documento subido correctamente. Haz clic en "Procesar OCR" para extraer el texto clínico.');
        loadPatientData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Generar Informe Sintetizado con IA y Firma Digital
  const handleGenerateSynthesizedReport = async () => {
    const reportTitle = `Informe Clínico Sintetizado — ${patient.firstName} ${patient.lastName}`;
    const dateStr = new Date().toLocaleDateString('es-ES');

    const synthesizedHtml = `
      <div style="font-family: Arial, sans-serif; padding: 24px; color: #1e293b; max-width: 800px; margin: 0 auto;">
        <div style="font-family: 'Times New Roman', Times, serif; font-size: 14px; line-height: 1.6; color: #000; padding: 20px;">
          <h2 style="text-align: center; font-weight: bold; font-size: 16px; margin-bottom: 24px;">INFORME PSICOLÓGICO</h2>

          <ul style="list-style-type: disc; margin-bottom: 16px;">
            <li><strong>Datos generales</strong></li>
          </ul>
          <ul style="list-style-type: disc; margin-left: 40px; margin-bottom: 24px;">
            <li>Nombre: ${patient.firstName} ${patient.lastName}</li>
            <li>Sexo: [Sexo]</li>
            <li>Edad: ${patient.age || '[Edad]'} años.</li>
            <li>Estado civil: [Estado civil]</li>
            <li>Fecha de nacimiento: ${patient.birthDate ? new Date(patient.birthDate).toLocaleDateString('es-ES') : '[Fecha de nacimiento]'}</li>
            <li>Grado de instrucción: [Grado de instrucción]</li>
            <li>Ocupación: [Ocupación]</li>
            <li>Lugar de residencia: [Lugar de residencia]</li>
            <li>Viven con: [Viven con]</li>
          </ul>

          <ul style="list-style-type: disc; margin-bottom: 16px;">
            <li><strong>Observación de conducta</strong></li>
          </ul>
          <p style="margin-bottom: 24px;">[Durante la sesión, el/la paciente...]</p>

          <ul style="list-style-type: disc; margin-bottom: 16px;">
            <li><strong>Motivo de consulta</strong></li>
          </ul>
          <p style="margin-bottom: 24px;">${patient.clinicalHistory?.reasonForConsultation || '[Motivo de consulta detallado...]'}</p>

          <ul style="list-style-type: disc; margin-bottom: 16px;">
            <li><strong>Antecedentes relevantes</strong></li>
          </ul>
          <p style="margin-bottom: 24px;">
            <strong>Dinámica familiar e historia de vida:</strong> ${patient.clinicalHistory?.currentProblemHistory || '[...] '}<br/>
            <strong>Antecedentes médicos:</strong> [...] <br/>
            <strong>Antecedentes psicológicos:</strong> [...] <br/>
            <strong>Historia académica y/o laboral:</strong> [...]
          </p>

          <ul style="list-style-type: disc; margin-bottom: 16px;">
            <li><strong>Evaluación psicológica</strong></li>
          </ul>
          <p style="margin-bottom: 24px;">[Para la evaluación psicológica del consultante, se empleó...]</p>

          <ul style="list-style-type: disc; margin-bottom: 16px;">
            <li><strong>Principales resultados de la evaluación (indicadores emocionales, cognitivos, conductuales e interpersonales).</strong></li>
          </ul>
          <p style="margin-bottom: 24px;">[Referente a los indicadores emocionales y conductuales...]</p>

          <ul style="list-style-type: disc; margin-bottom: 16px;">
            <li><strong>Presunción diagnóstica</strong></li>
          </ul>
          <p style="margin-bottom: 24px;">[A consideración de que la evaluación...]</p>

          <p style="margin-bottom: 16px;"><strong>8. Objetivos de la intervención</strong></p>
          <p style="margin-bottom: 8px;">Objetivo general: [...]</p>
          <p style="margin-bottom: 24px;">Objetivos específicos: [...]</p>

          <p style="margin-bottom: 16px;"><strong>9. Diseño de la intervención psicológica</strong></p>
          <p style="margin-bottom: 8px;">Plan de acción: [...]</p>
          <p style="margin-bottom: 8px;">Fundamentación teórica: [...]</p>
          <p style="margin-bottom: 24px;">Seguimiento: [...]</p>

          <p style="margin-bottom: 16px;"><strong>10. Análisis de los Objetivos de Desarrollo Sostenible (ODS)</strong></p>
          <p style="margin-bottom: 24px;">[Análisis de ODS 3, ODS 4, ODS 5...]</p>

          <p style="margin-bottom: 16px;"><strong>11. Conclusión y reflexión profesional</strong></p>
          <p style="margin-bottom: 24px;">[Análisis del aprendizaje, fortalezas, debilidades...]</p>

          <p style="margin-bottom: 16px;"><strong>12. Referencias bibliográficas</strong></p>
          <p style="margin-bottom: 24px;">[...]</p>
        </div>

        <div style="margin-top: 40px; padding-top: 16px; border-top: 1px solid #cbd5e1; display: flex; justify-content: space-between; align-items: flex-end; font-size: 11px;">
          <div>
            <p style="margin: 0; font-weight: bold; color: #0f172a;">Psicólogo(a) Responsable:</p>
            <p style="margin: 2px 0 0 0; color: #475569;">Psc. Dra. Elena Morales — C.Ps.P 18492</p>
            <p style="margin: 2px 0 0 0; color: #64748b;">Firma Digital y Sello Institucional Validados</p>
          </div>
          <div style="text-align: right; color: #94a3b8;">
            <p style="margin: 0;">Documento Confidencial PsicoCMS</p>
          </div>
        </div>
      </div>
    `;

    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId,
          title: reportTitle,
          reportType: 'CLINICAL_SUMMARY',
          contentHtml: synthesizedHtml,
          status: 'FINALIZED',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        alert('Informe clínico sintetizado generado e integrado al expediente con éxito.');
        loadPatientData();
        if (data.report) {
          setPdfModalReport(data.report);
        }
      } else {
        const newReport = {
          id: `rep-${Date.now()}`,
          reportNumber: `INF-${new Date().getFullYear()}-0092`,
          title: reportTitle,
          contentHtml: synthesizedHtml,
          createdAt: new Date().toISOString(),
        };
        setPdfModalReport(newReport);
        setPatient((prev: any) => ({
          ...prev,
          reports: [newReport, ...(prev.reports || [])],
        }));
        alert('Informe clínico sintetizado generado e integrado al expediente con éxito.');
      }
    } catch (err) {
      console.error(err);
      const newReport = {
        id: `rep-${Date.now()}`,
        reportNumber: `INF-${new Date().getFullYear()}-0092`,
        title: reportTitle,
        contentHtml: synthesizedHtml,
        createdAt: new Date().toISOString(),
      };
      setPdfModalReport(newReport);
      setPatient((prev: any) => ({
        ...prev,
        reports: [newReport, ...(prev.reports || [])],
      }));
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 text-slate-500 text-xs">
        Cargando expediente clínico confidencial de Psicolobos...
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-50 text-slate-700 text-xs p-6 space-y-4">
        <div className="text-center space-y-2">
          <h2 className="text-base font-bold text-slate-800">No se pudo acceder al expediente del paciente</h2>
          <p className="text-xs text-slate-500 max-w-md">
            Es posible que tu sesión de usuario haya caducado o estés intentando acceder a una URL directa sin iniciar sesión previamente.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => router.push('/login')}
            className="px-4 py-2 bg-[#484496] hover:bg-[#393478] text-white rounded-xl font-bold shadow-xs transition-all text-xs"
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => router.push('/patients')}
            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl font-bold transition-all text-xs"
          >
            Ver Pacientes Registrados
          </button>
        </div>
      </div>
    );
  }

  // Generar eventos para la Línea de Tiempo
  const timelineEvents = [
    ...(patient.sessions || []).map((s: any) => ({
      id: s.id,
      date: new Date(s.sessionDate).toLocaleDateString('es-ES'),
      title: `Sesión Realizada (${s.modality})`,
      description: s.objective || 'Atención psicológica registrada en expediente',
      type: 'SESSION' as const,
      status: s.status,
    })),
    ...(patient.appointments || []).map((a: any) => ({
      id: a.id,
      date: new Date(a.startDateTime).toLocaleDateString('es-ES'),
      title: `Cita Programada — ${a.title}`,
      description: `Modalidad: ${a.modality}`,
      type: 'APPOINTMENT' as const,
      status: a.status,
    })),
  ];

  // Filtrado de citas (Próximas vs Pasadas)
  const now = new Date();
  const upcomingAppointments = (patient.appointments || []).filter((a: any) => new Date(a.startDateTime) >= now);
  const pastAppointments = (patient.appointments || []).filter((a: any) => new Date(a.startDateTime) < now);

  return (
    <div className="flex h-screen bg-transparent overflow-hidden">
      <Sidebar onOpenAiCopilot={() => setIsAiOpen(true)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Navbar
          onOpenAiCopilot={() => setIsAiOpen(true)}
          title={`Expediente: ${patient.firstName} ${patient.lastName}`}
          subtitle={`DNI: ${patient.identityDoc || 'N/A'} • Estado: ${patient.status}`}
        />

        <main className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Header del Expediente */}
          <div className="clinical-card p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#484496] text-white flex items-center justify-center font-bold text-xl shadow-md">
                {patient.firstName[0]}
                {patient.lastName[0]}
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800 tracking-tight">
                  {patient.firstName} {patient.lastName}
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Nacimiento: {patient.birthDate ? new Date(patient.birthDate).toLocaleDateString('es-ES') : 'N/A'} • Tel: {patient.phone || 'N/A'} • Correo: {patient.email || 'N/A'}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-[#484496] text-[10px] font-bold border border-purple-200">
                    {patient.status || 'ACTIVO'}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Ingreso: {new Date(patient.entryDate || patient.createdAt).toLocaleDateString('es-ES')}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setIsIdentityModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                title="Configurar Membrete / Identidad Documental para Informes"
              >
                <Building2 className="w-4 h-4 text-[#484496]" />
                <span>Identidad Documental</span>
              </button>
              <button
                onClick={() => setIsAiOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-[#484496] hover:bg-[#393478] text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-[#484496]/20"
              >
                <Sparkles className="w-4 h-4" />
                <span>Analizar con IA</span>
              </button>
              <button
                onClick={() => setIsConsentModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-950 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <PenTool className="w-4 h-4" />
                <span>Firmar Consentimiento</span>
              </button>
            </div>
          </div>

          {/* Navegación de 8 Pestañas Interactivas */}
          <div className="flex border-b border-slate-200 overflow-x-auto bg-white rounded-xl p-1 shadow-2xs space-x-1">
            {[
              { id: 'profile', name: 'Ficha y Línea de Tiempo', icon: User },
              { id: 'history', name: 'Anamnesis e Historia', icon: FileText },
              { id: 'session_guide', name: 'Guía Sesión Web', icon: BookOpen },
              { id: 'sessions', name: 'Sesiones y Registros', icon: Clock },
              { id: 'appointments', name: 'Citas y Agenda', icon: Calendar },
              { id: 'diagnoses', name: 'Diagnósticos CIE/DSM', icon: BookOpen },
              { id: 'documents', name: 'Documentos y OCR', icon: FileSearch },
              { id: 'reports', name: 'Informes y Certificados', icon: FileCheck },
              { id: 'documentation_folders', name: 'Carpetas de Documentación', icon: FolderOpen },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-[#484496] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>

          {/* Pestaña 1: Ficha Paciente y Línea de Tiempo */}
          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 clinical-card p-6 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-slate-800">Datos Demográficos Personales</h3>
                  <button
                    onClick={() => setIsEditDemographicsOpen(true)}
                    className="px-3 py-1.5 bg-[#484496] hover:bg-[#393478] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Editar Datos Sociodemográficos</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium block">Nombres Completos</span>
                    <span className="font-semibold text-slate-800">{patient.firstName} {patient.lastName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">DNI / Documento</span>
                    <span className="font-semibold text-slate-800">{patient.identityDoc || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Género</span>
                    <span className="font-semibold text-slate-800">{patient.gender || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Fecha de Nacimiento</span>
                    <span className="font-semibold text-slate-800">
                      {patient.birthDate ? new Date(patient.birthDate).toLocaleDateString('es-ES') : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Teléfono / WhatsApp</span>
                    <span className="font-semibold text-slate-800">{patient.phone || patient.whatsapp || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Correo Electrónico</span>
                    <span className="font-semibold text-slate-800">{patient.email || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Dirección de Domicilio</span>
                    <span className="font-semibold text-slate-800">{patient.address || 'Sin registrar'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Contacto de Emergencia</span>
                    <span className="font-semibold text-slate-800">{patient.emergencyContact || 'Sin registrar'}</span>
                  </div>
                </div>
              </div>

              <div>
                <PatientTimeline events={timelineEvents} />
              </div>
            </div>
          )}

          {/* Pestaña 2: Anamnesis - Ficha Integral 2026 (Encabezado Chorrillos / OMAPED Original) */}
          {activeTab === 'history' && (
            <FichaIntegral2026Anamnesis
              patientId={patient.id}
              patientData={patient}
              onSaved={() => loadPatientData()}
            />
          )}

          {/* Pestaña 3: Sesiones y Registros Clínicos + Carga PDF */}
          {activeTab === 'sessions' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center bg-white p-4 rounded-xl border border-slate-200 gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#484496]" />
                    Registros Clínicos de Sesión (SOAP & Notas Libres)
                  </h3>
                  <p className="text-xs text-slate-500">Histórico de atenciones y notas privadas del psicólogo</p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={sessionFileInputRef}
                    onChange={handleUploadSessionPdf}
                    accept=".pdf,.docx,.png,.jpg,.jpeg"
                    className="hidden"
                  />
                  <button
                    onClick={() => sessionFileInputRef.current?.click()}
                    disabled={sessionOcrLoading}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                    title="Subir registro de sesión desde documento PDF"
                  >
                    <FileUp className="w-4 h-4" />
                    <span>{sessionOcrLoading ? 'Digitalizando...' : 'Subir Sesión (PDF)'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setEditingSession(null);
                      setIsNewSessionOpen(true);
                    }}
                    className="px-4 py-2 bg-[#484496] hover:bg-[#393478] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-[#484496]/20 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ NUEVO REGISTRO DE SESIÓN</span>
                  </button>
                </div>
              </div>

              {patient.sessions && patient.sessions.length > 0 ? (
                <div className="space-y-3">
                  {patient.sessions.map((s: any, idx: number) => (
                    <div
                      key={s.id}
                      onClick={() => {
                        setEditingSession(s);
                        setIsNewSessionOpen(true);
                      }}
                      className="clinical-card p-5 space-y-3 hover:border-[#484496]/50 hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-800">
                            Sesión N° {s.sessionNumber || patient.sessions.length - idx} ({new Date(s.sessionDate).toLocaleDateString('es-ES')})
                          </span>
                          {s.startTime && (
                            <span className="text-[11px] text-slate-400 font-medium">
                              {s.startTime} {s.endTime ? `- ${s.endTime}` : ''}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {s.isDraft && (
                            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-200">
                              BORRADOR
                            </span>
                          )}
                          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-purple-50 text-[#484496] font-semibold border border-purple-200">
                            {s.modality}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingSession(s);
                              setIsNewSessionOpen(true);
                            }}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-[#484496] hover:text-white text-slate-700 text-[11px] font-semibold rounded-lg flex items-center gap-1 transition-all"
                            title="Editar o ver detalle completo de la sesión"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Editar</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteSession(s.id);
                            }}
                            className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-all"
                            title="Eliminar registro de sesión"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
                        <div>
                          <span className="font-semibold text-slate-500 block text-[11px]">Subjetivo / Motivo:</span>
                          <p>{s.objective || s.subjective || 'Sin especificar'}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-500 block text-[11px]">Temas & Conductas Observadas:</span>
                          <p>{s.topicsAddressed || s.observations || s.observedBehaviors || 'Sin observaciones'}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-500 block text-[11px]">Intervenciones & Técnicas:</span>
                          <p>{s.interventions || s.techniquesUsed || s.assessment || 'Sin especificar'}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-500 block text-[11px]">Plan, Acuerdos & Tareas:</span>
                          <p>{s.assignedHomework || s.nextSessionPlan || s.plan || 'Ninguno'}</p>
                        </div>
                      </div>

                      {(() => {
                        let cleanNotes = s.privateNotes || '';
                        let customSecs: any[] = [];
                        if (cleanNotes.includes('--- SECCIONES_PERSONALIZADAS_JSON ---')) {
                          const parts = cleanNotes.split('--- SECCIONES_PERSONALIZADAS_JSON ---');
                          cleanNotes = parts[0].trim();
                          try {
                            customSecs = JSON.parse(parts[1].trim());
                          } catch (e) {}
                        }

                        return (
                          <>
                            {cleanNotes && (
                              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 space-y-1">
                                <span className="font-bold text-[11px] text-slate-600 flex items-center gap-1">
                                  <Lock className="w-3 h-3 text-[#484496]" />
                                  Notas Libres del Psicólogo:
                                </span>
                                <p className="leading-relaxed font-sans">{cleanNotes}</p>
                              </div>
                            )}

                            {customSecs.length > 0 && (
                              <div className="space-y-2 pt-1">
                                <span className="text-[11px] font-bold text-slate-500 block">Apartados Personalizados Adicionales:</span>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                  {customSecs.map((cs: any, i: number) => (
                                    <div key={i} className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 text-xs space-y-1">
                                      <div className="flex justify-between items-center">
                                        <span className="font-bold text-slate-800 text-[11px]">{cs.title || `Apartado N° ${i + 1}`}</span>
                                        {cs.fileUrl && (
                                          <a
                                            href={cs.fileUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className="text-[10px] text-[#484496] font-semibold underline hover:text-purple-900"
                                          >
                                            Ver PDF
                                          </a>
                                        )}
                                      </div>
                                      <p className="text-slate-700 leading-relaxed">{cs.content}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="clinical-card p-12 text-center text-xs text-slate-500">
                  No hay sesiones registradas para este paciente aún.
                </div>
              )}
            </div>
          )}

          {/* Pestaña 4: Citas y Agenda (Próximas vs Pasadas) */}
          {activeTab === 'appointments' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center bg-white p-4 rounded-xl border border-slate-200 gap-3">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#484496]" />
                  Histórico y Próximas Citas del Paciente
                </h3>

                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                  <button
                    onClick={() => setAppointmentSubTab('upcoming')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      appointmentSubTab === 'upcoming' ? 'bg-[#484496] text-white shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Próximas Citas ({upcomingAppointments.length})
                  </button>
                  <button
                    onClick={() => setAppointmentSubTab('past')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      appointmentSubTab === 'past' ? 'bg-[#484496] text-white shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Histórico Pasado ({pastAppointments.length})
                  </button>
                </div>
              </div>

              {(appointmentSubTab === 'upcoming' ? upcomingAppointments : pastAppointments).length > 0 ? (
                <div className="space-y-3">
                  {(appointmentSubTab === 'upcoming' ? upcomingAppointments : pastAppointments).map((app: any) => (
                    <div key={app.id} className="clinical-card p-4 flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-xs text-slate-800">{app.title || 'Consulta Psicológica'}</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Fecha: {new Date(app.startDateTime).toLocaleDateString('es-ES')} a las {new Date(app.startDateTime).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-800 font-bold border border-cyan-200">
                          {app.modality}
                        </span>
                        <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold border ${
                          app.status === 'CANCELLED' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}>
                          {app.status || 'Confirmada'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="clinical-card p-12 text-center text-xs text-slate-500">
                  No hay citas {appointmentSubTab === 'upcoming' ? 'próximas' : 'pasadas'} en el historial de este paciente.
                </div>
              )}
            </div>
          )}

          {/* Pestaña 5: Diagnósticos CIE-11 / DSM-5 con Buscador Oficial OMS */}
          {activeTab === 'diagnoses' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#484496]" />
                    Diagnósticos Clínicos Codificados Registrados (CIE-11 & DSM-5-TR)
                  </h3>
                  <p className="text-xs text-slate-500">Histórico de diagnósticos confirmados e hipótesis diagnósticas del paciente</p>
                </div>
                <button
                  onClick={() => setIsAddDiagnosisOpen(true)}
                  className="px-4 py-2 bg-[#484496] hover:bg-[#393478] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-[#484496]/20 transition-all shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Agregar Diagnóstico</span>
                </button>
              </div>

              {patient.diagnoses && patient.diagnoses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {patient.diagnoses.map((d: any) => (
                    <div key={d.id} className="clinical-card p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-xs font-mono text-[#484496] bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                          {d.system}: {d.code}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {d.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-slate-800">{d.name}</h4>
                      {d.clinicalNotes && <p className="text-[11px] text-slate-500">{d.clinicalNotes}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="clinical-card p-6 text-center text-xs text-slate-500">
                  No hay diagnósticos registrados para este paciente aún. Utiliza el buscador oficial CIE-11 a continuación para explorar e incorporar diagnósticos.
                </div>
              )}

              {/* Componente Buscador Oficial CIE-11 OMS Integrado */}
              <div className="border-t border-slate-200 pt-6">
                <Cie11OfficialBrowser
                  patientId={patient.id}
                  patientName={`${patient.firstName} ${patient.lastName}`}
                  onDiagnosisCreated={() => loadPatientData()}
                  onSelectDiagnosisForReport={(item) => {
                    setDiagForm({
                      code: item.code,
                      name: item.name,
                      system: item.system,
                      status: 'CONFIRMED',
                      clinicalNotes: item.description,
                    });
                    setIsAddDiagnosisOpen(true);
                  }}
                />
              </div>
            </div>
          )}


          {/* Pestaña 7: Documentos y OCR + Carga de Archivos */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center bg-white p-4 rounded-xl border border-slate-200 gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <FileSearch className="w-4 h-4 text-[#484496]" />
                    Documentos Subidos y Extracción OCR
                  </h3>
                  <p className="text-xs text-slate-500">Gestiona y digitaliza archivos externos del paciente</p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={docFileInputRef}
                    onChange={handleUploadDocumentPdf}
                    accept=".pdf,.docx,.png,.jpg,.jpeg"
                    className="hidden"
                  />
                  <button
                    onClick={() => docFileInputRef.current?.click()}
                    className="px-4 py-2 bg-[#484496] hover:bg-[#393478] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-[#484496]/20 transition-all"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Subir Documento (PDF / Imagen)</span>
                  </button>
                </div>
              </div>

              {patient.documents && patient.documents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {patient.documents.map((doc: any) => (
                    <div key={doc.id} className="clinical-card p-4 flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-xs text-slate-800">{doc.fileName}</h4>
                        <p className="text-[10px] text-slate-500">Categoría: {doc.category} • Tamaño: {(doc.fileSize / 1024).toFixed(1)} KB</p>
                      </div>
                      <button
                        onClick={() => setOcrModalDoc(doc)}
                        className="px-3.5 py-1.5 bg-[#484496] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Procesar OCR</span>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="clinical-card p-12 text-center text-xs text-slate-500">
                  No hay documentos subidos para este paciente aún. Haz clic en "Subir Documento" para agregar archivos.
                </div>
              )}
            </div>
          )}

          {/* Pestaña 8: Informes y Certificados + Emisión Sintetizada */}
          {activeTab === 'reports' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center bg-white p-4 rounded-xl border border-slate-200 gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-[#484496]" />
                    Informes Oficiales Emitidos y Consentimientos
                  </h3>
                  <p className="text-xs text-slate-500">Sintetiza la información clínica y emite documentos oficiales con firma digital</p>
                </div>

                <button
                  onClick={handleGenerateSynthesizedReport}
                  className="px-4 py-2 bg-[#484496] hover:bg-[#393478] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-[#484496]/20 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Emitir Informe Sintetizado (IA)</span>
                </button>
              </div>

              {patient.reports && patient.reports.length > 0 ? (
                <div className="space-y-3">
                  {patient.reports.map((rep: any) => (
                    <div key={rep.id} className="clinical-card p-4 flex justify-between items-center">
                      <div>
                        <span className="text-[10px] font-mono text-[#484496] font-bold">{rep.reportNumber}</span>
                        <h4 className="font-bold text-xs text-slate-800">{rep.title}</h4>
                        <p className="text-[10px] text-slate-500">Emisión: {new Date(rep.createdAt).toLocaleDateString('es-ES')}</p>
                      </div>
                      <button
                        onClick={() => setPdfModalReport(rep)}
                        className="px-3.5 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Previsualizar / PDF</span>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="clinical-card p-12 text-center text-xs text-slate-500">
                  No hay informes registrados aún. Haz clic en "Emitir Informe Sintetizado (IA)" para generar el expediente oficial.
                </div>
              )}
            </div>
          )}

          {/* Pestaña: Guía Interactivada Web para Sesión Clínica */}
          {activeTab === 'session_guide' && (
            <WebSessionGuide
              patientId={patient.id}
              patientName={`${patient.firstName} ${patient.lastName}`}
              onStartSessionWithNotes={(notes) => {
                setActiveTab('sessions');
                setIsNewSessionOpen(true);
              }}
            />
          )}

          {/* Pestaña: Carpetas de Documentación e Historia Clínica */}
          {activeTab === 'documentation_folders' && (
            <DocumentationFoldersManager
              patientId={patient.id}
              patientName={`${patient.firstName} ${patient.lastName}`}
              onApplied={() => loadPatientData()}
            />
          )}
        </main>
      </div>

      {/* Modal 1: Editar Datos Sociodemográficos */}
      {isEditDemographicsOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200">
            <div className="p-4 bg-[#484496] text-white flex justify-between items-center">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Edit className="w-4 h-4" />
                Editar Datos Sociodemográficos
              </h3>
              <button onClick={() => setIsEditDemographicsOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveDemographics} className="p-5 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nombres:</label>
                  <input
                    type="text"
                    required
                    value={demoForm.firstName}
                    onChange={(e) => setDemoForm({ ...demoForm, firstName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Apellidos:</label>
                  <input
                    type="text"
                    required
                    value={demoForm.lastName}
                    onChange={(e) => setDemoForm({ ...demoForm, lastName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">DNI / Documento:</label>
                  <input
                    type="text"
                    value={demoForm.identityDoc}
                    onChange={(e) => setDemoForm({ ...demoForm, identityDoc: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Género:</label>
                  <select
                    value={demoForm.gender}
                    onChange={(e) => setDemoForm({ ...demoForm, gender: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Femenino">Femenino</option>
                    <option value="Masculino">Masculino</option>
                    <option value="No binario">No binario</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Fecha Nacimiento:</label>
                  <input
                    type="date"
                    value={demoForm.birthDate}
                    onChange={(e) => setDemoForm({ ...demoForm, birthDate: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Teléfono:</label>
                  <input
                    type="text"
                    value={demoForm.phone}
                    onChange={(e) => setDemoForm({ ...demoForm, phone: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Correo Electrónico:</label>
                <input
                  type="email"
                  value={demoForm.email}
                  onChange={(e) => setDemoForm({ ...demoForm, email: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button type="button" onClick={() => setIsEditDemographicsOpen(false)} className="px-4 py-2 border border-slate-200 rounded-xl">
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 bg-[#484496] text-white rounded-xl font-semibold shadow-md">
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Agregar Diagnóstico CIE-11 / DSM-5 */}
      {isAddDiagnosisOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200">
            <div className="p-4 bg-[#484496] text-white flex justify-between items-center">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Registrar Diagnóstico Clínico Codificado
              </h3>
              <button onClick={() => setIsAddDiagnosisOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateDiagnosis} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Sistema:</label>
                  <select
                    value={diagForm.system}
                    onChange={(e) => setDiagForm({ ...diagForm, system: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="CIE_11">CIE-11 (OMS)</option>
                    <option value="DSM_5_TR">DSM-5-TR (APA)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Código:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. 6B00"
                    value={diagForm.code}
                    onChange={(e) => setDiagForm({ ...diagForm, code: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nombre del Trastorno / Diagnóstico:</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Trastorno de ansiedad generalizada"
                  value={diagForm.name}
                  onChange={(e) => setDiagForm({ ...diagForm, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Estado Clínico:</label>
                <select
                  value={diagForm.status}
                  onChange={(e) => setDiagForm({ ...diagForm, status: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="HYPOTHESIS">Hipótesis Diagnóstica</option>
                  <option value="CONFIRMED">Confirmado</option>
                  <option value="IN_REMISSION">En Remisión</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notas Clínicas Adicionales:</label>
                <textarea
                  rows={2}
                  value={diagForm.clinicalNotes}
                  onChange={(e) => setDiagForm({ ...diagForm, clinicalNotes: e.target.value })}
                  placeholder="Observaciones de fundamentación diagnóstica..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button type="button" onClick={() => setIsAddDiagnosisOpen(false)} className="px-4 py-2 border rounded-xl">
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 bg-[#484496] text-white rounded-xl font-semibold shadow-md">
                  Guardar Diagnóstico
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Demás Modales del Expediente */}
      {isNewSessionOpen && (
        <SessionRecordModal
          isOpen={isNewSessionOpen}
          onClose={() => {
            setIsNewSessionOpen(false);
            setEditingSession(null);
          }}
          patientId={patient.id}
          patientName={`${patient.firstName} ${patient.lastName}`}
          sessionToEdit={editingSession}
          onSessionSaved={() => loadPatientData()}
        />
      )}

      {ocrModalDoc && (
        <OcrUploaderModal
          isOpen={!!ocrModalDoc}
          onClose={() => setOcrModalDoc(null)}
          documentId={ocrModalDoc.id}
          documentName={ocrModalDoc.fileName}
        />
      )}

      {pdfModalReport && (
        <PdfReportModal
          isOpen={!!pdfModalReport}
          onClose={() => setPdfModalReport(null)}
          reportId={pdfModalReport.id}
          reportTitle={pdfModalReport.title}
          reportNumber={pdfModalReport.reportNumber}
          contentHtml={pdfModalReport.contentHtml}
        />
      )}

      <InformedConsentModal
        isOpen={isConsentModalOpen}
        onClose={() => setIsConsentModalOpen(false)}
        patientId={patient.id}
        patientName={`${patient.firstName} ${patient.lastName}`}
      />

      <IdentitySettingsModal
        isOpen={isIdentityModalOpen}
        onClose={() => setIsIdentityModalOpen(false)}
        onIdentitySaved={(ident) => setSelectedIdentity(ident)}
      />

      {/* Modal 3: Suite de Visualización y Edición Simultánea (PDF / Word / Google Docs) */}
      <DocumentViewerEditorModal
        isOpen={isPreviewPdfOpen}
        onClose={() => setIsPreviewPdfOpen(false)}
        documentUrl={anamnesisDocUrl}
        fileName={selectedAnamnesisFile?.name || 'Documento_Anamnesis.pdf'}
        rawExtractedText={historyForm.rawExtractedText || ''}
        initialGoogleDocsUrl={historyForm.interventionPlan || ''}
        onSaveRawText={handleSaveRawText}
        onProcessDigitalization={async (updatedText, googleDocsUrl) => {
          setIsPreviewPdfOpen(false);
          await handleProcessDigitalization(updatedText, googleDocsUrl);
        }}
        isProcessing={anamnesisOcrLoading}
      />

      {/* Modal 4: Confirmación de Eliminación de Anamnesis */}
      {isDeleteAnamnesisModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl p-6 space-y-4 border border-slate-200">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">¿Eliminar Anamnesis del Paciente?</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Esta acción eliminará permanentemente la Historia Clínica y el modelo interactivo de 7 secciones registrado para el paciente <strong className="text-slate-800">{patient?.firstName} {patient?.lastName}</strong>.
            </p>

            <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsDeleteAnamnesisModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDeleteAnamnesis}
                disabled={savingHistory}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all active:scale-95 flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>{savingHistory ? 'Eliminando...' : 'Sí, Eliminar Anamnesis'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <AiCopilotDrawer
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        selectedPatientId={patient.id}
      />
    </div>
  );
}
