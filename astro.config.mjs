// @ts-check
import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import sitemap from "@astrojs/sitemap";
import sanity from "@sanity/astro";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  // "server" output is required for the Resend contact API route.
  // Switch to "static" if you don't need server endpoints.
  output: "server",
  adapter: node({ mode: "standalone" }),
  site: "https://example.com",
  integrations: [
    sanity({
      projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
      dataset: import.meta.env.PUBLIC_SANITY_DATASET,
      apiVersion: import.meta.env.PUBLIC_SANITY_API_VERSION,
      useCdn: true,
      // Set to true to enable the embedded Sanity Studio at /studio
      studioBasePath: "/studio",
    }),
    sitemap(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
