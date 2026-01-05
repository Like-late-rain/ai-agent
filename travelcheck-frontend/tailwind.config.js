/**
 * @file Tailwind CSS配置
 * @description 主题色、断点和自定义类配置
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#13ec5b',
          hover: '#0fd650',
        },
        background: {
          dark: '#102216',
        },
        card: {
          dark: '#1a2c20',
        },
        border: {
          dark: '#23482f',
        },
        text: {
          muted: '#92c9a4',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        glow: '0 0 20px rgba(19, 236, 91, 0.3)',
        'glow-strong': '0 0 30px rgba(19, 236, 91, 0.5)',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
