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
          500: '#d4af37',
          600: '#b8942e',
          700: '#9c7a26',
          800: '#80601e',
          900: '#644616',
        },
        mystical: {
          purple: '#6b3fa0',
          indigo: '#3b1f6e',
          teal: '#1a8a7d',
          rose: '#c73e6b',
        },
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Cinzel', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'cosmic-gradient': 'linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 50%, #0a0a1a 100%)',
        'gold-glow': 'radial-gradient(ellipse at center, #d4af37 0%, transparent 70%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'twinkle': 'twinkle 3s ease-in-out infinite',
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
      },
    },
  },
  plugins: [],
};

export default config;
