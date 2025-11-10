import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { federation } from '@module-federation/vite';

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
        ui: {
          type: 'module',
          name: 'ui',
          entry: 'http://localhost:5173/remoteEntry.js',
          entryGlobalName: 'ui',
          shareScope: 'default',
        },
      },
      shared: {
        svelte: {
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
