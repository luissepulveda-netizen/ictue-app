/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ictue: {
          red: '#C41E3A',      // Rojo principal ICTUE
          darkred: '#A01830',   // Rojo oscuro
          lightred: '#EF4444',  // Rojo más claro
          darkgray: '#374151',  // Gris oscuro
          lightgray: '#F3F4F6', // Gris claro
          mediumgray: '#9CA3AF', // Gris medio
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'ictue': '0 4px 6px -1px rgba(196, 30, 58, 0.1)',
      }
    },
  },
  plugins: [],
}
