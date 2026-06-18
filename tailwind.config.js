export default {
  content: [
    "./index.html",
    "./admin.html",
    "./src/**/*.{js,ts,jsx,tsx,html}",
  ],
  theme: {
    extend: {
        fontFamily: {
            sans: ['Inter', 'Noto Sans KR', 'sans-serif'],
        },
        colors: {
            brand: {
                50: '#f0f9ff',
                100: '#e0f2fe',
                500: '#0ea5e9',
                600: '#0284c7',
                900: '#0c4a6e',
                950: '#082f49',
            },
            metal: {
                800: '#1e293b',
                900: '#0f172a',
            }
        }
    },
  },
  plugins: [],
}
