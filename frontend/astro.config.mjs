import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

const SITE = 'https://www.1367studio.com';

// The site is SSR, so @astrojs/sitemap only sees routes without params.
// Case studies (/projects/[slug]) and posts (/blog/[slug]) come from Sanity:
// fetch their slugs at build time so they're in the sitemap too. A failed
// fetch must never break the build — the static routes still ship.
async function sanityPages() {
  const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');
  const projectId = env.PUBLIC_SANITY_PROJECT_ID ?? process.env.PUBLIC_SANITY_PROJECT_ID;
  const dataset = env.PUBLIC_SANITY_DATASET ?? process.env.PUBLIC_SANITY_DATASET;
  if (!projectId || !dataset) return [];
  const query = encodeURIComponent(
    `{"projects": *[_type == "project" && defined(slug.current)].slug.current, "posts": *[_type == "post" && defined(slug.current)].slug.current}`,
  );
  try {
    const res = await fetch(
      `https://${projectId}.apicdn.sanity.io/v2024-01-01/data/query/${dataset}?query=${query}`,
      { signal: AbortSignal.timeout(8000) },
    );
    if (!res.ok) return [];
    const { result } = await res.json();
    return [
      ...(result?.projects ?? []).map((s) => `${SITE}/projects/${s}`),
      ...(result?.posts ?? []).map((s) => `${SITE}/blog/${s}`),
    ];
  } catch {
    return [];
  }
}

export default defineConfig({
  adapter: vercel(),
  output: 'server',
  site: SITE,
  trailingSlash: 'never',
  integrations: [
    react(),
    sitemap({
      customPages: await sanityPages(),
      // Legal pages are thin boilerplate; keep them crawlable but out of the sitemap.
      filter: (page) => !page.includes('/legal/'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
