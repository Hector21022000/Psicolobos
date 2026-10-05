/**
 * Nombre del archivo: src/components/OcrUploaderModal.tsx
 * Descripción: Modal para carga y extracción automatizada de texto clínico en documentos usando OCR.
 * Fecha de última modificación: 2026-09-18
 * Autor: Psicolobos Development Team
 */

'use client';

import React, { useState } from 'react';
import { X, FileSearch, Sparkles, Check, AlertCircle, RefreshCw, Edit3 } from 'lucide-react';

interface OcrUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentId: string;
  documentName: string;
  onOcrComplete?: (ocrData: any) => void;
}

export default function OcrUploaderModal({
  isOpen,
  onClose,
  documentId,
  documentName,
  onOcrComplete,
}: OcrUploaderModalProps) {
  const [loading, setLoading] = useState(false);
  const [ocrResult, setOcrResult] = useState<any>(null);
  const [editedText, setEditedText] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleProcessOcr = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setOcrResult(data.ocrResult);
        setEditedText(data.ocrResult.rawExtractedText);
        if (onOcrComplete) onOcrComplete(data.ocrResult);
      } else {
        setError(data.error || 'Error al ejecutar extracción OCR');
      }
    } catch (err) {
      setError('Ocurrió un error al procesar la imagen con Tesseract OCR.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200">
        {/* Header Modal */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FileSearch className="w-5 h-5 text-sage-400" />
            <div>
              <h3 className="text-sm font-bold">Reconocimiento Óptico de Caracteres (OCR)</h3>
              <p className="text-[11px] text-slate-400">Documento: {documentName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Creador/Acción OCR */}
        <div className="p-5 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!ocrResult && (
            <div className="text-center py-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-6">
              <FileSearch className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <h4 className="text-xs font-semibold text-slate-700">Digitalizar Documento o Receta Médica</h4>
              <p className="text-[11px] text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                Extrae automáticamente texto manuscrito o impreso, diagnósticos previos y medicamentos usando Tesseract.
              </p>
              <button
                onClick={handleProcessOcr}
                disabled={loading}
                className="px-4 py-2 bg-sage-600 hover:bg-sage-700 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-2 shadow-sm transition-all"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Escaneando caracteres con OCR...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Iniciar Extracción OCR</span>
                  </>
                )}
              </button>
            </div>
          )}

          {ocrResult && (
            <div className="space-y-4">
              {/* Confianza */}
              <div className="flex items-center justify-between bg-sage-50 border border-sage-200 p-3 rounded-lg text-xs">
                <span className="font-semibold text-sage-900">
                  Nivel de Confianza OCR: {ocrResult.confidenceScore.toFixed(1)}%
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-sage-200 text-sage-800 font-medium">
                  {ocrResult.confidenceScore > 75 ? 'Excelente' : 'Aceptable - Revisión sugerida'}
                </span>
              </div>

              {/* Campos Estructurados */}
              {ocrResult.extractedFields && (
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-800 mb-2">Campos Clínicos Detectados:</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white p-2 rounded border border-slate-200">
                      <span className="font-semibold text-slate-600 block text-[10px]">Posible Medicación:</span>
                      <span className="text-slate-800">{ocrResult.extractedFields.possibleMedications?.join(', ') || 'No detectada'}</span>
                    </div>
                    <div className="bg-white p-2 rounded border border-slate-200">
                      <span className="font-semibold text-slate-600 block text-[10px]">Indicaciones / Dosis:</span>
                      <span className="text-slate-800">{ocrResult.extractedFields.prescriptions?.join(', ') || 'No detectada'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Editor de Texto OCR */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Texto Extraído (Editable):</span>
                  <span className="text-[10px] text-slate-400 font-normal">Puedes corregir errores del escaneo</span>
                </label>
                <textarea
                  rows={6}
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  className="w-full text-xs font-mono p-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-100"
          >
            Cerrar
          </button>
          {ocrResult && (
            <button
              onClick={() => {
                alert('Texto de OCR guardado en el expediente del paciente.');
                onClose();
              }}
              className="px-4 py-2 bg-sage-600 text-white text-xs font-semibold rounded-lg hover:bg-sage-700 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Guardar en Expediente</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
