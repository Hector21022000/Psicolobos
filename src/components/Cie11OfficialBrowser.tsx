/**
 * Nombre del archivo: src/components/Cie11OfficialBrowser.tsx
 * Descripción: Navegador nativo CIE-11 (OMS 2026 MMS) clonado del portal oficial icd.who.int,
 *              con árbol de capítulos desplegable, panel de detalle, buscador interactivo,
 *              pestañas de navegación/codificación/información y acciones clínicas (diagnosticar, copiar, insertar).
 * Fecha de última modificación: 2026-09-30
 * Autor: Psicolobos Development Team
 */

'use client';

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import {
  BookOpen,
  Search,
  ExternalLink,
  Plus,
  Copy,
  CheckCircle2,
  Globe,
  Sparkles,
  FileText,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  X,
  Activity,
  Info,
  Code2,
  Compass,
  Loader2,
  AlertTriangle,
  ArrowRight,
  Link2,
} from 'lucide-react';
import { ClinicalDiagnosisItem, DIAGNOSTIC_CATALOG } from '@/lib/catalog-data';
import {
  CIE11_CHAPTERS,
  CIE11_CHAPTER06_BLOCKS,
  CIE11_SPECIAL_ENTITIES,
  Cie11Entity,
  getChildrenOf,
  getEntityById,
  searchCie11FullCatalog,
} from '@/lib/cie11-full-catalog';

interface Cie11OfficialBrowserProps {
  patientId?: string;
  patientName?: string;
  onSelectDiagnosisForReport?: (item: ClinicalDiagnosisItem) => void;
  onDiagnosisCreated?: () => void;
}

// Componente TreeNode recursivo para el árbol de capítulos
function TreeNode({
  entity,
  level,
  selectedEntityId,
  onSelect,
  expandedNodes,
  toggleExpand,
}: {
  entity: Cie11Entity;
  level: number;
  selectedEntityId: string | null;
  onSelect: (entity: Cie11Entity) => void;
  expandedNodes: Set<string>;
  toggleExpand: (id: string) => void;
}) {
  const children = getChildrenOf(entity.id);
  const hasChildren = children.length > 0;
  const isExpanded = expandedNodes.has(entity.id);
  const isSelected = selectedEntityId === entity.id;
  const isChapter = entity.isChapter;
  const isBlock = entity.isBlock;

  return (
    <div className="select-none">
      <div
        className={`flex items-start gap-1 py-1 px-1 cursor-pointer rounded transition-all group text-[12px] leading-snug ${
          isSelected
            ? 'bg-blue-100 text-blue-900 font-bold'
            : 'hover:bg-slate-100 text-slate-700'
        }`}
        style={{ paddingLeft: `${level * 14 + 4}px` }}
        onClick={() => {
          onSelect(entity);
          if (hasChildren) toggleExpand(entity.id);
        }}
      >
        {/* Icono expandir */}
        <span className="mt-0.5 shrink-0 w-4 h-4 flex items-center justify-center">
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            )
          ) : (
            <span className="w-1 h-1 rounded-full bg-slate-300 inline-block" />
          )}
        </span>

        {/* Texto */}
        <span className="flex-1">
          {isChapter && (
            <span className="font-bold text-slate-500 mr-1">{entity.code}</span>
          )}
          {isBlock && (
            <span className="font-mono text-[10px] text-[#484496] mr-1">▸</span>
          )}
          {!isChapter && !isBlock && (
            <span className="font-mono text-[10px] text-[#484496] bg-purple-50 px-1 rounded mr-1 border border-purple-100">
              {entity.code}
            </span>
          )}
          <span className={`${isChapter ? 'font-semibold' : ''} ${isBlock ? 'font-medium text-slate-800' : ''}`}>
            {entity.title}
          </span>
        </span>
      </div>

      {/* Hijos expandidos */}
      {isExpanded && hasChildren && (
        <div>
          {children.map((child) => (
            <TreeNode
              key={child.id}
              entity={child}
              level={level + 1}
              selectedEntityId={selectedEntityId}
              onSelect={onSelect}
              expandedNodes={expandedNodes}
              toggleExpand={toggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Cie11OfficialBrowser({
  patientId,
  patientName,
  onSelectDiagnosisForReport,
  onDiagnosisCreated,
}: Cie11OfficialBrowserProps) {
  const [activeView, setActiveView] = useState<'search' | 'who_iframe'>('who_iframe');
  const [activeTab, setActiveTab] = useState<'navigation' | 'coding' | 'info'>('navigation');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Cie11Entity[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<Cie11Entity | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [creatingDiagId, setCreatingDiagId] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Buscar en el catálogo usando la API oficial de la OMS
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/catalogs/icd11?q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        if (res.ok && data.results) {
          // Mapeamos los resultados de la API para que coincidan con la interfaz local
          const mapped = data.results.map((r: any) => ({
            id: r.code,
            code: r.code,
            title: r.name,
            description: r.name,
            isChapter: false,
            isBlock: false,
            whoUrl: r.whoUrl
          }));
          setSearchResults(mapped);
        } else {
          setSearchResults([]);
        }
      } catch (e) {
        console.error('Error buscando en OMS:', e);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 500); // 500ms de debounce para no saturar la API
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const toggleExpand = useCallback((id: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleSelectEntity = useCallback((entity: Cie11Entity) => {
    setSelectedEntity(entity);
  }, []);

  const handleCopyCode = useCallback((entity: Cie11Entity) => {
    const formattedText = `CIE-11: ${entity.code} – ${entity.title}`;
    navigator.clipboard.writeText(formattedText);
    setCopiedCode(entity.code);
    setTimeout(() => setCopiedCode(null), 2000);
  }, []);

  const handleAssignToPatient = useCallback(async (entity: Cie11Entity) => {
    if (!patientId) {
      alert('Selecciona un paciente en el expediente para registrar este diagnóstico directamente.');
      return;
    }
    setCreatingDiagId(entity.code);
    try {
      const res = await fetch('/api/diagnoses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId,
          code: entity.code,
          name: entity.title,
          system: 'CIE_11',
          status: 'CONFIRMED',
          clinicalNotes: `Diagnóstico verificado en catálogo oficial CIE-11 OMS: ${entity.description}`,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert(`Diagnóstico "${entity.code} – ${entity.title}" registrado correctamente.`);
        if (onDiagnosisCreated) onDiagnosisCreated();
      } else {
        alert(data.error || 'Error al guardar diagnóstico');
      }
    } catch (err) {
      console.error(err);
      alert('Error al conectar con la API de diagnósticos');
    } finally {
      setCreatingDiagId(null);
    }
  }, [patientId, onDiagnosisCreated]);

  const handleSelectForReport = useCallback((entity: Cie11Entity) => {
    if (onSelectDiagnosisForReport) {
      const item: ClinicalDiagnosisItem = {
        code: entity.code,
        name: entity.title,
        system: 'CIE_11',
        category: entity.parent
          ? (getEntityById(entity.parent)?.title || 'Trastornos mentales')
          : 'General',
        description: entity.description,
        whoUrl: entity.whoUrl,
      };
      onSelectDiagnosisForReport(item);
    }
  }, [onSelectDiagnosisForReport]);

  // Expandir capítulo 06 por defecto
  useEffect(() => {
    setExpandedNodes(new Set(['ch06']));
  }, []);

  return (
    <div className="space-y-3 text-xs">
      {/* ══════════ ENCABEZADO OFICIAL ══════════ */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#484496] text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-bold text-slate-900">
                  Buscador Oficial CIE-11 OMS (Clasificación Internacional de Enfermedades)
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-purple-50 text-[#484496] text-[10px] font-extrabold border border-purple-200">
                  OMS 2026 MMS
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Consulta codificada oficial de la OMS para diagnósticos en atención psicoterapéutica e informes clínicos.
              </p>
            </div>
          </div>

          {/* Botones de vista */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-semibold">
              <button
                onClick={() => setActiveView('who_iframe')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 bg-[#484496] text-white shadow-sm`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Navegador OMS Web</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════ VISTA 1: NAVEGADOR NATIVO CIE-11 ══════════ */}
      {activeView === 'search' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Barra superior con badge OMS */}
          <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <span className="font-semibold flex items-center gap-1.5 text-slate-700">
              <ShieldCheck className="w-4 h-4 text-[#484496]" />
              Navegador Oficial ICD-11 MMS de la Organización Mundial de la Salud (OMS 2026)
            </span>
            <a
              href="https://icd.who.int/browse/2026-01/mms/es#491063206"
              target="_blank"
              rel="noreferrer"
              className="text-[#484496] font-bold underline flex items-center gap-1 text-xs"
            >
              <span>Abrir en ventana completa</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Franja azul título CIE-11 */}
          <div className="bg-[#1e3a8a] text-white px-5 py-3 flex flex-col md:flex-row justify-between md:items-center gap-3">
            <div>
              <h2 className="text-base font-bold tracking-tight">
                CIE-11 para estadísticas de mortalidad y morbilidad
              </h2>
              <span className="text-blue-200 text-xs">2026-01</span>
            </div>
            {/* Campo de búsqueda */}
            <div className="relative w-full md:w-80">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Escriba para iniciar la búsqueda"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-3 pr-8 py-2 text-xs bg-white/10 border border-white/30 rounded-md focus:ring-2 focus:ring-white/50 text-white placeholder-blue-200 focus:bg-white/20 transition-all backdrop-blur-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(''); setSearchResults([]); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            {/* Selector idioma (decorativo) */}
            <div className="flex items-center gap-1 text-xs shrink-0">
              <Globe className="w-3.5 h-3.5 text-blue-300" />
              <span className="font-semibold text-blue-200">ES</span>
            </div>
          </div>

          {/* Pestañas de navegación internas */}
          <div className="flex border-b border-slate-200 bg-slate-50">
            <button
              onClick={() => setActiveTab('navigation')}
              className={`px-5 py-2.5 text-xs font-semibold border-b-2 transition-all ${
                activeTab === 'navigation'
                  ? 'border-[#1e3a8a] text-[#1e3a8a] bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                Navegación
              </div>
            </button>
            <button
              onClick={() => setActiveTab('coding')}
              className={`px-5 py-2.5 text-xs font-semibold border-b-2 transition-all ${
                activeTab === 'coding'
                  ? 'border-[#1e3a8a] text-[#1e3a8a] bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5" />
                Herramienta de codificación
              </div>
            </button>
            <button
              onClick={() => setActiveTab('info')}
              className={`px-5 py-2.5 text-xs font-semibold border-b-2 transition-all ${
                activeTab === 'info'
                  ? 'border-[#1e3a8a] text-[#1e3a8a] bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                Información
              </div>
            </button>
          </div>

          {/* ═══ PESTAÑA NAVEGACIÓN ═══ */}
          {activeTab === 'navigation' && (
            <div className="flex flex-col md:flex-row min-h-[550px]">
              {/* Panel Izquierdo: Árbol de Capítulos */}
              <div className="w-full md:w-[420px] border-r border-slate-200 overflow-y-auto max-h-[600px] bg-white">
                {/* Resultados de búsqueda */}
                {searchQuery.trim() ? (
                  <div className="p-3">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">
                      Resultados de búsqueda ({isSearching ? '...' : searchResults.length})
                    </p>
                    {isSearching ? (
                      <div className="flex items-center gap-2 p-4 text-slate-500">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Buscando...</span>
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="space-y-0.5">
                        {searchResults.map((entity) => (
                          <div
                            key={entity.id}
                            onClick={() => handleSelectEntity(entity)}
                            className={`p-2 rounded-lg cursor-pointer transition-all ${
                              selectedEntity?.id === entity.id
                                ? 'bg-blue-100 text-blue-900 border border-blue-200'
                                : 'hover:bg-slate-50 border border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-[10px] text-[#484496] bg-purple-50 px-1.5 py-0.5 rounded border border-purple-100 shrink-0">
                                {entity.code}
                              </span>
                              <span className="text-[12px] font-medium leading-tight">
                                {entity.title}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-slate-500">
                        <AlertTriangle className="w-5 h-5 mx-auto mb-1 text-amber-400" />
                        <p>No se encontraron resultados para &quot;{searchQuery}&quot;</p>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Árbol de capítulos */
                  <div className="p-2">
                    <div className="px-2 py-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <ChevronDown className="w-3 h-3" />
                      CIE-11 para estadísticas de mortalidad y morbilidad
                    </div>
                    {CIE11_CHAPTERS.map((chapter) => (
                      <TreeNode
                        key={chapter.id}
                        entity={chapter}
                        level={0}
                        selectedEntityId={selectedEntity?.id || null}
                        onSelect={handleSelectEntity}
                        expandedNodes={expandedNodes}
                        toggleExpand={toggleExpand}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Panel Derecho: Detalle de la Entidad Seleccionada */}
              <div className="flex-1 overflow-y-auto max-h-[600px] bg-white">
                {selectedEntity ? (
                  <div className="p-5 space-y-4">
                    {/* Título de la entidad */}
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 leading-snug">
                        {selectedEntity.title}
                      </h3>
                      {selectedEntity.whoUrl && (
                        <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                          <span>URI de la fundación:</span>
                          <a
                            href={selectedEntity.whoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#484496] hover:underline font-mono"
                          >
                            {selectedEntity.whoUrl.replace('https://', '').substring(0, 50)}...
                          </a>
                        </p>
                      )}
                    </div>

                    {/* Badge del código */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-extrabold text-sm text-[#484496] bg-purple-50 px-3 py-1 rounded-lg border border-purple-200">
                        CIE-11: {selectedEntity.code}
                      </span>
                      {selectedEntity.isChapter && (
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded border border-blue-200">
                          CAPÍTULO
                        </span>
                      )}
                      {selectedEntity.isBlock && (
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-bold rounded border border-amber-200">
                          BLOQUE
                        </span>
                      )}
                      {!selectedEntity.isChapter && !selectedEntity.isBlock && (
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded border border-emerald-200">
                          ENTIDAD DIAGNÓSTICA
                        </span>
                      )}
                    </div>

                    {/* Descripción */}
                    <div className="border-t border-slate-100 pt-4">
                      <h4 className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1">
                        <Activity className="w-3.5 h-3.5 text-[#484496]" />
                        Descripción
                      </h4>
                      <p className="text-[13px] text-slate-700 leading-relaxed">
                        {selectedEntity.description}
                      </p>
                    </div>

                    {/* Hijos de la entidad */}
                    {(() => {
                      const children = getChildrenOf(selectedEntity.id);
                      if (children.length === 0) return null;
                      return (
                        <div className="border-t border-slate-100 pt-4">
                          <h4 className="text-xs font-bold text-slate-700 mb-2">
                            Subcategorías ({children.length})
                          </h4>
                          <div className="space-y-1">
                            {children.map((child) => (
                              <button
                                key={child.id}
                                onClick={() => {
                                  handleSelectEntity(child);
                                  toggleExpand(selectedEntity.id);
                                }}
                                className="w-full text-left p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all flex items-center gap-2"
                              >
                                <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                                <span className="font-mono text-[10px] text-[#484496] bg-purple-50 px-1 rounded border border-purple-100 shrink-0">
                                  {child.code}
                                </span>
                                <span className="text-[12px] font-medium text-slate-700">
                                  {child.title}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })()}

                    {/* Link a WHO */}
                    {selectedEntity.whoUrl && (
                      <div className="border-t border-slate-100 pt-3">
                        <a
                          href={selectedEntity.whoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-[#484496] hover:text-purple-900 font-bold underline flex items-center gap-1"
                        >
                          <Link2 className="w-3.5 h-3.5" />
                          Ver ficha completa en el portal oficial de la OMS
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}

                    {/* Acciones Clínicas */}
                    {(!selectedEntity.isChapter) && (
                      <div className="border-t border-slate-100 pt-4 flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleCopyCode(selectedEntity)}
                          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all"
                        >
                          {copiedCode === selectedEntity.code ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700 font-bold">¡Copiado!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-slate-500" />
                              <span>Copiar código</span>
                            </>
                          )}
                        </button>

                        {onSelectDiagnosisForReport && (
                          <button
                            type="button"
                            onClick={() => handleSelectForReport(selectedEntity)}
                            className="px-3 py-2 bg-purple-50 hover:bg-purple-100 text-[#484496] border border-purple-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Insertar en Informe</span>
                          </button>
                        )}

                        {patientId && (
                          <button
                            type="button"
                            onClick={() => handleAssignToPatient(selectedEntity)}
                            disabled={creatingDiagId === selectedEntity.code}
                            className="px-4 py-2 bg-[#484496] hover:bg-[#393478] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-50"
                          >
                            {creatingDiagId === selectedEntity.code ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Guardando...</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5" />
                                <span>Diagnosticar{patientName ? ` a ${patientName.split(' ')[0]}` : ''}</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Estado vacío - nada seleccionado */
                  <div className="flex flex-col items-center justify-center h-full p-12 text-center">
                    <BookOpen className="w-12 h-12 text-slate-200 mb-4" />
                    <h4 className="text-sm font-bold text-slate-500 mb-1">
                      Seleccione una entidad
                    </h4>
                    <p className="text-xs text-slate-400 max-w-xs">
                      Use el árbol de capítulos de la izquierda o el buscador para explorar
                      la clasificación CIE-11 de la OMS.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ═══ PESTAÑA HERRAMIENTA DE CODIFICACIÓN ═══ */}
          {activeTab === 'coding' && (
            <div className="p-5 space-y-4 min-h-[400px]">
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                <h4 className="text-sm font-bold text-[#484496] flex items-center gap-2 mb-2">
                  <Code2 className="w-4 h-4" />
                  Herramienta de Codificación CIE-11
                </h4>
                <p className="text-xs text-slate-600 mb-3">
                  Busque un diagnóstico escribiendo el nombre del trastorno, los síntomas principales o el código CIE-11.
                  La herramienta sugerirá los códigos más relevantes.
                </p>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Escriba aquí para buscar (ej: depresión, ansiedad, TDAH, 6B00, estrés postraumático)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 text-xs bg-white border border-purple-300 rounded-xl focus:ring-2 focus:ring-[#484496] focus:border-[#484496]"
                  />
                </div>
              </div>

              {/* Resultados de codificación */}
              {searchQuery.trim() && (
                <div className="space-y-2">
                  {isSearching ? (
                    <div className="flex items-center gap-2 p-4 text-slate-500">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Buscando códigos...</span>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {searchResults.filter(e => !e.isChapter).map((entity) => (
                        <div
                          key={entity.id}
                          className="clinical-card p-4 space-y-2 border border-slate-200 hover:border-[#484496]/50 hover:shadow-md transition-all bg-white cursor-pointer"
                          onClick={() => {
                            handleSelectEntity(entity);
                            setActiveTab('navigation');
                          }}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-mono font-extrabold text-xs text-[#484496] bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                              {entity.code}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); handleCopyCode(entity); }}
                                className="p-1 hover:bg-slate-100 rounded transition-all"
                                title="Copiar código"
                              >
                                {copiedCode === entity.code ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                                )}
                              </button>
                              {patientId && (
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); handleAssignToPatient(entity); }}
                                  disabled={creatingDiagId === entity.code}
                                  className="p-1 hover:bg-purple-50 rounded transition-all"
                                  title="Diagnosticar"
                                >
                                  <Plus className="w-3.5 h-3.5 text-[#484496]" />
                                </button>
                              )}
                            </div>
                          </div>
                          <h4 className="font-bold text-xs text-slate-900 leading-snug">{entity.title}</h4>
                          <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2">{entity.description}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="clinical-card p-8 text-center text-xs text-slate-500 bg-white">
                      No se encontraron códigos coincidentes con &quot;{searchQuery}&quot;.
                      <br />Pruebe con términos como <em>Ansiedad</em>, <em>Depresión</em>, <em>6B00</em> o <em>Autismo</em>.
                    </div>
                  )}
                </div>
              )}

              {/* Estado vacío sin búsqueda */}
              {!searchQuery.trim() && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {['Ansiedad', 'Depresión', 'TDAH', 'Autismo', 'TEPT', 'TOC'].map((term) => (
                    <button
                      key={term}
                      onClick={() => setSearchQuery(term)}
                      className="p-3 bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-200 rounded-xl text-xs font-semibold text-slate-600 hover:text-[#484496] transition-all flex items-center gap-2"
                    >
                      <Search className="w-3.5 h-3.5" />
                      Buscar &quot;{term}&quot;
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ═══ PESTAÑA INFORMACIÓN ═══ */}
          {activeTab === 'info' && (
            <div className="p-5 space-y-4 min-h-[400px]">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
                <h4 className="text-sm font-bold text-[#1e3a8a] flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Acerca de la CIE-11 (ICD-11)
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  La <strong>Clasificación Internacional de Enfermedades, undécima revisión (CIE-11)</strong>,
                  es el estándar internacional para el registro, la notificación, el análisis, la interpretación
                  y la comparación sistemáticos de datos de mortalidad y morbilidad. La CIE-11 fue aprobada por
                  la 72.ª Asamblea Mundial de la Salud en 2019 y entró en vigor el 1 de enero de 2022.
                </p>
                <p className="text-xs text-slate-700 leading-relaxed">
                  La <strong>MMS (Estadísticas de Mortalidad y Morbilidad)</strong> es la linealización principal
                  de la CIE-11, diseñada para la codificación y clasificación estadística.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
                  <h5 className="text-xs font-bold text-slate-800">Versión Implementada</h5>
                  <p className="text-xs text-slate-600">CIE-11 MMS 2026-01 (Enero 2026)</p>
                  <p className="text-xs text-slate-600">Idioma: Español (ES)</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
                  <h5 className="text-xs font-bold text-slate-800">Fuente Oficial</h5>
                  <a
                    href="https://icd.who.int/browse/2026-01/mms/es"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-[#484496] hover:underline font-semibold flex items-center gap-1"
                  >
                    icd.who.int/browse/2026-01/mms/es
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href="https://icd.who.int/icdapi"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-[#484496] hover:underline font-semibold flex items-center gap-1"
                  >
                    API ICD-11 (icd.who.int/icdapi)
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <h5 className="text-xs font-bold text-amber-800 flex items-center gap-1.5 mb-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Aviso Legal
                </h5>
                <p className="text-[11px] text-amber-700 leading-relaxed">
                  Este navegador implementa la estructura y contenido de la CIE-11 según lo publicado por la
                  Organización Mundial de la Salud (OMS). La OMS conserva todos los derechos de propiedad
                  intelectual sobre la CIE-11. Esta herramienta se provee con fines de asistencia clínica
                  y codificación diagnóstica. Para uso oficial, consulte siempre el portal{' '}
                  <a href="https://icd.who.int" target="_blank" rel="noreferrer" className="underline font-semibold">
                    icd.who.int
                  </a>.
                </p>
              </div>

              {/* Estadísticas del catálogo local */}
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <h5 className="text-xs font-bold text-slate-800 mb-2">Contenido del Catálogo Local</h5>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-2 bg-slate-50 rounded-lg">
                    <p className="text-lg font-bold text-[#484496]">{CIE11_CHAPTERS.length}</p>
                    <p className="text-[10px] text-slate-500 font-semibold">Capítulos</p>
                  </div>
                  <div className="text-center p-2 bg-slate-50 rounded-lg">
                    <p className="text-lg font-bold text-[#484496]">
                      {CIE11_CHAPTER06_BLOCKS.filter(e => e.isBlock).length}
                    </p>
                    <p className="text-[10px] text-slate-500 font-semibold">Bloques Cap.06</p>
                  </div>
                  <div className="text-center p-2 bg-slate-50 rounded-lg">
                    <p className="text-lg font-bold text-[#484496]">
                      {CIE11_CHAPTER06_BLOCKS.filter(e => !e.isBlock).length + CIE11_SPECIAL_ENTITIES.filter(e => !e.isBlock).length}
                    </p>
                    <p className="text-[10px] text-slate-500 font-semibold">Entidades Diagnósticas</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════════ VISTA 2: IFRAME OFICIAL OMS ══════════ */}
      {activeView === 'who_iframe' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-md space-y-2 p-2">
          <div className="px-3 py-2 bg-slate-100 rounded-xl flex justify-between items-center text-slate-700 text-xs">
            <span className="font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#484496]" />
              Navegador Oficial ICD-11 MMS de la Organización Mundial de la Salud (OMS 2026)
            </span>
            <a
              href="https://icd.who.int/browse/2026-01/mms/es#491063206"
              target="_blank"
              rel="noreferrer"
              className="text-[#484496] font-bold underline flex items-center gap-1"
            >
              <span>Abrir en ventana completa</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
          <iframe
            src="https://icd.who.int/browse/2026-01/mms/es#491063206"
            className="w-full h-[650px] border border-slate-200 rounded-xl"
            title="Navegador Oficial OMS CIE-11"
          />
        </div>
      )}
    </div>
  );
}
