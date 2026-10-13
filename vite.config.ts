import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true, // Membuka akses untuk network/LAN
    port: 5173,
    allowedHosts: true, // Mengizinkan akses dari ngrok
    watch: {
      ignored: [
        '**/api/**',
        '**/audio_storage/**',
        '**/uploads/**',
        '**/temp/**',
        '**/*.json',
      ],
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
      },
      '/static': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
