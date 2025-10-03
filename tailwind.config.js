/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        brand: {
          DEFAULT: 'var(--brand)',
          dark: 'var(--brand-dark)',
          light: 'var(--brand-light)',
        },
        // Ensure consistent color definitions
        primary: {
          green: '#EF2C82',
          'dark-green': '#7C3AED',
          'light-green': '#FF8A00',
          mint: '#FFD1A3',
        },
        sidebar: {
          active: '#EF2C82',
          hover: '#F1F5F9',
        },
        background: {
          sidebar: '#FFFFFF',
          header: '#FFFFFF',
          content: '#F8FAFC',
          main: '#F1F5F9',
        },
        text: {
          primary: '#1E293B',
          secondary: '#64748B',
          muted: '#94A3B8',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'ui-sans-serif', 'system-ui'],
        mono: ['var(--font-geist-mono)', 'ui-monospace'],
      },
    },
  },
  plugins: [],
}
