/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(214.3 31.8% 91.4%)',
        input: 'hsl(214.3 31.8% 91.4%)',
        ring: '#00A651',
        background: '#F8FAF8',
        foreground: 'hsl(222.2 84% 4.9%)',

        primary: {
          DEFAULT: 'hsl(222.2 47.4% 11.2%)',
          foreground: 'hsl(210 40% 98%)',
        },
        secondary: {
          DEFAULT: 'hsl(210 40% 96.1%)',
          foreground: 'hsl(222.2 47.4% 11.2%)',
        },
        destructive: {
          DEFAULT: '#EF4444',
          foreground: 'hsl(210 40% 98%)',
        },
        success: {
          DEFAULT: '#10B981', // emerald-500
          foreground: '#059669', // emerald-600, for text
        },
        info: {
          DEFAULT: '#3B82F6', // blue-500
          foreground: '#2563EB', // blue-600, for text
        },
        muted: {
          DEFAULT: 'hsl(210 40% 96.1%)',
          foreground: 'hsl(0 0% 60%)', // Нейтральный серый для лучшей читаемости
        },
        accent: {
          DEFAULT: 'hsl(210 40% 96.1%)',
          foreground: 'hsl(222.2 47.4% 11.2%)',
        },
        popover: {
          DEFAULT: '#FFFFFF',
          foreground: 'hsl(222.2 84% 4.9%)',
        },
        card: {
          DEFAULT: '#FFFFFF',
          foreground: 'hsl(222.2 84% 4.9%)',
        },

        icmop: {
          primary: '#00A651', // Основной зеленый из логотипа
          secondary: '#000000', // Черный из логотипа
          accent: '#FFD700', // Желтый из логотипа
          light: '#4CAF50', // Светлый зеленый для ховеров
          dark: '#008C46', // Темный зеленый для активных состояний
          background: '#F8FAF8', // Светлый фон с зеленым оттенком
        },
      },
      borderRadius: {
        sm: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0, transform: 'translateY(10px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-2px)' },
          '75%': { transform: 'translateX(2px)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out',
        shake: 'shake 0.5s ease-in-out',
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}