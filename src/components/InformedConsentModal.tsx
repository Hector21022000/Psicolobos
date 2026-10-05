/**
 * Nombre del archivo: src/components/InformedConsentModal.tsx
 * Descripción: Modal para la generación y firma manuscrita digital de consentimientos informados de salud mental.
 * Fecha de última modificación: 2026-09-18
 * Autor: Psicolobos Development Team
 */

'use client';

import React, { useState, useRef } from 'react';
import { X, FileCheck, CheckCircle2, RotateCcw } from 'lucide-react';

interface InformedConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
  onConsentSaved?: () => void;
}

export default function InformedConsentModal({
  isOpen,
  onClose,
  patientId,
  patientName,
  onConsentSaved,
}: InformedConsentModalProps) {
  const [consentType, setConsentType] = useState('TELEPSYCHOLOGY');
  const [title, setTitle] = useState('Consentimiento Informado para Atención Psicológica');
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  if (!isOpen) return null;

  // Manejo de lienzo de firma digital
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      const canvas = canvasRef.current;
      if (canvas) {
        setSignatureDataUrl(canvas.toDataURL());
      }
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setSignatureDataUrl(null);
    }
  };

  const handleSaveConsent = async () => {
    if (!signatureDataUrl) {
      alert('Por favor realiza la firma digital antes de guardar.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/consents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId,
          title,
          consentType,
          contentText: `Por medio de la presente, el usuario/paciente ${patientName} declara haber sido informado satisfactoriamente sobre la modalidad de atención psicológica, confidencialidad, límites del secreto profesional y tratamiento de datos personales conforme a la regulación de salud mental.`,
          signatureDataUrl,
        }),
      });

      if (res.ok) {
        alert('Consentimiento informado firmado y registrado exitosamente.');
        if (onConsentSaved) onConsentSaved();
        onClose();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-200">
        {/* Header Modal */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FileCheck className="w-5 h-5 text-sage-400" />
            <div>
              <h3 className="text-sm font-bold">Consentimiento Informado Clínico</h3>
              <p className="text-[11px] text-slate-400">Paciente: {patientName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario */}
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tipo de Consentimiento:</label>
            <select
              value={consentType}
              onChange={(e) => setConsentType(e.target.value)}
              className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sage-500"
            >
              <option value="TELEPSYCHOLOGY">Atención Telepsicológica / Virtual</option>
              <option value="GENERAL_PSYCHOTHERAPY">Psicoterapia Individual Presencial</option>
              <option value="MINORS_EVALUATION">Evaluación de Menores de Edad</option>
              <option value="RECORDING_PERMIT">Permiso para Grabación Audiovisual Supervisada</option>
            </select>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 leading-relaxed max-h-36 overflow-y-auto">
            <p className="font-semibold text-slate-800 mb-1">Cláusulas de Privacidad y Confidencialidad:</p>
            Yo, <strong>{patientName}</strong>, confirmo que he recibido explicación verbal y escrita detallada sobre los objetivos del tratamiento psicológico, los procedimientos utilizados, los límites legales del secreto profesional (riesgo inminente para sí mismo o terceros) y acepto libremente participar.
          </div>

          {/* Lienzo de Firma Digital */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-700">Firma Manuscrita Digital del Paciente:</label>
              <button
                type="button"
                onClick={clearCanvas}
                className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Limpiar Trazo</span>
              </button>
            </div>
            <div className="border-2 border-dashed border-slate-300 rounded-lg bg-slate-50 flex justify-center p-2">
              <canvas
                ref={canvasRef}
                width={450}
                height={140}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="bg-white rounded border border-slate-200 cursor-crosshair shadow-inner"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-100"
          >
            Cancelar
          </button>
          <button
            onClick={handleSaveConsent}
            disabled={saving || !signatureDataUrl}
            className="px-4 py-2 bg-sage-600 hover:bg-sage-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{saving ? 'Registrando...' : 'Confirmar y Guardar Firma'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
