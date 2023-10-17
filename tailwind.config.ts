import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'loading-slade': 'loading-slade 4s ease-in-out infinite'
      },
      keyframes: {
        'loading-slade': {
          '0%': { marginLeft: '-100%', width: '0%' },
          '50%': { width: '30%' },
          '100%': { marginLeft: '100%', width: '0%' }
        }
      }
    },
  },
  plugins: [],
};

export default config;