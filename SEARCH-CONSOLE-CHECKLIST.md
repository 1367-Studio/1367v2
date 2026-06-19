# Search Console — manual steps after deploy

Do these once the branch is merged and live on `https://www.1367studio.com`.

## 0. Confirm the deploy fixed the basics
After production deploy, check these URLs return what's expected:

- [ ] `https://www.1367studio.com/robots.txt` → 200, lists the sitemap.
- [ ] `https://www.1367studio.com/sitemap-index.xml` → points to `…/sitemap-0.xml`
      with the **real** host (no more `seu-dominio.com`).
- [ ] `https://www.1367studio.com/sitemap-0.xml` → lists `/` **and** `/contact`.
- [ ] `https://www.1367studio.com/contact` → 200, the contact form renders and sends.
- [ ] View-source on `/` and `/contact`: each has a unique `<title>`, a self-referencing
      `<link rel="canonical">`, and the home has the Organization/WebSite JSON-LD.

## 1. Add the property
- [ ] In [Google Search Console](https://search.google.com/search-console), add a
      **Domain property** for `1367studio.com` (covers http/https + www/non-www + all paths).
- [ ] Verify via **DNS TXT record** at your registrar/DNS provider. (Domain properties can
      only be verified by DNS — not the HTML-file method.)

## 2. Submit the sitemap
- [ ] Sitemaps → submit `sitemap-index.xml` (just the path; the domain is implied).
- [ ] Confirm status becomes **Success** and it discovers 2 URLs.

## 3. Request indexing
- [ ] URL Inspection → enter `https://www.1367studio.com/` → **Request indexing**.
- [ ] Repeat for `https://www.1367studio.com/contact`.

## 4. Watch the Pages report (Indexing → Pages)
Expected exclusion reasons and what they mean **here**:

- **"Discovered – currently not indexed"** — Google knows the URL but hasn't crawled/indexed
  it yet. Normal for a fresh small site; give it days/weeks. Re-request indexing if it lingers.
- **"Crawled – currently not indexed"** — crawled but judged low priority. Usually a
  thin/low-signal-content signal. Our fix (real titles, canonical, JSON-LD, internal links)
  addresses this; the longer-term lever is **publishing real content** (see §6).
- **"Duplicate without user-selected canonical"** — should now disappear: every page emits a
  self-referencing canonical. If it persists, check the page's canonical matches the requested
  URL (host = `www`, no trailing slash except root).
- **"Page with redirect"** — expected for the apex `1367studio.com` (301→`www`). Fine.
- **"Not found (404)"** — expected for the **old `/en/*` Next.js URLs** Google may still
  have on file (see §5). They will drop out of the index over time.

## 5. The old `/en` URLs
There is **no second deployment** anymore — `/en`, `/fr`, `/en/realisations` all return 404
on production today (verified). So there is nothing to consolidate in the codebase.

- [ ] In **Indexing → Pages**, look for any indexed/known `/en/*` URLs.
- [ ] For each old URL still indexed, decide:
      - If it maps to a current page → add a **301 redirect** (e.g. `/en` → `/`). Redirects can
        be added in `astro.config.mjs` (`redirects: { '/en': '/' }`) or `vercel.json`.
      - If it has no equivalent → leave it 404; Google drops 404s from the index automatically.
- [ ] Optionally use **Removals** to speed up dropping any clearly-dead old URL.

## 6. AI / LLM discoverability (GEO)
Generative engines (ChatGPT, Claude, Perplexity, Google AI Overviews) must be able to
crawl the site. State today:

- [x] `robots.txt` explicitly **allows** GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot,
      Claude-Web, anthropic-ai, PerplexityBot, Google-Extended, Applebot(-Extended), CCBot.
- [x] `/llms.txt` published (studio summary, services, locations, key pages).
- [x] Production already returns **200** to GPTBot / ClaudeBot / PerplexityBot user-agents
      (verified) — no platform-level block.
- [x] Rich JSON-LD (Organization + ProfessionalService + service OfferCatalog) so engines
      understand who we are and what we sell.

After deploy, confirm and watch:
- [ ] `https://www.1367studio.com/llms.txt` and `/robots.txt` return 200.
- [ ] **Vercel dashboard → Firewall:** make sure *Attack Challenge Mode* is **off** and no
      WAF/bot rule blocks the AI user-agents above. Vercel does not block them by default,
      but a challenge mode or custom rule would silently break LLM crawling.
- [ ] Validate structured data at <https://search.google.com/test/rich-results> (paste the
      live URL) — expect Organization to parse with no errors.
- [ ] Spot-check discoverability over the next weeks: ask ChatGPT/Claude/Perplexity
      "What is 1367 Studio?" and see whether they cite the site.
- [ ] The biggest GEO lever is the same as SEO: **real, factual, text content** (see §7).
      LLMs summarise text, not animations — keep adding genuine copy and case studies.

## 7. Content backlog (the real long-term SEO lever)
The site is currently a single page + contact. To rank for the geo/keyword terms in the
titles, you need **real, unique pages** — but only with genuine content (no thin pages):

- [ ] Publish real **case studies** in Sanity (`case` type already exists, currently empty).
      Once cases exist we can build `/projects` + `/projects/[slug]` and add them to the sitemap
      and the nav (the nav already auto-shows items once they have a real `href`).
- [ ] Add an **About** page when you have real copy.
- [ ] Decide on localisation (pt-BR / fr) later — the site is English-only for now by design,
      so no `hreflang` is emitted yet (correct).
