import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './store/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        serif: ['Cormorant Garamond', 'serif'],
        devanagari: ['Noto Sans Devanagari', 'sans-serif'],
      },
      colors: {
        'indigo-deepest': 'var(--color-indigo-deepest)',
        'indigo-primary': 'var(--color-indigo-primary)',
        'indigo-mid': 'var(--color-indigo-mid)',
        'indigo-light': 'var(--color-indigo-light)',
        amethyst: 'var(--color-amethyst)',
        'star-white': 'var(--color-star-white)',
        'gold-warm': 'var(--color-gold-warm)',
        'gold-note': 'var(--color-gold-note)',
        'bg-light': 'var(--color-bg-light)',
        'bg-surface': 'var(--color-bg-surface)',
        'text-dark': 'var(--color-text-dark)',
        'text-mid': 'var(--color-text-mid)',
        'text-muted': 'var(--color-text-muted)',
        divider: 'var(--color-divider)',
        'divider-strong': 'var(--color-divider-strong)',
        success: 'var(--color-success)',
        error: 'var(--color-error)',
        whatsapp: 'var(--color-whatsapp)',
      },
      borderRadius: {
        card: '14px',
        button: '10px',
        pill: '9999px',
      },
      transitionTimingFunction: {
        sacred: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      zIndex: {
        base: '1',
        content: '10',
        sticky: '20',
        overlay: '40',
        chat: '50',
        modal: '60',
        toast: '70',
      },
    },
  },
  plugins: [
    function ({ addUtilities }: { addUtilities: (utilities: Record<string, Record<string, string>>) => void }) {
      addUtilities({
        '.no-scrollbar': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
        },
        '.no-scrollbar::-webkit-scrollbar': {
          display: 'none',
        },
      });
    },
  ],
};

export default config;
