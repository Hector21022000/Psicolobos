/**
 * Nombre del archivo: src/components/ui/Modal.tsx
 * Descripción: Componente modal accesible y reutilizable para formularios y confirmaciones.
 * Fecha de última modificación: 2026-09-18
 * Autor: Psicolobos Development Team
 */

'use client';

import { X } from 'lucide-react';
import { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl';
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'lg',
}: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
  }[maxWidth];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slateClinical-900/50 backdrop-blur-sm animate-fade-in">
      <div
        className={`w-full ${widthClasses} bg-white rounded-2xl shadow-clinical-lg overflow-hidden border border-slateClinical-200 flex flex-col max-h-[90vh]`}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slateClinical-100 flex items-center justify-between bg-slateClinical-50/50">
          <h3 className="text-base font-bold text-slateClinical-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slateClinical-400 hover:bg-slateClinical-200 hover:text-slateClinical-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}
