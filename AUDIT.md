# 1367 Studio — SEO / Crawlability Audit (Phase 0)

_Date: 2026-06-19 — pre-change snapshot._

## TL;DR

The site is **not penalised** and there is **no dual deployment**. The reasons Google
struggles are concrete and fixable:

1. **The sitemap is broken** — it is generated against the placeholder host
   `https://seu-dominio.com` (literally "your-domain" in Portuguese), so every URL Google
   reads from it is wrong/unreachable.
2. **No `robots.txt`** — `/robots.txt` returns 404 in production.
3. **No per-page SEO primitives** — no `<link rel="canonical">`, no Open Graph / Twitter
   tags, no JSON-LD, `<html lang>` hardcoded to `en`.
4. **Internal links are dead** — the header nav items have **no `href` at all** in Sanity;
   the footer falls back to `href="#"` placeholders.
5. The site is effectively a **single page** today. The nav promises Projects / About /
   Contact, but none of those pages exist and **Sanity has zero case/post content**.

---

## 1. Framework & build

| Thing | Finding |
|---|---|
| Framework | **Astro 5** (`astro@^5.3.0`), single app under [`frontend/`](frontend/) |
| Rendering | **SSR** — `output: 'server'` in [`astro.config.mjs`](frontend/astro.config.mjs) |
| Adapter | `@astrojs/vercel` (Vercel serverless) |
| Islands | `@astrojs/react` (Three.js / Unicorn / GSAP scenes) |
| Styling | Tailwind v4 via `@tailwindcss/vite`; tokens in [`global.css`](frontend/src/styles/global.css) |
| CMS | Sanity (`@sanity/client`), project `ydpqen8a`, dataset `production` |
| Sitemap | `@astrojs/sitemap` **already installed and wired** |
| `site:` | ❌ **`https://seu-dominio.com`** — placeholder, this is the root cause of #1 |
| `next.config.*` | **None.** No Next.js anywhere in the repo. |

Design tokens (reuse these — do not invent new ones):
`--color-primary: #f43c00`, `--color-ink: #191919`, `--color-muted: #7a7a7a`,
`--color-white: #fff`. Fonts: Geist / Geist Mono / Satoshi / Instrument Sans / Inter.

## 2. Routing & i18n

- **Pages that exist:** exactly one — [`src/pages/index.astro`](frontend/src/pages/index.astro).
  Plus one API route [`src/pages/api/contact.ts`](frontend/src/pages/api/contact.ts)
  (working Resend email endpoint).
- **No i18n at all** — no Astro `i18n` config, no locale folders, no `/fr` or `/en` routes.
  `<html lang="en">` is hardcoded in [`Layout.astro`](frontend/src/layouts/Layout.astro).
- Content is currently **English-only**.

## 3. Dual-deployment investigation (the `/en` Next.js theory)

**Ruled out on current production.** Live probes against `https://www.1367studio.com`:

| URL | Result |
|---|---|
| `http→ /` (apex) | `307` → `https://www.1367studio.com/` ✅ single canonical host (www) |
| `/` (www) | `200`, Astro HTML, `<title>1367 — Studio</title>`, `lang="en"` |
| `/en` | **`404` NOT_FOUND** |
| `/fr` | **`404` NOT_FOUND** |
| `/en/realisations` | **`404` NOT_FOUND** |
| `/sitemap-index.xml` | `200` but points to `seu-dominio.com` (broken, see #1) |
| `/sitemap.xml` | `404` |
| `/robots.txt` | `404` |

There is **no second deployment to consolidate**. If Google has stale `/en/*` URLs indexed,
they are historical — those paths now return 404 and will drop out naturally. (We can add
explicit 301s only if we get the exact old paths from Search Console; nothing to do in-repo
right now.) **Per guardrail #6 there is nothing to stop-and-confirm here — no deletion or
redirect of a live deployment is needed.**

## 4. Sanity integration

- Client: [`src/lib/sanity.ts`](frontend/src/lib/sanity.ts). Schema in [`sanity/schemaTypes/`](sanity/schemaTypes/).
- The home is fully CMS-driven: singleton section documents (`heroSection`, `statementSection`,
  `testimonialsSection`, `tickerSection`, `featuredCase*Section`, `letsBuildSection`,
  `projectSection`) plus `header` / `footer` singletons.
- **Collection content types exist but are EMPTY:**
  - `case` (has `title`, `slug`, `client`, `year`, `services`, `coverImage`, `excerpt`, `seo`) → **0 documents**
  - `post` → **0 documents**
- A reusable `seo` object (title / description / ogImage) is defined on `case` but unused.
- **Header navigation in Sanity = `Projects`, `About us`, `Contact us` — all with NO `href` set.**
- **Footer `navLinks` and `ctaHref` are null in Sanity** → component defaults (`href="#"`) render.

> ⚠️ **Content guardrail consequence:** there is no real Projects/case-study or About content
> to publish. Building `/projects`, `/projects/[slug]`, or `/about` right now would create
> **empty or thin pages**, which violates guardrail #2 (no thin/duplicate pages). Contact is
> the exception — a working form + API already exist, so a real `/contact` page is legitimate.

## 5. Dead / placeholder links (full inventory)

`grep 'href="#"'` in source returns nothing literally, because the placeholders live in
**component prop defaults** and in **Sanity data**, not as static `#` strings in markup:

| Location | Issue |
|---|---|
| Header nav (Sanity-driven) | 3 items render `<a href={undefined}>` — not navigable. [`Header.astro:26,39,53`](frontend/src/components/Header.astro#L26) |
| Footer nav defaults | `navLinks` default = 5× `href="#"`. [`Footer.astro:27-33`](frontend/src/components/Footer.astro#L27) |
| Footer CTA | `ctaHref = '#'` default. [`Footer.astro:26`](frontend/src/components/Footer.astro#L26) |
| `FeaturedCase3` card CTA | `href={c.ctaHref ?? '#'}`. [`FeaturedCase3.astro:66`](frontend/src/components/FeaturedCase3.astro#L66) |
| `LetsBuild` / `FeaturedCase` / `FeaturedCase2` | `ctaHref = '#'` defaults (FeaturedCase/2 currently commented out in index). |
| `index.astro` | passes `?? "#"` fallbacks for several CTAs. [`index.astro:46,60,71,80`](frontend/src/pages/index.astro#L46) |

## 6. SEO primitives present today

| Primitive | Status |
|---|---|
| `<title>` / `<meta description>` | ✅ present (props w/ defaults), but home `<title>` = `"1367 — Studio"` (weak, no keywords/geo) |
| `<link rel="canonical">` | ❌ missing |
| Open Graph / Twitter cards | ❌ missing |
| `hreflang` / `x-default` | ❌ missing (single language) |
| JSON-LD (Organization / LocalBusiness / WebSite) | ❌ missing — note real location data exists in footer (Marseille, London, Florianópolis) |
| `robots.txt` | ❌ missing |
| Sitemap | ⚠️ generated but wrong host |

---

## Ordered plan

### Safe & high-value — no content decisions required (do first)
1. **Fix `site`** in `astro.config.mjs` → canonical host; set `trailingSlash` explicitly.
2. **Add `public/robots.txt`** pointing at `/sitemap-index.xml`.
3. Confirm sitemap emits correct absolute URLs after the host fix.
4. **Create a reusable `<BaseHead>` / `<Seo>` component** used by `Layout.astro`: title,
   description, self-referencing canonical, OG + Twitter, `<html lang>`, defaults + overrides.
5. **Add JSON-LD** — `Organization` / `ProfessionalService` (with the real 3 locations from
   the footer) + `WebSite`. This is real data, no fabrication.
6. **Wire the dead links** that have a real destination: Contact → `/contact`; the home-section
   nav items → on-page anchors.
7. **Build a real `/contact` page** (form + API already exist) reusing the design system.

### Blocked on your decisions (Phase 3 / 5)
- **Primary language** — the CONFIG block was left as an example (`pt-BR` vs `fr`). This drives
  `lang`, `hreflang`, JSON-LD and the language of any new copy. **Needs your call.**
- **Projects / About pages** — no real content exists in Sanity. Options: (a) point nav to
  on-page sections for now and build these only when content lands; (b) you give me real copy /
  Sanity entries to build them properly. I will **not** ship empty/thin pages.

> Recommendation: ship the "safe & high-value" block now (it fixes the actual indexing
> blockers), and decide language + Projects/About once you confirm the two questions above.
