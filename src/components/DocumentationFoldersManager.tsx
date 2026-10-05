/**
 * Nombre del archivo: src/components/DocumentationFoldersManager.tsx
 * Descripción: Componente dinámico interactivo para navegar, visualizar, EDITAR, descargar y aplicar guías clínicas desde 'Carpetas de documentación'.
 * Fecha de última modificación: 2026-09-28
 * Autor: Psicolobos Development Team
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Folder,
  FolderOpen,
  FileText,
  Eye,
  Download,
  CheckCircle2,
  RefreshCw,
  Search,
  BookOpen,
  Sparkles,
  ArrowRight,
  FileCheck,
  Zap,
  X,
  Copy,
  Check,
  Edit,
  Save,
  AlertCircle,
  FileUp,
} from 'lucide-react';
import Badge from '@/components/ui/Badge';

export interface DocumentationFileItem {
  id: string;
  fileName: string;
  folderName: string;
  relativePath: string;
  ext: string;
  sizeBytes: number;
  updatedAt: string;
  previewText: string;
}

export interface DocumentationCategoryItem {
  folderName: string;
  displayName: string;
  fileCount: number;
  files: DocumentationFileItem[];
}

interface DocumentationFoldersManagerProps {
  patientId: string;
  patientName: string;
  onApplied?: () => void;
}

export default function DocumentationFoldersManager({
  patientId,
  patientName,
  onApplied,
}: DocumentationFoldersManagerProps) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [categories, setCategories] = useState<DocumentationCategoryItem[]>([]);
  const [totalFiles, setTotalFiles] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal de Visualización y Edición
  const [selectedFile, setSelectedFile] = useState<DocumentationFileItem | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [editedText, setEditedText] = useState('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const [applyingFileId, setApplyingFileId] = useState<string | null>(null);
  const [applySuccessMsg, setApplySuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchFolders = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/documentation-folders');
      const data = await res.json();

      if (res.ok && data.success) {
        setCategories(data.categories || []);
        setTotalFiles(data.totalFiles || 0);
      } else {
        setErrorMsg(data.error || 'No se pudieron cargar las carpetas de documentación.');
      }
    } catch (err) {
      console.error('Error al consultar carpetas de documentación:', err);
      setErrorMsg('Error de conexión al cargar la biblioteca de documentación.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  const handleOpenViewer = (file: DocumentationFileItem, editMode = false) => {
    setSelectedFile(file);
    setEditedText(file.previewText || '');
    setIsEditingMode(editMode);
    setIsViewerOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedFile) return;
    setIsSavingEdit(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/documentation-folders/save-edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          relativePath: selectedFile.relativePath,
          newContent: editedText,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setApplySuccessMsg(data.message || 'Edición de plantilla guardada con éxito.');
        setIsEditingMode(false);
        fetchFolders(true);
        setTimeout(() => setApplySuccessMsg(null), 5000);
      } else {
        setErrorMsg(data.error || 'No se pudo guardar la edición.');
      }
    } catch (err) {
      console.error('Error al guardar edición:', err);
      setErrorMsg('Error de red al intentar guardar los cambios.');
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleApplyTemplate = async (file: DocumentationFileItem, target: 'anamnesis' | 'session' | 'document') => {
    setApplyingFileId(file.id);
    setApplySuccessMsg(null);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/documentation-folders/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId,
          relativePath: file.relativePath,
          applyTarget: target,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setApplySuccessMsg(data.message || `Plantilla "${file.fileName}" aplicada con éxito al expediente.`);
        if (onApplied) onApplied();
        setTimeout(() => setApplySuccessMsg(null), 6000);
      } else {
        setErrorMsg(data.error || 'Error al aplicar la plantilla al expediente.');
      }
    } catch (err) {
      console.error('Error al aplicar plantilla:', err);
      setErrorMsg('Error de red al intentar vincular el documento al expediente.');
    } finally {
      setApplyingFileId(null);
    }
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const filteredFiles = useMemo(() => {
    let allFiles: DocumentationFileItem[] = [];

    categories.forEach((cat) => {
      if (selectedCategory === 'ALL' || selectedCategory === cat.folderName) {
        allFiles.push(...cat.files);
      }
    });

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      allFiles = allFiles.filter(
        (file) =>
          file.fileName.toLowerCase().includes(query) ||
          file.folderName.toLowerCase().includes(query) ||
          file.previewText.toLowerCase().includes(query)
      );
    }

    return allFiles;
  }, [categories, selectedCategory, searchQuery]);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      {/* Banner de Encabezado Principal */}
      <div className="bg-gradient-to-r from-slate-900 via-[#393478] to-[#484496] rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Badge variant="indigo" className="bg-white/20 text-white border-white/20">
                Directorio Institucional Dinámico
              </Badge>
              <span className="text-xs text-indigo-100 font-medium">Expediente de {patientName}</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <FolderOpen className="w-6 h-6 text-amber-300" />
              Carpetas de Documentación e Historia Clínica
            </h2>
            <p className="text-xs text-indigo-100/90 max-w-2xl leading-relaxed">
              Explora, visualiza, edita y aplica las guías, pautas y modelos clínicos guardados en el servidor. Todos los nuevos documentos que agregues a esta carpeta se sincronizan automáticamente.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <button
              onClick={() => fetchFolders(true)}
              disabled={refreshing}
              className="px-4 py-2 bg-white/15 hover:bg-white/25 active:bg-white/30 backdrop-blur-md text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all border border-white/20 shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? 'Escaneando...' : 'Actualizar Carpetas'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Alertas de Notificación */}
      {applySuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-medium flex items-center gap-3 animate-fade-in shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="flex-1">{applySuccessMsg}</div>
          <button onClick={() => setApplySuccessMsg(null)} className="text-emerald-500 hover:text-emerald-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-medium flex items-center gap-3 animate-fade-in shadow-xs">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <div className="flex-1">{errorMsg}</div>
          <button onClick={() => setErrorMsg(null)} className="text-rose-500 hover:text-rose-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Barra de Filtros, Categorías y Búsqueda */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Tabs de Categorías */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === 'ALL'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Todas ({totalFiles})
            </button>

            {categories.map((cat) => (
              <button
                key={cat.folderName}
                onClick={() => setSelectedCategory(cat.folderName)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.folderName
                    ? 'bg-[#484496] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Folder className="w-3.5 h-3.5 opacity-80" />
                <span>{cat.displayName}</span>
                <span className="ml-1 px-1.5 py-0.2 bg-white/20 rounded-full text-[10px] font-bold">
                  {cat.fileCount}
                </span>
              </button>
            ))}
          </div>

          {/* Campo de Búsqueda */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar documento o contenido..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#484496] focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* Grid de Archivos y Plantillas */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-[#484496] animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Cargando la carpeta institucional de documentación...</p>
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 text-center space-y-3">
          <div className="w-12 h-12 bg-indigo-50 text-[#484496] rounded-full flex items-center justify-center mx-auto">
            <FolderOpen className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-800">No se encontraron documentos</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {searchQuery
                ? 'No coinciden archivos con el término de búsqueda ingresado.'
                : "No hay archivos en las subcarpetas de 'Carpetas de documentación'. Agrega archivos Word (.docx) o PDF en esa ubicación para que aparezcan aquí automáticamente."}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFiles.map((file) => {
            const isWord = file.ext === '.docx' || file.ext === '.doc';
            const isPdf = file.ext === '.pdf';
            const isApplying = applyingFileId === file.id;

            return (
              <div
                key={file.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  {/* Encabezado del Archivo */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                          isWord
                            ? 'bg-blue-50 text-blue-600 border border-blue-100'
                            : isPdf
                            ? 'bg-rose-50 text-rose-600 border border-rose-100'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h4
                          className="text-xs font-bold text-slate-900 truncate group-hover:text-[#484496] transition-colors"
                          title={file.fileName}
                        >
                          {file.fileName}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                          <span className="inline-flex items-center gap-1 font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                            <Folder className="w-3 h-3 text-amber-500" />
                            {file.folderName}
                          </span>
                          <span>•</span>
                          <span>{formatFileSize(file.sizeBytes)}</span>
                        </div>
                      </div>
                    </div>

                    <Badge variant={isWord ? 'blue' : isPdf ? 'red' : 'gray'}>
                      {file.ext.toUpperCase().replace('.', '')}
                    </Badge>
                  </div>

                  {/* Extracto de Vista Previa */}
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs text-slate-700 font-sans leading-relaxed line-clamp-4 max-h-24 overflow-hidden">
                    {file.previewText ? (
                      file.previewText
                    ) : (
                      <span className="italic text-slate-400">Sin vista previa de texto directo.</span>
                    )}
                  </div>
                </div>

                {/* Acciones de la Tarjeta */}
                <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenViewer(file, false)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span>Visualizar</span>
                    </button>

                    <button
                      onClick={() => handleOpenViewer(file, true)}
                      className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
                    >
                      <Edit className="w-3.5 h-3.5 text-amber-600" />
                      <span>Editar</span>
                    </button>

                    <a
                      href={`/api/documentation-folders/download?path=${encodeURIComponent(file.relativePath)}`}
                      download
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all"
                      title="Descargar archivo original"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-500" />
                    </a>
                  </div>

                  {/* Botón Principal para Aplicar */}
                  <div className="flex items-center gap-1.5">
                    {file.folderName.toLowerCase().includes('anamnesis') ? (
                      <button
                        onClick={() => handleApplyTemplate(file, 'anamnesis')}
                        disabled={isApplying}
                        className="px-3.5 py-1.5 bg-[#484496] hover:bg-[#393478] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all disabled:opacity-50"
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-300" />
                        <span>{isApplying ? 'Aplicando...' : 'Aplicar a Anamnesis'}</span>
                      </button>
                    ) : file.folderName.toLowerCase().includes('sesion') || file.folderName.toLowerCase().includes('sesión') ? (
                      <button
                        onClick={() => handleApplyTemplate(file, 'session')}
                        disabled={isApplying}
                        className="px-3.5 py-1.5 bg-[#484496] hover:bg-[#393478] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all disabled:opacity-50"
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-300" />
                        <span>{isApplying ? 'Creando...' : 'Usar en Sesión'}</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleApplyTemplate(file, 'document')}
                        disabled={isApplying}
                        className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-950 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all disabled:opacity-50"
                      >
                        <FileCheck className="w-3.5 h-3.5 text-indigo-300" />
                        <span>{isApplying ? 'Adjuntando...' : 'Adjuntar al Expediente'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal para Lectura y EDICIÓN de Guía Clínica */}
      {isViewerOpen && selectedFile && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200 animate-scale-up">
            {/* Header Modal */}
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-sm font-bold flex items-center gap-2">
                    <span>{selectedFile.fileName}</span>
                    {isEditingMode && (
                      <span className="px-2 py-0.5 bg-amber-500/30 text-amber-300 text-[10px] uppercase font-bold rounded-md border border-amber-400/40">
                        Modo Edición
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-300">
                    Categoría: <span className="text-amber-300 font-semibold">{selectedFile.folderName}</span> • {formatFileSize(selectedFile.sizeBytes)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditingMode(!isEditingMode)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isEditingMode
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>{isEditingMode ? 'Ver Lectura' : 'Editar Guía'}</span>
                </button>

                <button
                  onClick={() => handleCopyText(editedText)}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copiado' : 'Copiar Texto'}</span>
                </button>

                <button
                  onClick={() => setIsViewerOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Cuerpo del Modal: Lectura vs Edición */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4 bg-slate-50">
              {isEditingMode ? (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs text-slate-600 font-medium">
                    <span>Edita el contenido de la plantilla o guía clínica:</span>
                    <span>{editedText.length} caracteres</span>
                  </div>
                  <textarea
                    rows={16}
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    className="w-full p-4 bg-white border border-slate-300 rounded-2xl text-xs text-slate-900 font-mono leading-relaxed focus:ring-2 focus:ring-[#484496] focus:outline-none shadow-xs"
                    placeholder="Escribe o edita el texto de la guía clínica aquí..."
                  />
                </div>
              ) : (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs font-sans text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
                  {editedText || 'Sin texto de lectura directa.'}
                </div>
              )}
            </div>

            {/* Footer Modal con Acciones de Guardado */}
            <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                Expediente: <strong>{patientName}</strong>
              </span>

              <div className="flex items-center gap-2">
                {isEditingMode ? (
                  <button
                    onClick={handleSaveEdit}
                    disabled={isSavingEdit}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-all disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSavingEdit ? 'Guardando...' : 'Guardar Cambios de la Guía'}</span>
                  </button>
                ) : (
                  <>
                    <a
                      href={`/api/documentation-folders/download?path=${encodeURIComponent(selectedFile.relativePath)}`}
                      download
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Descargar Archivo</span>
                    </a>

                    <button
                      onClick={() => {
                        setIsViewerOpen(false);
                        const target = selectedFile.folderName.toLowerCase().includes('anamnesis')
                          ? 'anamnesis'
                          : selectedFile.folderName.toLowerCase().includes('sesion') || selectedFile.folderName.toLowerCase().includes('sesión')
                          ? 'session'
                          : 'document';
                        handleApplyTemplate(selectedFile, target);
                      }}
                      className="px-4 py-2 bg-[#484496] hover:bg-[#393478] text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs"
                    >
                      <Zap className="w-4 h-4 text-amber-300" />
                      <span>Aplicar al Expediente</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
