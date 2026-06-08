# 1367 v2

Starter project — **Astro + Sanity + Tailwind v4 + GSAP + Lenis + SplitType + Resend**.

## Stack

| Tool          | Role                                              |
| ------------- | ------------------------------------------------- |
| **Astro 5**   | Framework (SSR via `@astrojs/node`)               |
| **Sanity**    | Headless CMS + embedded Studio at `/studio`       |
| **Tailwind 4**| Styling (via `@tailwindcss/vite`, config-free)    |
| **GSAP**      | Animation + ScrollTrigger                         |
| **Lenis**     | Smooth scrolling (synced to GSAP ticker)          |
| **SplitType** | Line/word splitting for text reveals              |
| **Resend**    | Transactional email (contact form `/api/contact`) |

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
#   → fill in Sanity project id + Resend API key

# 3. Run the dev server
npm run dev
```

The site runs at `http://localhost:4321`. The Sanity Studio is mounted at
`http://localhost:4321/studio`.

## Scripts

| Command                | Description                          |
| ---------------------- | ------------------------------------ |
| `npm run dev`          | Start Astro dev server               |
| `npm run build`        | Build for production                 |
| `npm run preview`      | Preview the production build         |
| `npm run sanity:deploy`| Deploy the Sanity Studio             |

## Project structure

```
src/
├── components/         Reusable .astro components (Hero, ContactForm)
├── layouts/            Layout.astro — base HTML shell, boots animations
├── lib/
│   ├── smooth-scroll.ts   Lenis + GSAP ScrollTrigger sync
│   └── text-reveal.ts     SplitType + GSAP reveal-on-scroll
├── pages/
│   ├── index.astro        Home page
│   └── api/contact.ts     Resend contact endpoint (POST)
├── sanity/
│   ├── lib/                Sanity client, image url, GROQ queries
│   └── schemaTypes/        Content schemas (page, project)
└── styles/global.css      Tailwind entry + theme tokens
```

## Notes for the team

- **Output is `server`** because the contact form needs a runtime endpoint.
  If you don't need server routes, switch `output` to `"static"` in
  `astro.config.mjs` and drop the node adapter.
- **Animations** are initialised once in `Layout.astro`. Add `data-reveal`
  to any element to opt it into the SplitType line reveal.
- **Sanity**: create a project at <https://www.sanity.io/manage>, then set
  `PUBLIC_SANITY_PROJECT_ID` in `.env`. Schemas live in `src/sanity/schemaTypes`.
- **Resend**: verify a sending domain, create an API key, and set
  `RESEND_*` vars in `.env`.

> ⚠️ Versions in `package.json` are pinned to known-good ranges as of scaffolding.
> Run `npm install` and verify before committing the lockfile.
