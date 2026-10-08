import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const here = fileURLToPath(new URL('.', import.meta.url));

// Glob projects/ instead of hand-listing: a page added to projects/ can no
// longer stay tracked-but-unbuilt (that is how ble-proximity + triune-alert
// became silent production 404s). projects/ is flat, so readdir is enough.
// Single source of truth for runtime files: public/robots.txt,
// public/sitemap.xml, public/404.html, public/Vaibhav_Raikwar_Resume.pdf,
// public/og/*.jpg. Images live in assets/ and are bundled+hashed by Vite;
// use <picture><source webp><img png></picture> for fallbacks so BOTH
// variants ride the hashed pipeline (never duplicate into public/assets).
const projectPages = readdirSync(resolve(here, 'projects'))
  .filter((f) => f.endsWith('.html'))
  .map((f) => [f.replace(/\.html$/, ''), resolve(here, 'projects', f)]);

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: Object.fromEntries([
        ['main', resolve(here, 'index.html')],
        ...projectPages,
      ]),
    },
  },
});
