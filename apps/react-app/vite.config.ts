import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'react-app',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/main.tsx',
      },
      remotes: {
        ui: 'http://localhost:5173/remoteEntry.js',
        store: 'http://localhost:4178/remoteEntry.js',
      },
      shared: {
        react: {},
        'react-dom': {},
        zustand: {},
        '@zenith/store': {},
      },
    }),
  ],
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
  server: {
    port: 5175,
    cors: true,
    origin: 'http://localhost:5175',
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  preview: {
    port: 4175,
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
});
