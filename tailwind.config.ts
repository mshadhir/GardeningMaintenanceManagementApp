import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f2fbf6',
          100: '#daf5e4',
          200: '#b4ecca',
          300: '#83dca8',
          400: '#4fc484',
          500: '#2aa66a',
          600: '#1a8456',
          700: '#176a48',
          800: '#16553d',
          900: '#144636'
        }
      }
    }
  },
  plugins: [],
};

export default config;
