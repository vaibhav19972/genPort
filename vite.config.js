import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        bleProximity: resolve(__dirname, 'projects/ble-proximity.html'),
        triuneAlert: resolve(__dirname, 'projects/triune-alert.html'),
      },
    },
  },
});
