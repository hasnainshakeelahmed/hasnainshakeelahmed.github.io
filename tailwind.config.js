/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0B1226',
          navyLight: '#16224A',
          navySoft: '#EEF1F8',
          gold: '#F2B705',
          goldDark: '#C98F00',
        },
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(11,18,38,0.06), 0 8px 24px rgba(11,18,38,0.06)',
        cardHover: '0 2px 4px rgba(11,18,38,0.08), 0 16px 40px rgba(11,18,38,0.10)',
      },
    },
  },
  plugins: [],
}
