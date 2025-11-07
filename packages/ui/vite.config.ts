import { defineConfig } from 'vite';
import federation from '@originjs/vite-plugin-federation';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    federation({
      name: 'ui',
      filename: 'remoteEntry.js',
      exposes: {
        './components': './src/index.ts',
      },
      shared: ['lit'],
    }),
  ],
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
  server: {
    port: 5173,
  },
  preview: {
    port: 4173,
    cors: true,
    origin: 'http://localhost:4173',
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
});
