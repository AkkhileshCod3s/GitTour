/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        space: { bg: '#0b0f1a', panel: '#111a2e', panel2: '#182543', border: '#24335c' },
        neon: { cyan: '#22d3ee', magenta: '#e879f9', amber: '#fbbf24', green: '#34d399' },
        gold: '#fbbf24',
        danger: '#f87171',
        ink: { hi: '#e2e8f0', mid: '#94a3b8', low: '#64748b' },
      },
      fontFamily: {
        display: ['"Press Start 2P"', 'monospace'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        sans: ['Nunito', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 12px rgba(34,211,238,.35)',
        'glow-lg': '0 0 28px rgba(34,211,238,.5)',
        'glow-gold': '0 0 16px rgba(251,191,36,.45)',
        'glow-magenta': '0 0 16px rgba(232,121,249,.4)',
        'glow-green': '0 0 16px rgba(52,211,153,.4)',
      },
    },
  },
  plugins: [],
}
