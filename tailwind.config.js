/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brut: {
          bg: 'rgb(var(--brut-bg) / <alpha-value>)',
          ink: 'rgb(var(--brut-ink) / <alpha-value>)',
          panel: 'rgb(var(--brut-panel) / <alpha-value>)',
          shade: 'rgb(var(--brut-shade) / <alpha-value>)',
        },
        lime: 'rgb(var(--lime) / <alpha-value>)',
        limedeep: 'rgb(var(--lime-deep) / <alpha-value>)',
        gold: 'rgb(var(--gold) / <alpha-value>)',
        danger: 'rgb(var(--danger) / <alpha-value>)',
        sky: 'rgb(var(--sky) / <alpha-value>)',
        ink: {
          hi: 'rgb(var(--ink-hi) / <alpha-value>)',
          mid: 'rgb(var(--ink-mid) / <alpha-value>)',
          low: 'rgb(var(--ink-low) / <alpha-value>)',
        },
      },
      fontFamily: {
        display: ['"Archivo Black"', '"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        brut: '18px',
        'brut-lg': '20px',
      },
      borderWidth: {
        3: '3px',
        4: '4px',
      },
      boxShadow: {
        /* 3D key-cap: soft bottom-heavy, not flat offset */
        key: '0 5px 0px rgb(0 0 0 / 0.85), 0 7px 14px rgb(0 0 0 / 0.45)',
        'key-sm': '0 3px 0px rgb(0 0 0 / 0.8), 0 4px 8px rgb(0 0 0 / 0.35)',
        'key-xs': '0 2px 0px rgb(0 0 0 / 0.75), 0 3px 6px rgb(0 0 0 / 0.3)',
        brut: '0 5px 0px rgb(0 0 0 / 0.85), 0 7px 14px rgb(0 0 0 / 0.45)',
        'brut-sm': '0 3px 0px rgb(0 0 0 / 0.8), 0 4px 8px rgb(0 0 0 / 0.35)',
        'brut-xs': '0 2px 0px rgb(0 0 0 / 0.75), 0 3px 6px rgb(0 0 0 / 0.3)',
      },
    },
  },
  plugins: [],
}
