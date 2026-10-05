/**
 * Nombre del archivo: src/app/diagnostics/page.tsx
 * Descripción: Página de búsqueda de códigos CIE‑11 y creación de diagnóstico para un paciente.
 * Fecha de última modificación: 2026-09-30
 * Autor: Psicolobos Development Team
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, PlusCircle } from 'lucide-react';

interface DiagnosticItem {
  code: string;
  name: string;
  system: 'CIE_11' | 'DSM_5_TR';
  category: string;
  description: string;
  whoUrl?: string;
}

function DiagnosticSearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const patientId = searchParams.get('patientId'); // opcional, se pasa como query string

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<DiagnosticItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función para buscar en el catálogo
  const fetchResults = useCallback(async (search: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/diagnoses?catalogSearch=${encodeURIComponent(search)}&system=CIE_11`
      );
      const data = await res.json();
      if (res.ok) {
        setResults(data.catalog ?? []);
      } else {
        setError(data.error || 'Error al buscar diagnósticos');
      }
    } catch (e) {
      console.error(e);
      setError('Error de red');
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce de la búsqueda
  useEffect(() => {
    const handler = setTimeout(() => {
      if (query.trim().length > 0) {
        fetchResults(query);
      } else {
        setResults([]);
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [query, fetchResults]);

  // Crear diagnóstico para el paciente seleccionado
  const handleAddDiagnosis = async (item: DiagnosticItem) => {
    if (!patientId) {
      alert('Debe seleccionar un paciente antes de crear el diagnóstico.');
      return;
    }
    try {
      const res = await fetch('/api/diagnoses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId,
          system: item.system,
          code: item.code,
          name: item.name,
          description: item.description,
          status: 'HYPOTHESIS',
          isPrimary: false,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Diagnóstico creado exitosamente');
        // opcional: redirigir a página de paciente
        router.push(`/patients/${patientId}`);
      } else {
        alert(data.error || 'Error al crear diagnóstico');
      }
    } catch (e) {
      console.error(e);
      alert('Error de red al crear diagnóstico');
    }
  };

  return (
    <div className="flex flex-col items-center p-8 bg-slate-50 min-h-screen">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">
        Buscador de códigos CIE‑11
      </h1>
      <div className="w-full max-w-2xl flex items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Buscar por código, nombre o categoría..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-sage-500"
        />
        <button
          onClick={() => query && fetchResults(query)}
          className="p-2 bg-sage-600 text-white rounded-md hover:bg-sage-700"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>

      {loading && <p className="text-slate-500">Cargando resultados...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="w-full max-w-2xl space-y-4">
        {results.map((item) => (
          <div
            key={item.code}
            className="p-4 bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  {item.code} – {item.name}
                </h2>
                <p className="text-sm text-slate-600 mt-1">{item.category}</p>
                <p className="text-xs text-slate-500 mt-2">
                  {item.description}
                </p>
                {item.whoUrl && (
                  <a
                    href={item.whoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sage-600 hover:underline text-xs mt-2 inline-block"
                  >
                    Ver en WHO
                  </a>
                )}
              </div>
              <button
                onClick={() => handleAddDiagnosis(item)}
                className="mt-2 flex items-center gap-1 text-sage-600 hover:text-sage-800"
              >
                <PlusCircle className="w-5 h-5" />
                Añadir
              </button>
            </div>
          </div>
        ))}
        {results.length === 0 && !loading && query && (
          <p className="text-slate-500">No se encontraron resultados.</p>
        )}
      </div>
    </div>
  );
}

import { Suspense } from 'react';

export default function DiagnosticSearchPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Cargando buscador...</div>}>
      <DiagnosticSearchContent />
    </Suspense>
  );
}
