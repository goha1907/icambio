/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0066FF',
          hover: '#0052CC',
          light: '#E6F0FF',
        },
        secondary: {
          DEFAULT: '#FFFFFF',
          hover: '#FFFFFF',
        },
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',
        background: '#F3F4F6',
        'icmop': {
          'primary': '#00A651',    // Основной зеленый из логотипа
          'secondary': '#000000',  // Черный из логотипа
          'accent': '#FFD700',     // Желтый из логотипа
          'light': '#4CAF50',      // Светлый зеленый для ховеров
          'dark': '#008C46',       // Темный зеленый для активных состояний
          'background': '#F8FAF8', // Светлый фон с зеленым оттенком
        },
      },
      borderRadius: {
        sm: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
      },
    },
  },
  plugins: [],
}