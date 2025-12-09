// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://cardenasnicolas.com',
  image: {
    domains: ['cardenasnicolas.com'],
  },
  vite: {
    plugins: [tailwindcss()]
  }
});