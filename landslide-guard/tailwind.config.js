/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        base: {
          deep: '#080D18',
          panel: '#0E1830',
          panel2: '#132140',
          line: '#1E3358',
          line2: '#25406E',
        },
        ink: {
          hi: '#EAF0FA',
          mid: '#9FB2D4',
          low: '#4C5F85',
        },
        risk: {
          low: '#22C55E',
          moderate: '#EAB308',
          high: '#F97316',
          critical: '#EF4444',
        },
        signal: {
          DEFAULT: '#2DD4E8',
          dim: '#1AA6B8',
        },
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(45,212,232,0.15), 0 0 24px rgba(45,212,232,0.08)',
        panel: '0 4px 24px rgba(0,0,0,0.35)',
      },
      backgroundImage: {
        contour: "url(\"data:image/svg+xml,%3Csvg%3E%3C/svg%3E\")",
      },
      animation: {
        'pulse-ring': 'pulseRing 2s cubic-bezier(0.4,0,0.6,1) infinite',
        'fade-up': 'fadeUp 0.5s ease-out both',
      },
      keyframes: {
        pulseRing: {
          '0%': { transform: 'scale(0.9)', opacity: '0.8' },
          '70%': { transform: 'scale(1.8)', opacity: '0' },
          '100%': { transform: 'scale(1.8)', opacity: '0' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
