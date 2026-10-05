/**
 * Nombre del archivo: tailwind.config.js
 * Descripción: Configuración de Tailwind CSS con la paleta de colores clínicos psicoPurple y estados de Psicolobos.
 * Fecha de última modificación: 2026-09-18
 * Autor: Psicolobos Development Team
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        psicoPurple: {
          50: '#F5F4FB',
          100: '#EAE8FA',
          200: '#D5D1F5',
          300: '#B4ACEB',
          400: '#877CDA',
          500: '#6256C4',
          600: '#484496', // Color principal exacto del diseño PsicoCMS
          700: '#393478',
          800: '#2D295F',
          900: '#211E46',
        },
        sage: {
          50: '#F4F7F5',
          100: '#E6EFEA',
          200: '#C7DCD2',
          300: '#A3C4B4',
          400: '#7AA791',
          500: '#528970',
          600: '#3D6C57',
          700: '#2D5141',
          800: '#213B30',
          900: '#162720',
        },
        slateClinical: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'clinical': '0 4px 20px -2px rgba(30, 41, 59, 0.05), 0 2px 6px -1px rgba(30, 41, 59, 0.03)',
        'clinical-lg': '0 10px 30px -4px rgba(30, 41, 59, 0.08), 0 4px 12px -2px rgba(30, 41, 59, 0.04)',
      },
      animation: {
        blob: "blob 7s infinite",
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
      },
    },
  },
  plugins: [],
};

