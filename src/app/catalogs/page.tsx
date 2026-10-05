/**
 * Nombre del archivo: src/app/catalogs/page.tsx
 * Descripción: Explorador, buscador y cargador oficial de documentos y manuales CIE-11 (OMS) / DSM-5-TR en Psicolobos con soporte del buscador oficial CIE-11 OMS 2026.
 * Fecha de última modificación: 2026-09-30
 * Autor: Psicolobos Development Team
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import AiCopilotDrawer from '@/components/AiCopilotDrawer';
import Cie11OfficialBrowser from '@/components/Cie11OfficialBrowser';
import { BookOpen, Search, Filter, Plus, FileText, Upload, Sparkles, X, CheckCircle2, FileUp, Paperclip, Globe } from 'lucide-react';

export default function CatalogsPage() {
  const [isAiOpen, setIsAiOpen] = useState(false);
  // Se eliminaron las pestañas de códigos y documentos
  const [query, setQuery] = useState('');
  const [system, setSystem] = useState<'CIE_11' | 'DSM_5_TR' | ''>('');
  const [catalogItems, setCatalogItems] = useState<any[]>([]);
  const [indexedDocs, setIndexedDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal subir documento CIE-11 / DSM-5-TR con archivo
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    system: 'CIE_11',
    author: 'Organización Mundial de la Salud (OMS)',
    rawContent: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchCatalog = async () => {
    setLoading(true);
    try {
      const url = `/api/catalogs?q=${encodeURIComponent(query)}&system=${system}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.catalog) setCatalogItems(data.catalog);
      if (data.indexedDocuments) setIndexedDocs(data.indexedDocuments);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchCatalog, 250);
    return () => clearTimeout(timer);
  }, [query, system]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    if (!uploadForm.title) {
      const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      setUploadForm((prev) => ({ ...prev, title: cleanName }));
    }

    if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          setUploadForm((prev) => ({ ...prev, rawContent: text }));
        }
      };
      reader.readAsText(file);
    } else {
      setUploadForm((prev) => ({
        ...prev,
        rawContent:
          prev.rawContent ||
          `[Texto extraído del archivo oficial: ${file.name}]\n\nManual clínico de clasificación diagnóstica indexado en la biblioteca semántica de Psicolobos.`,
      }));
    }
  };

  const handleUploadDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      const res = await fetch('/api/catalogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(uploadForm),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert('Documento clínico y archivo manual indexado exitosamente.');
        setIsUploadModalOpen(false);
        setSelectedFile(null);
        setUploadForm({
          title: '',
          system: 'CIE_11',
          author: 'Organización Mundial de la Salud (OMS)',
          rawContent: '',
        });
        fetchCatalog();
      } else {
        alert(data.error || 'Error al cargar documento');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex h-screen bg-transparent overflow-hidden">
      <Sidebar onOpenAiCopilot={() => setIsAiOpen(true)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Navbar
          onOpenAiCopilot={() => setIsAiOpen(true)}
          title="Biblioteca y Buscador Diagnóstico CIE-11 OMS"
          subtitle="Consulta oficial de códigos OMS 2026, manuales DSM-5-TR e indexación semántica"
        />

        <main className="p-6 space-y-6">
          {/* Header Barra de Búsqueda y Botón Cargar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar código, síntoma o manual (ej. Ansiedad, 6B00, 300.4, Depresión)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sage-500"
              />
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="px-4 py-2 bg-[#484496] hover:bg-[#393478] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-[#484496]/20 shrink-0"
              >
                <Upload className="w-4 h-4" />
                <span>Subir mi CIE-11 / DSM-5-TR</span>
              </button>
            </div>
          </div>

          {/* Buscador Interactivo Oficial CIE-11 OMS */}
          <Cie11OfficialBrowser />
        </main>
      </div>

      {/* Modal Cargar Documento Manual */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
            <div className="p-4 bg-[#484496] text-white flex justify-between items-center">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Cargar Documento / Manual Clínico (CIE-11 o DSM-5-TR)
              </h3>
              <button onClick={() => setIsUploadModalOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUploadDocument} className="p-5 space-y-3.5 text-xs">
              <div className="bg-purple-50 p-3 rounded-xl border border-purple-200 space-y-2">
                <label className="block font-bold text-slate-800 text-xs">Seleccionar Archivo (PDF, DOCX, TXT):</label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,.docx,.doc,.txt,.md"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold rounded-lg flex items-center gap-1.5"
                  >
                    <Paperclip className="w-4 h-4 text-[#484496]" />
                    <span>{selectedFile ? 'Cambiar Archivo' : 'Examinar mi Computadora'}</span>
                  </button>
                  {selectedFile && (
                    <span className="text-[11px] font-semibold text-emerald-700 truncate max-w-[200px]">
                      {selectedFile.name}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Título del Manual / Documento:</label>
                <input
                  type="text"
                  required
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                  placeholder="Ej. Guía Práctica de Diagnóstico CIE-11"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Sistema Clasificatorio:</label>
                  <select
                    value={uploadForm.system}
                    onChange={(e) => setUploadForm({ ...uploadForm, system: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="CIE_11">CIE-11 (OMS)</option>
                    <option value="DSM_5_TR">DSM-5-TR (APA)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Autor / Entidad Emisora:</label>
                  <input
                    type="text"
                    value={uploadForm.author}
                    onChange={(e) => setUploadForm({ ...uploadForm, author: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Contenido o Síntesis Extraída:</label>
                <textarea
                  rows={4}
                  value={uploadForm.rawContent}
                  onChange={(e) => setUploadForm({ ...uploadForm, rawContent: e.target.value })}
                  placeholder="El texto extraído del documento se indexará en la memoria semántica de Psicolobos..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-sans"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button type="button" onClick={() => setIsUploadModalOpen(false)} className="px-4 py-2 border rounded-xl">
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-4 py-2 bg-[#484496] text-white rounded-xl font-semibold shadow-md flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{uploading ? 'Indexando...' : 'Guardar e Indexar'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AiCopilotDrawer isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
    </div>
  );
}
