/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter Variable"', 'Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      colors: {
        ink: { DEFAULT: '#0B1030', soft: '#3B4263', muted: '#6B7194' },
        nova: { 50: '#F3F1FF', 100: '#E8E4FF', 200: '#D2CAFF', 500: '#6D4AFF', 600: '#5B3BEB', 700: '#4B2FCC' },
        surface: '#F7F8FC',
        line: '#E4E7F2',
      },
      boxShadow: {
        card: '0 1px 2px rgba(11,16,48,.04), 0 8px 24px -12px rgba(11,16,48,.10)',
        pop: '0 20px 50px -20px rgba(75,47,204,.35)',
      },
    },
  },
  plugins: [],
};
