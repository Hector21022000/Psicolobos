/**
 * Nombre del archivo: next.config.mjs
 * Descripción: Configuración principal de Next.js para la plataforma Psicolobos.
 * Fecha de última modificación: 2026-09-18
 * Autor: Psicolobos Development Team
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb'
    }
  }
};

export default nextConfig;
