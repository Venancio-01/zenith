import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import federation from '@originjs/vite-plugin-federation';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    federation({
      name: 'svelte-app',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/main.ts',
      },
      remotes: {
        ui: 'http://localhost:5173/remoteEntry.js',
        store: 'http://localhost:4178/remoteEntry.js',
      },
      shared: {
        svelte: {},
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
    port: 5176,
    cors: true,
    origin: 'http://localhost:5176',
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  preview: {
    port: 4176,
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
});
