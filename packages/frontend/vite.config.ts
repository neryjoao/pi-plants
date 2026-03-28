import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    allowedHosts: ['plants.local', 'localhost'],
    proxy: {
      '/plantsDetails': 'http://localhost:3001',
      '/name': 'http://localhost:3001',
      '/updateThreshold': 'http://localhost:3001',
      '/setWateringMode': 'http://localhost:3001',
      '/toggleWater': 'http://localhost:3001',
      '/schedule': 'http://localhost:3001',
      '/environmentDetails': 'http://localhost:3001',
      '/environment': 'http://localhost:3001',
    }
},
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
