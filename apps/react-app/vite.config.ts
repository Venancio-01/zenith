import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';

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
        ui: {
          type: 'module',
          name: 'ui',
          entry: 'http://localhost:5173/remoteEntry.js',
          entryGlobalName: 'ui',
          shareScope: 'default',
        },
      },
      shared: {
        react: {
          singleton: true,
        },
        'react-dom': {
          singleton: true,
        },
        zustand: {
          singleton: true,
        },
        '@zenith/store': {
          singleton: true,
        },
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
