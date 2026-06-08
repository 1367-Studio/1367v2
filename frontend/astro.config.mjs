import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  adapter: vercel(),
  output: 'server',
  site: 'https://seu-dominio.com',
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
