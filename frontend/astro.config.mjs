// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  // "server" output is required for the Resend contact API route.
  // Switch to "static" if you don't need server endpoints.
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  site: 'https://example.com',
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
