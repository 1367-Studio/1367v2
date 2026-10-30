import { client } from './sanity';
import { landingPages, type LandingPageData } from '../data/landing-pages';

/**
 * Landing-page copy comes from Sanity (`landingPage` documents, matched by
 * `path`). Until a document exists — or if Sanity is unreachable — the page
 * falls back to the copy in src/data/landing-pages.ts, so a missing or
 * half-filled document never breaks a live page.
 */
const QUERY = `*[_type == "landingPage" && path == $path][0]{
  lang, path, alternatePath, title, description, serviceName, breadcrumb,
  eyebrow, h1, lead, ctaLabel, highlights,
  problemsTitle, problems[]{ title, body },
  servicesTitle, services[]{ title, body },
  processTitle, process[]{ title, body },
  proofTitle,
  cases[]{ summary, "name": project->title, "slug": project->slug.current },
  quote{ text, author },
  local{ title, body, lines },
  faqTitle, faqs[]{ q, a },
  relatedTitle, related[]{ label, href },
  closing{ title, description, ctaLabel }
}`;

const nonEmpty = <T>(v: T[] | null | undefined): v is T[] => Array.isArray(v) && v.length > 0;

export async function getLandingPage(key: keyof typeof landingPages): Promise<LandingPageData> {
  const fallback = landingPages[key];
  let doc: any = null;
  try {
    doc = await client.fetch(QUERY, { path: fallback.path });
  } catch {
    doc = null;
  }
  if (!doc) return fallback;

  const alternates = doc.alternatePath
    ? [
        { hreflang: doc.lang ?? fallback.lang, href: fallback.path },
        { hreflang: (doc.lang ?? fallback.lang) === 'fr' ? 'en' : 'fr', href: doc.alternatePath },
        { hreflang: 'x-default', href: (doc.lang ?? fallback.lang) === 'fr' ? doc.alternatePath : fallback.path },
      ]
    : fallback.alternates;

  const cases = nonEmpty(doc.cases)
    ? doc.cases
        .filter((c: any) => c?.slug)
        .map((c: any) => ({ name: c.name, href: `/projects/${c.slug}`, summary: c.summary ?? '' }))
    : [];

  return {
    ...fallback,
    lang: doc.lang ?? fallback.lang,
    alternates,
    title: doc.title ?? fallback.title,
    description: doc.description ?? fallback.description,
    serviceName: doc.serviceName ?? fallback.serviceName,
    breadcrumb: doc.breadcrumb ?? fallback.breadcrumb,
    eyebrow: doc.eyebrow ?? fallback.eyebrow,
    h1: doc.h1 ?? fallback.h1,
    lead: doc.lead ?? fallback.lead,
    ctaLabel: doc.ctaLabel ?? fallback.ctaLabel,
    highlights: nonEmpty(doc.highlights) ? doc.highlights : fallback.highlights,
    problemsTitle: doc.problemsTitle ?? fallback.problemsTitle,
    problems: nonEmpty(doc.problems) ? doc.problems : fallback.problems,
    servicesTitle: doc.servicesTitle ?? fallback.servicesTitle,
    services: nonEmpty(doc.services) ? doc.services : fallback.services,
    processTitle: doc.processTitle ?? fallback.processTitle,
    process: nonEmpty(doc.process) ? doc.process : fallback.process,
    proofTitle: doc.proofTitle ?? fallback.proofTitle,
    cases: cases.length ? cases : fallback.cases,
    quote: doc.quote?.text ? doc.quote : fallback.quote,
    local: doc.local?.title ? { ...doc.local, lines: doc.local.lines ?? [] } : fallback.local,
    faqTitle: doc.faqTitle ?? fallback.faqTitle,
    faqs: nonEmpty(doc.faqs) ? doc.faqs : fallback.faqs,
    relatedTitle: doc.relatedTitle ?? fallback.relatedTitle,
    related: nonEmpty(doc.related) ? doc.related : fallback.related,
    closing: doc.closing?.title ? { ...fallback.closing, ...doc.closing } : fallback.closing,
  };
}
