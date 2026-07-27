import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        midnight: {
          50: '#e6e6f0',
          100: '#b3b3d1',
          200: '#8080b3',
          300: '#4d4d94',
          400: '#262675',
          500: '#0a0a1a',
          600: '#080815',
          700: '#06060f',
          800: '#04040a',
          900: '#020205',
        },
        gold: {
          50: '#fdf8e8',
          100: '#f9edb8',
          200: '#f5e288',
          300: '#f1d758',
          400: '#edcc28',
          500: '#E5C158',
          600: '#b8942e',
          700: '#9c7a26',
          800: '#80601e',
          900: '#644616',
        },
        space: {
          black: '#040208',
          navy: '#0A0618',
          purple: '#1F0B38',
        },
        imperial: {
          light: '#FFF5C0',
          main: '#E5C158',
          dark: '#946E19',
        },
        cosmic: {
          lilac: '#D8B4F8',
          violet: '#9D4EDD',
        },
        tradition: {
          hermetismo: '#D4AF37',
          tarot: '#9D4EDD',
          runas: '#3A86FF',
          iching: '#00F5D4',
          orixas: '#FF007F',
          kabbalah: '#FFD166',
        },
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Montserrat', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Cinzel', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'cosmic-gradient': 'radial-gradient(circle at center, #1F0B38 0%, #040208 70%)',
        'gold-glow': 'radial-gradient(ellipse at center, #E5C158 0%, transparent 70%)',
        'gold-divider': 'linear-gradient(90deg, transparent, #E5C158, transparent)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'emblem-glow': 'emblemGlow 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGold: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '1' },
        },
        emblemGlow: {
          '0%, 100%': { filter: 'drop-shadow(0 0 25px rgba(229, 193, 88, 0.35))' },
          '50%': { filter: 'drop-shadow(0 0 45px rgba(229, 193, 88, 0.55))' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
