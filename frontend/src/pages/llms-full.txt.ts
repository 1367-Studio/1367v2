import type { APIRoute } from 'astro';
import { llmsFullTxt } from '../lib/markdown';

export const prerender = false;

export const GET: APIRoute = async () =>
  new Response(await llmsFullTxt(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=86400',
    },
  });
