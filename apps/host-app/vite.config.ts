import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import federation from '@originjs/vite-plugin-federation';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'host-app',
      remotes: {
        'vue-app': 'http://localhost:4174/assets/remoteEntry.js',
        'react-app': 'http://localhost:4175/assets/remoteEntry.js',
        'svelte-app': 'http://localhost:4176/assets/remoteEntry.js',
        ui: 'http://localhost:4173/assets/remoteEntry.js',
        store: 'http://localhost:4178/remoteEntry.js',
      },
      shared: {
        vue: {},
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
    port: 5177,
    cors: true,
    origin: 'http://localhost:5177',
  },
});
