/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        mystic: {
          50: '#f5f0ff',
          100: '#ede5ff',
          200: '#ddd0ff',
          300: '#c4abff',
          400: '#a67dff',
          500: '#8b4df0',
          600: '#7c2fe0',
          700: '#6a20c0',
          800: '#581c9c',
          900: '#1a0533',
          950: '#0f0220',
        },
        gold: {
          400: '#d4a853',
          500: '#c4963a',
          600: '#a87b2a',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shuffle': 'shuffle 0.3s ease-in-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(139,77,240,0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(139,77,240,0.6)' },
        },
      },
    },
  },
  plugins: [],
}

