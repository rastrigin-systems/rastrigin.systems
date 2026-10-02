// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// One static page. The sitemap stays because robots.txt points at it.
export default defineConfig({
  site: 'https://rastrigin.systems',
  integrations: [sitemap()],
});
