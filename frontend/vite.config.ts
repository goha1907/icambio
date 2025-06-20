import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
 plugins: [react()],
 resolve: {
   alias: {
     '@': path.resolve(__dirname, './src'),
     '@components': path.resolve(__dirname, './src/components'),
     '@pages': path.resolve(__dirname, './src/pages'),
     '@hooks': path.resolve(__dirname, './src/hooks'),
     '@services': path.resolve(__dirname, './src/services'),
     '@utils': path.resolve(__dirname, './src/utils'),
     '@types': path.resolve(__dirname, './src/types'),
     '@assets': path.resolve(__dirname, './src/assets'),
   },
 },
 server: {
   host: true,
   port: 5174,
   strictPort: true,
 }
});