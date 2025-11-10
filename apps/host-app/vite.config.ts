import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { federation } from '@module-federation/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'host-app',
      remotes: {
        'vue-app': {
          type: 'module',
          name: 'vue-app',
          entry: 'http://localhost:5174/remoteEntry.js',
          entryGlobalName: 'vue-app',
          shareScope: 'default',
        },
        'react-app': {
          type: 'module',
          name: 'react-app',
          entry: 'http://localhost:5175/remoteEntry.js',
          entryGlobalName: 'react-app',
          shareScope: 'default',
        },
        'svelte-app': {
          type: 'module',
          name: 'svelte-app',
          entry: 'http://localhost:5176/remoteEntry.js',
          entryGlobalName: 'svelte-app',
          shareScope: 'default',
        },
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
    port: 5177,
    cors: true,
    origin: 'http://localhost:5177',
  },
});
