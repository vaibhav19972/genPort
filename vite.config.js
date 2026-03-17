import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        googleHomeNest: resolve(__dirname, 'projects/google-home-nest.html'),
        inpharmd: resolve(__dirname, 'projects/inpharmd.html'),
        punch: resolve(__dirname, 'projects/punch.html'),
        nykaa: resolve(__dirname, 'projects/nykaa.html'),
        nykaaFashion: resolve(__dirname, 'projects/nykaa-fashion.html'),
        coachable: resolve(__dirname, 'projects/coachable.html'),
      },
    },
  },
});
