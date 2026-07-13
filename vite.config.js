import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        home: resolve(import.meta.dirname, 'index.html'),
        privacidade: resolve(import.meta.dirname, 'privacidade.html'),
        termos: resolve(import.meta.dirname, 'termos.html'),
        cookies: resolve(import.meta.dirname, 'cookies.html'),
      },
    },
  },
});
