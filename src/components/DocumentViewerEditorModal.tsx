/**
 * Nombre del archivo: src/components/DocumentViewerEditorModal.tsx
 * Descripción: Suite completa de Visualización y Edición Simultánea de Documentos (PDF / Word) con integración a Google Docs Editor Embebido y Editor en Tiempo Real.
 * Fecha de última modificación: 2026-09-21
 * Autor: Psicolobos Development Team
 */

'use client';

import React, { useState } from 'react';
import {
  X,
  Eye,
  Edit3,
  ExternalLink,
  Download,
  Split,
  Save,
  Sparkles,
  FileText,
  Globe,
  CheckCircle,
} from 'lucide-react';

interface DocumentViewerEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentUrl: string | null;
  fileName: string;
  rawExtractedText: string;
  initialGoogleDocsUrl?: string;
  onSaveRawText: (updatedText: string, googleDocsUrl?: string) => Promise<void>;
  onProcessDigitalization: (updatedText?: string, googleDocsUrl?: string) => Promise<void>;
  isProcessing: boolean;
}

export function DocumentViewerEditorModal({
  isOpen,
  onClose,
  documentUrl,
  fileName,
  rawExtractedText,
  initialGoogleDocsUrl = '',
  onSaveRawText,
  onProcessDigitalization,
  isProcessing,
}: DocumentViewerEditorModalProps) {
  const [viewMode, setViewMode] = useState<'split' | 'document' | 'editor'>('split');
  const [viewerProvider, setViewerProvider] = useState<'native' | 'google-editor' | 'google' | 'office'>('native');
  const [editedText, setEditedText] = useState(rawExtractedText);
  const [googleDocsUrl, setGoogleDocsUrl] = useState(initialGoogleDocsUrl || 'https://docs.google.com/document/u/0/');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const isPdf = fileName.toLowerCase().endsWith('.pdf') || documentUrl?.toLowerCase().includes('.pdf');
  const isDocx = fileName.toLowerCase().endsWith('.docx') || fileName.toLowerCase().endsWith('.doc') || documentUrl?.toLowerCase().includes('.doc');

  const getAbsoluteUrl = () => {
    if (!documentUrl) return '';
    if (documentUrl.startsWith('blob:')) return documentUrl;
    if (documentUrl.startsWith('http://') || documentUrl.startsWith('https://')) return documentUrl;
    if (typeof window !== 'undefined') {
      return `${window.location.origin}${documentUrl}`;
    }
    return documentUrl;
  };

  const fullUrl = getAbsoluteUrl();
  const googleDocsViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(fullUrl)}&embedded=true`;
  const officeOnlineViewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fullUrl)}`;

  const getEmbeddedGoogleDocsEditUrl = () => {
    if (!googleDocsUrl) return 'https://docs.google.com/document/u/0/';
    const docIdMatch = googleDocsUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (docIdMatch && docIdMatch[1]) {
      return `https://docs.google.com/document/d/${docIdMatch[1]}/edit?embedded=true`;
    }
    return googleDocsUrl;
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await onSaveRawText(editedText, googleDocsUrl);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error al guardar texto editado:', err);
      alert('Ocurrió un error al guardar el texto editado.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-7xl rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[94vh] border border-slate-200">
        {/* Cabecera Superior con Controles */}
        <div className="px-4 py-3 bg-[#484496] text-white flex flex-col sm:flex-row justify-between sm:items-center gap-3 shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-purple-200 border border-white/10">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold truncate max-w-xs sm:max-w-md">
                  {fileName || 'Documento_Anamnesis.pdf'}
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-purple-300/20 text-purple-200 border border-purple-300/30">
                  {isPdf ? 'PDF' : isDocx ? 'WORD' : 'DOCUMENTO'}
                </span>
              </div>
              <p className="text-[11px] text-purple-200/80">
                Suite de Visualización y Edición Simultánea en Tiempo Real
              </p>
            </div>
          </div>

          {/* Controles de Modo de Vista */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-white/10 p-1 rounded-xl flex items-center gap-1 border border-white/10">
              <button
                type="button"
                onClick={() => setViewMode('split')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  viewMode === 'split' ? 'bg-white text-[#484496] shadow-xs' : 'text-purple-100 hover:bg-white/10'
                }`}
                title="Vista dividida: Documento a la izquierda, Editor a la derecha"
              >
                <Split className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Dividido</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('document')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  viewMode === 'document' ? 'bg-white text-[#484496] shadow-xs' : 'text-purple-100 hover:bg-white/10'
                }`}
                title="Solo el documento original"
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Documento</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('editor')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  viewMode === 'editor' ? 'bg-white text-[#484496] shadow-xs' : 'text-purple-100 hover:bg-white/10'
                }`}
                title="Solo el editor de texto extraído"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Editor</span>
              </button>
            </div>

            {/* Acciones de Conexión a Aplicaciones Externas */}
            <div className="flex items-center gap-1.5">
              <a
                href={googleDocsUrl || 'https://docs.google.com/document/u/0/'}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-100 text-xs font-semibold rounded-xl flex items-center gap-1 border border-blue-400/30 transition-all"
                title="Abrir con Google Docs para edición externa"
              >
                <Globe className="w-3.5 h-3.5 text-blue-300" />
                <span className="hidden lg:inline">Google Docs</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>

              {documentUrl && (
                <a
                  href={documentUrl}
                  download={fileName}
                  className="px-2.5 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-100 text-xs font-semibold rounded-xl flex items-center gap-1 border border-emerald-400/30 transition-all"
                  title="Descargar archivo original para editar en Word / Adobe"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-300" />
                  <span className="hidden lg:inline">Descargar</span>
                </a>
              )}

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-xl hover:bg-white/20 text-white transition-colors"
                title="Cerrar visor"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Panel Principal Integrado */}
        <div className="flex-1 bg-slate-100 overflow-hidden flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-200">
          {/* LADO IZQUIERDO: VISOR DEL DOCUMENTO ORIGINAL */}
          {(viewMode === 'split' || viewMode === 'document') && (
            <div className={`${viewMode === 'split' ? 'w-full md:w-1/2' : 'w-full'} flex flex-col h-full bg-slate-200/70 p-3 space-y-2`}>
              {/* Selector de proveedor de visualización para máxima compatibilidad */}
              <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-[#484496]" />
                  Visor de Documento:
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setViewerProvider('native')}
                    className={`px-2 py-1 text-[11px] font-bold rounded-lg transition-all ${
                      viewerProvider === 'native' ? 'bg-[#484496] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Directo
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewerProvider('google-editor')}
                    className={`px-2 py-1 text-[11px] font-bold rounded-lg transition-all ${
                      viewerProvider === 'google-editor' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                    }`}
                    title="Editar directamente en Google Docs"
                  >
                    Google Docs Editor
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewerProvider('google')}
                    className={`px-2 py-1 text-[11px] font-bold rounded-lg transition-all ${
                      viewerProvider === 'google' ? 'bg-[#484496] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                    title="Previsualizar mediante Google Visor"
                  >
                    Google Visor
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewerProvider('office')}
                    className={`px-2 py-1 text-[11px] font-bold rounded-lg transition-all ${
                      viewerProvider === 'office' ? 'bg-[#484496] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                    title="Previsualizar mediante Office Online Embed"
                  >
                    Office Visor
                  </button>
                </div>
              </div>

              {/* Bar para Enlace Directo a Google Docs */}
              <div className="flex items-center gap-2 bg-blue-50 p-2 rounded-xl border border-blue-200 text-xs">
                <span className="font-bold text-blue-900 text-[11px] shrink-0 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-blue-600" /> Enlace Google Docs:
                </span>
                <input
                  type="text"
                  value={googleDocsUrl}
                  onChange={(e) => setGoogleDocsUrl(e.target.value)}
                  placeholder="Pegar enlace de Google Docs (https://docs.google.com/document/d/.../edit)..."
                  className="flex-1 px-3 py-1 bg-white border border-blue-300 rounded-lg text-xs font-mono text-blue-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <a
                  href={googleDocsUrl || 'https://docs.google.com/document/u/0/'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors shrink-0"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Abrir Google Docs</span>
                </a>
              </div>

              {/* Renderizador de Documento */}
              <div className="flex-1 rounded-xl overflow-hidden border border-slate-300 bg-white shadow-inner relative flex flex-col">
                {viewerProvider === 'google-editor' ? (
                  <iframe
                    src={getEmbeddedGoogleDocsEditUrl()}
                    className="w-full flex-1 border-0"
                    title="Editor en vivo de Google Docs"
                  />
                ) : documentUrl ? (
                  viewerProvider === 'native' ? (
                    isPdf || documentUrl.startsWith('blob:') ? (
                      <iframe
                        src={documentUrl}
                        className="w-full flex-1 border-0"
                        title="Visor PDF"
                      />
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-3 bg-slate-50">
                        <FileText className="w-12 h-12 text-[#484496]" />
                        <h4 className="text-xs font-bold text-slate-800">
                          Previsualización Nativa de Word (.docx / .doc)
                        </h4>
                        <p className="text-[11px] text-slate-500 max-w-xs">
                          Para ver la maquetación completa del archivo Word en línea, selecciona "Google Visor" u "Office Visor" arriba.
                        </p>
                        <button
                          type="button"
                          onClick={() => setViewerProvider('google')}
                          className="px-3.5 py-1.5 bg-[#484496] text-white text-xs font-bold rounded-xl shadow-xs"
                        >
                          Cargar en Google Visor
                        </button>
                      </div>
                    )
                  ) : viewerProvider === 'google' ? (
                    <iframe
                      src={googleDocsViewerUrl}
                      className="w-full flex-1 border-0"
                      title="Google Docs Embedded Viewer"
                    />
                  ) : (
                    <iframe
                      src={officeOnlineViewerUrl}
                      className="w-full flex-1 border-0"
                      title="Office Online Embedded Viewer"
                    />
                  )
                ) : (
                  <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
                    No se ha especificado ninguna URL de documento. Usa Google Docs Editor arriba.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* LADO DERECHO: EDITOR DE TEXTO Y MODELO DIGITALIZADO */}
          {(viewMode === 'split' || viewMode === 'editor') && (
            <div className={`${viewMode === 'split' ? 'w-full md:w-1/2' : 'w-full'} flex flex-col h-full bg-white p-4 space-y-3`}>
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-[#484496]" />
                  <h4 className="text-xs font-bold text-slate-800">
                    Editor Integrado del Texto Extraído del Documento
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  {saveSuccess && (
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 animate-in fade-in">
                      <CheckCircle className="w-3.5 h-3.5" /> Cambios guardados
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-3.5 py-1.5 bg-[#484496] hover:bg-[#393478] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all active:scale-95"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isSaving ? 'Guardando...' : 'Guardar Cambios'}</span>
                  </button>
                </div>
              </div>

              {/* Área de texto editable */}
              <div className="flex-1 flex flex-col space-y-2">
                <label className="text-[11px] font-semibold text-slate-600 flex justify-between">
                  <span>Modifica el texto para corregir cualquier discrepancia o agregar notas:</span>
                  <span className="text-[10px] text-slate-400">{editedText.length} caracteres</span>
                </label>
                <textarea
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  placeholder="Escribe o edita el texto completo del documento aquí..."
                  className="w-full flex-1 p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:bg-white focus:border-[#484496] focus:ring-2 focus:ring-[#484496]/20 transition-all resize-none shadow-inner"
                />
              </div>

              {/* Botón de Re-Digitalización con texto editado */}
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 flex flex-col sm:flex-row justify-between items-center gap-2 shadow-2xs">
                <div className="text-[11px] text-purple-900">
                  <span className="font-bold">¿Modificaste el texto o vinculaste Google Docs?</span> Haz clic para estructurar las 7 secciones de Anamnesis.
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    await handleSave();
                    await onProcessDigitalization(editedText, googleDocsUrl);
                  }}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-all active:scale-95 whitespace-nowrap"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-200 animate-pulse" />
                  <span>{isProcessing ? 'Digitalizando...' : 'Re-Digitalizar Modelo'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Pie de Modal */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-2">
          <span>
            Edita libremente en el panel derecho o conecta con <strong>Google Docs / Word</strong> para edición avanzada.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold shadow-2xs"
          >
            Cerrar Visor & Editor
          </button>
        </div>
      </div>
    </div>
  );
}
