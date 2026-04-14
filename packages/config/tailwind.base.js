/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [],
  theme: {
    extend: {
      // ─── Wilkins Media Brand Tokens ───────────────────────────────────────
      colors: {
        brand: {
          // Core palette — dark elegant base with premium accents
          black:     '#0A0A0F',
          navy:      '#0D1526',
          slate:     '#141E35',
          surface:   '#1A2540',
          border:    '#243050',
          muted:     '#8A9BC0',
          text:      '#E8EEFF',
          // Primary action — refined gold/amber
          gold:      '#C9A84C',
          'gold-light': '#E8C97A',
          // Accent — electric blue
          electric:  '#3B82F6',
          'electric-light': '#60A5FA',
          // Status
          success:   '#22C55E',
          warning:   '#F59E0B',
          danger:    '#EF4444',
          emergency: '#FF2D2D',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #0D1526 0%, #141E35 50%, #0A0A0F 100%)',
        'gold-gradient': 'linear-gradient(135deg, #C9A84C 0%, #E8C97A 100%)',
        'electric-gradient': 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
      },
      boxShadow: {
        brand: '0 0 0 1px rgba(201, 168, 76, 0.15), 0 4px 24px rgba(0,0,0,0.4)',
        card: '0 2px 16px rgba(0,0,0,0.3)',
        glow: '0 0 20px rgba(59, 130, 246, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.25s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('tailwindcss-animate'),
  ],
};
