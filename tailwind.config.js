/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          50:  '#f0faf0',
          100: '#dcf5dc',
          200: '#b4e8b4',
          300: '#7dcf7d',
          400: '#4aad4a',
          500: '#2d7a22',
          600: '#246319',
          700: '#1a4d12',
          800: '#123810',
          900: '#0f1f0f',
          950: '#080f08',
        },
        status: {
          normal:   '#16a34a',
          warning:  '#d97706',
          critical: '#dc2626',
          'normal-bg':   '#dcfce7',
          'warning-bg':  '#fef3c7',
          'critical-bg': '#fee2e2',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-green':  '0 0 15px rgba(45, 122, 34, 0.35)',
        'glow-amber':  '0 0 15px rgba(217, 119, 6, 0.35)',
        'glow-red':    '0 0 15px rgba(220, 38, 38, 0.35)',
        'card': '0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.12), 0 16px 32px rgba(0,0,0,0.08)',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 6px rgba(220, 38, 38, 0.6)' },
          '50%':       { boxShadow: '0 0 20px rgba(220, 38, 38, 0.9)' },
        },
        'fade-in': {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-left': {
          '0%':   { opacity: '0', transform: 'translateX(-12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'pulse-glow':    'pulse-glow 2s ease-in-out infinite',
        'fade-in':       'fade-in 0.3s ease-out',
        'slide-in-left': 'slide-in-left 0.25s ease-out',
      },
      backgroundImage: {
        'sidebar-gradient': 'linear-gradient(180deg, #0f1f0f 0%, #1a3320 50%, #123810 100%)',
        'forest-gradient':  'linear-gradient(135deg, #1a3320 0%, #2d7a22 100%)',
        'card-green':       'linear-gradient(135deg, #166534 0%, #15803d 100%)',
        'card-red':         'linear-gradient(135deg, #991b1b 0%, #dc2626 100%)',
        'card-amber':       'linear-gradient(135deg, #92400e 0%, #d97706 100%)',
        'card-blue':        'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)',
      },
    },
  },
  plugins: [],
};
