/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-space)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
      },
      colors: {
        indigo: { DEFAULT: '#6366f1', dark: '#4f46e5' },
        cyan: { DEFAULT: '#22d3ee' },
        purple: { DEFAULT: '#a855f7' },
      },
    },
  },
  plugins: [],
};
