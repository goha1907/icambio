import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Загружаем переменные окружения из корня проекта
  const env = loadEnv(mode, path.resolve(__dirname, '..'), '');
  
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    // Указываем Vite где искать .env файлы
    envDir: path.resolve(__dirname, '..'), // Корень проекта
    // Настраиваем сервер разработки
    server: {
      port: 5173,
      host: true
    },
    // Добавляем переменные окружения в процесс сборки
    define: {
      'process.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL),
      'process.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY),
    }
  };
});