import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        tms: resolve(__dirname, 'projects/tms.html'),
        uniquelo: resolve(__dirname, 'projects/uniquelo.html'),
        cricbet: resolve(__dirname, 'projects/cricbet.html'),
        clientSites: resolve(__dirname, 'projects/client-sites.html'),
        senpiper: resolve(__dirname, 'projects/senpiper.html'),
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
