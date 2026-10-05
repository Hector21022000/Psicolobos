/**
 * Nombre del archivo: src/app/layout.tsx
 * Descripción: Root Layout principal de Next.js para la plataforma clínica Psicolobos.
 * Fecha de última modificación: 2026-09-18
 * Autor: Psicolobos Development Team
 */

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Psicolobos | Plataforma SaaS de Gestión Clínica Psicológica',
  description: 'Sistema integral de gestión clínica, historias de salud mental, asistente IA ético, diagnósticos CIE-11 / DSM-5-TR e informes PDF para profesionales de la psicología.',
  keywords: ['psicologia', 'gestion clinica', 'expediente clinico', 'CIE-11', 'DSM-5-TR', 'salud mental', 'SaaS'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="h-full bg-[#f8f9fc]">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="h-full antialiased text-slate-800 bg-[#f8f9fc] selection:bg-sage-200 selection:text-sage-900 overflow-x-hidden relative">
        {/* Global Liquid Glass Orbs */}
        <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vh] bg-purple-300/40 rounded-full blur-[120px] mix-blend-multiply animate-blob pointer-events-none -z-10"></div>
        <div className="fixed top-[20%] right-[-10%] w-[40vw] h-[60vh] bg-blue-300/40 rounded-full blur-[120px] mix-blend-multiply animate-blob pointer-events-none -z-10" style={{ animationDelay: '2s' }}></div>
        <div className="fixed bottom-[-20%] left-[20%] w-[60vw] h-[60vh] bg-pink-300/40 rounded-full blur-[120px] mix-blend-multiply animate-blob pointer-events-none -z-10" style={{ animationDelay: '4s' }}></div>
        
        <div className="relative z-0 h-full">
          {children}
        </div>
      </body>
    </html>
  );
}
