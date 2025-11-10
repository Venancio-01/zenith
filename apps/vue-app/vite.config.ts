import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { federation } from '@module-federation/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'vue-app',
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
        vue: {
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
    port: 5174,
    cors: true,
    origin: 'http://localhost:5174',
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  preview: {
    port: 4174,
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
});
