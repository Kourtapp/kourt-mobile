/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        'display': ['System'],
        'body': ['System'],
      },
      colors: {
        // Cores Principais
        primary: '#000000',
        background: '#FAFAFA',

        // Escala de Cinzas (Neutral)
        neutral: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },

        // Cores de Destaque
        lime: {
          100: '#ecfccb',
          500: '#84CC16',
          700: '#4d7c0f',
          950: '#1A2E05',
        },
        amber: {
          400: '#FBBF24',
          500: '#F59E0B',
        },
        green: {
          400: '#4ADE80',
          500: '#22C55E',
        },
        blue: {
          500: '#3B82F6',
          600: '#2563EB',
        },
        cyan: {
          500: '#06B6D4',
        },
        red: {
          500: '#EF4444',
        },
        purple: {
          600: '#9333EA',
        },
      },
    },
  },
  plugins: [],
};
