import type { Config } from 'tailwindcss';
const config: Config = {
  content: [
    './app/**/*.{ts,tsx,js,jsx,mdx}',
    './components/**/*.{ts,tsx,js,jsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#D93B00',
          50: '#FFF0E8', 100: '#FFD9C4', 200: '#FFB088',
          300: '#FF884D', 400: '#FF6018', 500: '#D93B00',
          600: '#B02E00', 700: '#852300', 800: '#591700', 900: '#2E0C00'
        },
        ink: { DEFAULT: '#0B0C0E', soft: '#1A1C20', mute: '#5A5F66' }
      },
      fontFamily: {
        display: ['Bebas Neue','Inter','sans-serif'],
        sans: ['Inter','Noto Sans JP','system-ui','sans-serif']
      },
      boxShadow: { card: '0 12px 40px rgba(0,0,0,0.06)' }
    }
  },
  plugins: []
};
export default config;
