import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const here = fileURLToPath(new URL('.', import.meta.url));

// Glob projects/ instead of hand-listing: a page added to projects/ can no
// longer stay tracked-but-unbuilt (that is how ble-proximity + triune-alert
// became silent production 404s). projects/ is flat, so readdir is enough.
// resume.html is deliberately NOT an input -- it still holds the old resume
// content and its fate is a pending decision.
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
