import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          red: '#D00000',
          'red-light': '#FF3333',
          'red-dark': '#8B0000',
          black: '#050505', // Darker black
          charcoal: '#0F0F0F', // Darker charcoal
          platinum: '#E5E4E2',
          50: '#fff0f0',
          100: '#ffe0e0',
          200: '#ffc2c2',
          300: '#ff9494',
          400: '#ff5757',
          500: '#D00000', // Main Red
          600: '#a30000',
          700: '#7a0000',
          800: '#660000',
          900: '#540000',
          950: '#300000',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'serif'],
      },
      backgroundImage: {
        'luxury-gradient': 'linear-gradient(to right, #050505, #141414)',
        'red-gradient': 'linear-gradient(135deg, #D00000 0%, #FF3333 50%, #8B0000 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(20, 20, 20, 0.7) 0%, rgba(5, 5, 5, 0.9) 100%)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};
export default config;
