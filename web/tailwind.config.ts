import type { Config } from 'tailwindcss';
const config: Config = {
  content: [
    './app/**/*.{ts,tsx,js,jsx,mdx}',
    './components/**/*.{ts,tsx,js,jsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        // Editorial cream-vermilion palette
        cream:    { DEFAULT: '#EEECE7', 50: '#FAF9F6', 100: '#F4F2EC', 200: '#EEECE7', 300: '#E2DED5', 400: '#CFC9BC' },
        vermilion:{ DEFAULT: '#D3300A', 50:'#FCEBE6', 100:'#F8C9BD', 200:'#F19884', 300:'#E66B4F', 400:'#DA4A29', 500:'#D3300A', 600:'#A82408', 700:'#7C1A06', 800:'#511104', 900:'#2D0902' },
        cobalt:   { DEFAULT: '#0941E1', 50:'#E5EBFD', 100:'#C5D2FA', 200:'#8DA8F4', 300:'#5680EE', 400:'#2B5DE8', 500:'#0941E1', 600:'#0734B2', 700:'#052783', 800:'#031A55', 900:'#020D2A' },
        ink:      { DEFAULT: '#060E31', soft: '#1A2147', mute: '#5A618A' },
        paper:    { DEFAULT: '#FAF9F6', soft: '#F4F2EC' }
      },
      fontFamily: {
        // Editorial display: Noto Serif JP for Japanese, Playfair for Latin
        serif:   ['"Noto Serif JP"','"Playfair Display"','"Times New Roman"','serif'],
        // Tight sans for body
        sans:    ['"Inter Tight"','"Inter"','"Noto Sans JP"','system-ui','sans-serif'],
        // Mono for tags/code
        mono:    ['"JetBrains Mono"','"Roboto Mono"','monospace']
      },
      letterSpacing: {
        tightest: '-0.045em',
        editorial: '-0.025em'
      },
      boxShadow: {
        page: '0 30px 80px -40px rgba(6,14,49,0.25)',
        card: '0 1px 0 rgba(6,14,49,0.06), 0 14px 30px -16px rgba(6,14,49,0.12)',
        soft: '0 1px 0 rgba(6,14,49,0.06)'
      },
      maxWidth: {
        'editorial': '1320px',
        'measure':   '68ch'
      }
    }
  },
  plugins: []
};
export default config;
