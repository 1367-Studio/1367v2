import { defineMiddleware } from 'astro:middleware';
import { markdownPathFor, pagePathFor, renderMarkdown, SITE } from './lib/markdown';

// Serves Markdown versions of the key pages for AI answer engines:
// - explicit URLs: /about.md, /projects/<slug>.md, /index.md for home
// - content negotiation: any key page requested with `Accept: text/markdown`
export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  if (context.request.method !== 'GET' && context.request.method !== 'HEAD') return next();

  if (pathname.endsWith('.md')) {
    const page = pagePathFor(pathname);
    if (markdownPathFor(page) !== pathname) return next();
    const md = await renderMarkdown(page);
    if (!md) return next();
    return markdownResponse(md, page, 'public, max-age=0, s-maxage=300, stale-while-revalidate=86400');
  }

  const mdPath = markdownPathFor(pathname);
  if (!mdPath) return next();

  if (prefersMarkdown(context.request.headers.get('accept'))) {
    const md = await renderMarkdown(pagePathFor(mdPath));
    if (md) {
      const res = markdownResponse(md, pagePathFor(mdPath));
      res.headers.set('Vary', 'Accept');
      return res;
    }
  }

  const res = await next();
  // Same URL returns HTML or Markdown depending on Accept; tell caches.
  try {
    res.headers.append('Vary', 'Accept');
  } catch {}
  return res;
});

function markdownResponse(md: string, page: string, cacheControl?: string): Response {
  const headers = new Headers({
    'Content-Type': 'text/markdown; charset=utf-8',
    // Points search engines at the HTML page so the .md copy isn't treated as duplicate content.
    Link: `<${SITE}${page === '/' ? '' : page}>; rel="canonical"`,
    'X-Content-Type-Options': 'nosniff',
  });
  if (cacheControl) headers.set('Cache-Control', cacheControl);
  return new Response(md, { headers });
}

// True when the client lists text/markdown and ranks it at least as high as HTML.
// Browsers never send text/markdown, so they always get HTML.
function prefersMarkdown(accept: string | null): boolean {
  if (!accept) return false;
  let md = 0;
  let html = 0;
  for (const part of accept.split(',')) {
    const [type, ...params] = part.trim().toLowerCase().split(';');
    const qParam = params.find((p) => p.trim().startsWith('q='));
    const q = qParam ? Number(qParam.trim().slice(2)) || 0 : 1;
    if (type === 'text/markdown' || type === 'text/x-markdown') md = Math.max(md, q);
    else if (type === 'text/html') html = Math.max(html, q);
  }
  return md > 0 && md >= html;
}
