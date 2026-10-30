import { client } from './sanity';
import { landingPageList, type LandingPageData } from '../data/landing-pages';
import { getLandingPage } from './landing-pages';

// Markdown versions of the key pages, for AI answer engines and agents.
// Served at `<page>.md` (home is `/index.md`) and to any request that sends
// `Accept: text/markdown`. See src/middleware.ts.

export const SITE = 'https://www.1367studio.com';

const LANDING_PAGES = landingPageList.map((p) => p.path);
const STATIC_PAGES = ['/', '/about', '/projects', '/blog', '/contact', ...LANDING_PAGES];

/** Markdown URL for a page path, or null when the page has no Markdown version. */
export function markdownPathFor(pathname: string): string | null {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (STATIC_PAGES.includes(path) || /^\/(projects|blog)\/[^/]+$/.test(path)) {
    return path === '/' ? '/index.md' : `${path}.md`;
  }
  return null;
}

/** Page path for a Markdown URL (`/about.md` -> `/about`). */
export function pagePathFor(mdPath: string): string {
  const path = mdPath.replace(/\.md$/, '');
  return path === '/index' ? '/' : path;
}

export async function renderMarkdown(path: string): Promise<string | null> {
  if (path === '/') return home();
  if (path === '/about') return about();
  if (path === '/projects') return projects();
  if (path === '/blog') return blog();
  if (path === '/contact') return contact();
  const landing = landingPageList.find((p) => p.path === path);
  if (landing) return landingPage(await getLandingPage(landing.key as any));
  const project = path.match(/^\/projects\/([^/]+)$/);
  if (project) return projectPage(project[1]);
  const post = path.match(/^\/blog\/([^/]+)$/);
  if (post) return postPage(post[1]);
  return null;
}

// ---------------------------------------------------------------- pages

async function home() {
  const d = await client.fetch(`{
    "hero": *[_id == "heroSection"][0]{ title, subtitle, description },
    "statement": *[_id == "statementSection"][0].body,
    "focus": *[_id == "focusAreasSection"][0]{ label, items[]{ title, subItems } },
    "cases": *[_id == "featuredCase3Section"][0].cases[]{ tag, title, rightText, ctaHref },
    "testimonials": *[_id == "testimonialsSection"][0].testimonials[]{ quote, author },
    "letsBuild": *[_id == "letsBuildSection"][0]{ title, description }
  }`);

  return doc('/', [
    `# ${clean(`${d.hero?.title ?? ''} ${d.hero?.subtitle ?? ''}`) || '1367 Studio'}`,
    d.hero?.description && `> ${clean(d.hero.description)}`,
    d.statement && clean(d.statement),
    d.focus?.items?.length &&
      `## ${clean(d.focus.label ?? 'Focus areas')}\n\n` +
        d.focus.items
          .map((i: any) => `- **${clean(i.title)}**${i.subItems?.length ? `: ${i.subItems.map(clean).join(', ')}` : ''}`)
          .join('\n'),
    d.cases?.length &&
      `## Selected work\n\n` +
        d.cases
          .map((c: any) => `### ${clean(c.title)} (${clean(c.tag)})\n\n${clean(c.rightText)}${c.ctaHref ? `\n\n${link('View project', markdownPathFor(c.ctaHref) ?? c.ctaHref)}` : ''}`)
          .join('\n\n'),
    testimonials(d.testimonials),
    letsBuild(d.letsBuild),
  ]);
}

async function about() {
  const d = await client.fetch(`{
    "hero": *[_id == "aboutHeroSection"][0]{ leftText, rightText },
    "text": *[_id == "aboutTextRevealSection"][0].text,
    "philosophy": *[_id == "aboutPhilosophySection"][0]{ label, text, stats[]{ value, label } },
    "letsBuild": *[_id == "letsBuildSection"][0]{ title, description }
  }`);

  return doc('/about', [
    '# About 1367 Studio',
    d.hero?.rightText && `> ${clean(d.hero.rightText)}`,
    d.hero?.leftText && clean(d.hero.leftText),
    d.text && clean(d.text),
    d.philosophy?.text && `## ${clean(d.philosophy.label ?? 'Our philosophy')}\n\n${clean(d.philosophy.text)}`,
    d.philosophy?.stats?.length &&
      d.philosophy.stats.map((s: any) => `- **${clean(s.value)}** ${clean(s.label)}`).join('\n'),
    letsBuild(d.letsBuild),
  ]);
}

async function projects() {
  const d = await client.fetch(`{
    "page": *[_id == "projectsPageSection"][0]{ title, description },
    "projects": *[_type == "project" && defined(slug.current)] | order(heroYear desc){
      title, excerpt, heroClient, heroService, heroYear, "slug": slug.current
    }
  }`);

  return doc('/projects', [
    `# ${clean(d.page?.title ?? 'Projects')}`,
    d.page?.description && `> ${clean(d.page.description)}`,
    d.projects?.length &&
      `## Case studies\n\n` +
        d.projects
          .map(
            (p: any) =>
              `- ${link(clean(p.title), `/projects/${p.slug}.md`)}` +
              `${meta([p.heroClient, p.heroService, p.heroYear])}${p.excerpt ? `: ${clean(p.excerpt)}` : ''}`,
          )
          .join('\n'),
  ]);
}

async function projectPage(slug: string) {
  const p = await client.fetch(
    `*[_type == "project" && slug.current == $slug][0]{
      title, excerpt, heroClient, heroTitle, heroService, heroYear, heroIndustry,
      overviewTitle, overviewBody, whatWeDidTitle, whatWeDidBody, testimonialQuote, testimonialAuthor
    }`,
    { slug },
  );
  if (!p) return null;

  return doc(`/projects/${slug}`, [
    `# ${clean(p.title)}`,
    p.excerpt && `> ${clean(p.excerpt)}`,
    [
      p.heroClient && `- **Client:** ${clean(p.heroClient)}`,
      p.heroService && `- **Service:** ${clean(p.heroService)}`,
      p.heroIndustry && `- **Industry:** ${clean(p.heroIndustry)}`,
      p.heroYear && `- **Year:** ${clean(p.heroYear)}`,
    ]
      .filter(Boolean)
      .join('\n'),
    p.heroTitle && clean(p.heroTitle),
    p.overviewBody && `## ${clean(p.overviewTitle ?? 'Overview')}\n\n${paragraphs(p.overviewBody)}`,
    p.whatWeDidBody && `## ${clean(p.whatWeDidTitle ?? 'What we did')}\n\n${paragraphs(p.whatWeDidBody)}`,
    p.testimonialQuote && `## Testimonial\n\n> ${clean(p.testimonialQuote)}${p.testimonialAuthor ? `\n>\n> ${clean(p.testimonialAuthor)}` : ''}`,
    `## Start a project\n\n${link('Contact 1367 Studio', '/contact.md')} · ${link('More projects', '/projects.md')}`,
  ]);
}

async function blog() {
  const d = await client.fetch(`{
    "page": *[_id == "blogPageSection"][0]{ title, description },
    "posts": *[_type == "post" && defined(slug.current)] | order(publishedAt desc){
      title, excerpt, publishedAt, "slug": slug.current, "categories": categories[]->name
    }
  }`);

  return doc('/blog', [
    `# ${clean(d.page?.title ?? 'Blog')}`,
    d.page?.description && `> ${clean(d.page.description)}`,
    d.posts?.length &&
      `## Posts\n\n` +
        d.posts
          .map(
            (p: any) =>
              `- ${link(clean(p.title), `/blog/${p.slug}.md`)}` +
              `${meta([p.publishedAt?.slice(0, 10), p.categories?.filter(Boolean).join(', ')])}` +
              `${p.excerpt ? `: ${clean(p.excerpt)}` : ''}`,
          )
          .join('\n'),
  ]);
}

async function postPage(slug: string) {
  const p = await client.fetch(
    `*[_type == "post" && slug.current == $slug][0]{
      title, description, excerpt, publishedAt,
      "authors": authors[]->name,
      "categories": categories[]->name,
      body[]{ ..., "imageUrl": image.asset->url }
    }`,
    { slug },
  );
  if (!p) return null;

  return doc(`/blog/${slug}`, [
    `# ${clean(p.title)}`,
    (p.description || p.excerpt) && `> ${clean(p.description || p.excerpt)}`,
    [
      p.publishedAt && `- **Published:** ${p.publishedAt.slice(0, 10)}`,
      p.authors?.length && `- **By:** ${p.authors.filter(Boolean).join(', ')}`,
      p.categories?.length && `- **Categories:** ${p.categories.filter(Boolean).join(', ')}`,
    ]
      .filter(Boolean)
      .join('\n'),
    portableText(p.body ?? []),
    `---\n\n${link('More from the blog', '/blog.md')} · ${link('Work with 1367 Studio', '/contact.md')}`,
  ]);
}

async function contact() {
  const d = await client.fetch(`*[_id == "contactSection"][0]{ title, email, offices[]{ city, phone, address } }`);

  return doc('/contact', [
    `# ${clean(d?.title ?? 'Contact 1367 Studio')}`,
    '> Tell us about your project. We reply to every message.',
    d?.email && `- **Email:** ${d.email}`,
    d?.offices?.length &&
      `## Offices\n\n` +
        d.offices
          .map((o: any) =>
            [
              `### ${clean(o.city)}`,
              o.phone && `- **Phone:** ${clean(o.phone)}`,
              o.address && `- **Address:** ${o.address.split('\n').map((l: string) => clean(l).replace(/,$/, '')).filter(Boolean).join(', ')}`,
            ]
              .filter(Boolean)
              .join('\n'),
          )
          .join('\n\n'),
    `## Contact form\n\nUse the form at ${SITE}/contact to start a project.`,
  ]);
}

// ---------------------------------------------------------------- llms.txt

export async function llmsTxt(): Promise<string> {
  const d = await client.fetch(`{
    "projects": *[_type == "project" && defined(slug.current)] | order(heroYear desc){ title, excerpt, "slug": slug.current },
    "posts": *[_type == "post" && defined(slug.current)] | order(publishedAt desc){ title, excerpt, "slug": slug.current },
    "contact": *[_id == "contactSection"][0]{ email, offices[]{ city, phone } }
  }`);

  return [
    '# 1367 Studio',
    '> 1367 Studio is a Next.js and Sanity development agency based in France (Marseille and Paris), working with founders and product teams in France, the United Kingdom and the United States. We rebuild websites, customer portals and SaaS platforms on Next.js and Sanity, migrate content to Sanity, and build internal tools and AI agents for content teams. We are an official Sanity agency partner and part of the Sanity Pioneers program.',
    'Every page below is available as Markdown: add `.md` to the URL (the home page is `/index.md`), or request any page with `Accept: text/markdown`. The full site in one file is at /llms-full.txt.',
    '## Pages\n\n' +
      [
        `- ${link('Home', '/index.md')}: Overview of 1367 Studio, focus areas and selected work.`,
        `- ${link('About', '/about.md')}: Who we are, how we work and our philosophy.`,
        `- ${link('Projects', '/projects.md')}: Case studies of our work.`,
        `- ${link('Blog', '/blog.md')}: Notes from the studio on design, development and Sanity.`,
        `- ${link('Contact', '/contact.md')}: Start a project, offices and contact details.`,
      ].join('\n'),
    '## Services\n\n' +
      landingPageList
        .map((p) => `- ${link(p.title.replace(/ \| 1367 Studio$/, ''), `${p.path}.md`)}${p.lang === 'fr' ? ' (French)' : ''}: ${p.description}`)
        .join('\n'),
    d.projects?.length &&
      '## Case studies\n\n' +
        d.projects.map((p: any) => `- ${link(clean(p.title), `/projects/${p.slug}.md`)}${p.excerpt ? `: ${clean(p.excerpt)}` : ''}`).join('\n'),
    d.posts?.length &&
      '## Blog posts\n\n' +
        d.posts.map((p: any) => `- ${link(clean(p.title), `/blog/${p.slug}.md`)}${p.excerpt ? `: ${clean(p.excerpt)}` : ''}`).join('\n'),
    '## Contact\n\n' +
      [
        d.contact?.email && `- Email: ${d.contact.email}`,
        ...(d.contact?.offices ?? []).map((o: any) => `- ${clean(o.city)}: ${clean(o.phone ?? '')}`),
        `- Sitemap: ${SITE}/sitemap-index.xml`,
      ]
        .filter(Boolean)
        .join('\n'),
  ]
    .filter(Boolean)
    .join('\n\n') + '\n';
}

export async function llmsFullTxt(): Promise<string> {
  const { projects, posts } = await client.fetch(`{
    "projects": *[_type == "project" && defined(slug.current)] | order(heroYear desc).slug.current,
    "posts": *[_type == "post" && defined(slug.current)] | order(publishedAt desc).slug.current
  }`);
  const paths = [...STATIC_PAGES, ...projects.map((s: string) => `/projects/${s}`), ...posts.map((s: string) => `/blog/${s}`)];
  const pages = await Promise.all(paths.map(renderMarkdown));
  return pages.filter(Boolean).join('\n\n---\n\n');
}

// ---------------------------------------------------------- landing pages

function landingPage(p: LandingPageData): string {
  return doc(p.path, [
    `# ${p.h1}`,
    `> ${p.lead}`,
    p.highlights.map((h) => `- ${h}`).join('\n'),
    `## ${p.problemsTitle}\n\n` + p.problems.map((x) => `### ${x.title}\n\n${x.body}`).join('\n\n'),
    `## ${p.servicesTitle}\n\n` + p.services.map((x) => `- **${x.title}:** ${x.body}`).join('\n'),
    `## ${p.processTitle}\n\n` + p.process.map((x, i) => `${i + 1}. **${x.title}:** ${x.body}`).join('\n'),
    `## ${p.proofTitle}\n\n` + p.cases.map((c) => `- ${link(c.name, `${c.href}.md`)}: ${c.summary}`).join('\n'),
    p.quote && `> "${p.quote.text}" (${p.quote.author})`,
    p.local && `## ${p.local.title}\n\n${p.local.body}\n\n${p.local.lines.join('\n')}`,
    `## ${p.faqTitle}\n\n` + p.faqs.map((f) => `### ${f.q}\n\n${f.a}`).join('\n\n'),
    `## ${p.closing.title}\n\n${p.closing.description} ${link(p.closing.ctaLabel, '/contact.md')}`,
  ]);
}

// ---------------------------------------------------------------- helpers

function doc(path: string, parts: unknown[]): string {
  const body = parts.filter((p) => typeof p === 'string' && p.trim()).join('\n\n');
  return `${body}\n\n---\n\nSource: ${SITE}${path === '/' ? '' : path}\n`;
}

// Some Sanity strings contain a literal "\n" typed into single-line fields.
function clean(s: unknown): string {
  return String(s ?? '').replace(/\\n/g, ' ').replace(/\s+/g, ' ').trim();
}

function paragraphs(s: string): string {
  return s
    .replace(/\\n/g, '\n')
    .split(/\n\s*\n/)
    .map(clean)
    .filter(Boolean)
    .join('\n\n');
}

function link(label: string, href: string): string {
  label = label.replace(/([\\[\]*_`])/g, '\\$1');
  return `[${label}](${href.startsWith('/') ? SITE + href : href})`;
}

function meta(items: unknown[]): string {
  const list = items.filter(Boolean).map(clean);
  return list.length ? ` (${list.join(', ')})` : '';
}

function testimonials(list: any[] | undefined): string | false {
  if (!list?.length) return false;
  return `## What clients say\n\n` + list.map((t) => `> ${clean(t.quote)}\n>\n> ${clean(t.author)}`).join('\n\n');
}

function letsBuild(d: any): string | false {
  if (!d?.title) return false;
  return `## ${clean(d.title)}\n\n${d.description ? `${clean(d.description)}\n\n` : ''}${link('Start a project', '/contact.md')}`;
}

// Portable Text -> Markdown for the blog body (text, imageBlock, tableBlock, videoBlock).
function portableText(blocks: any[]): string {
  const out: string[] = [];
  let listCounter = 0;

  blocks.forEach((b, i) => {
    if (b._type === 'block') {
      const text = spans(b);
      if (b.listItem) {
        const indent = '  '.repeat(Math.max(0, (b.level ?? 1) - 1));
        const prev = blocks[i - 1];
        listCounter = prev?.listItem === b.listItem && prev?.level === b.level ? listCounter + 1 : 1;
        const bullet = b.listItem === 'number' ? `${listCounter}.` : '-';
        const line = `${indent}${bullet} ${text}`;
        // Consecutive list items stay in one Markdown block.
        if (prev?._type === 'block' && prev.listItem) out[out.length - 1] += `\n${line}`;
        else out.push(line);
        return;
      }
      if (!text.trim()) return;
      const style = b.style ?? 'normal';
      if (/^h[1-4]$/.test(style)) out.push(`${'#'.repeat(Math.max(2, Number(style[1])))} ${text}`);
      else if (style === 'blockquote') out.push(`> ${text}`);
      else out.push(text);
    } else if (b._type === 'imageBlock' && b.imageUrl) {
      out.push(`![${clean(b.alt ?? b.caption ?? '')}](${b.imageUrl})${b.caption ? `\n\n*${clean(b.caption)}*` : ''}`);
    } else if (b._type === 'tableBlock' && b.rows?.length) {
      const rows: string[][] = b.rows.map((r: any) => (r.cells ?? []).map((c: string) => clean(c).replace(/\|/g, '\\|')));
      const width = Math.max(...rows.map((r) => r.length));
      const row = (r: string[]) => `| ${Array.from({ length: width }, (_, k) => r[k] ?? '').join(' | ')} |`;
      out.push([row(rows[0]), `|${' --- |'.repeat(width)}`, ...rows.slice(1).map(row)].join('\n'));
    } else if (b._type === 'videoBlock' && b.caption) {
      out.push(`*Video: ${clean(b.caption)}*`);
    }
  });

  return out.join('\n\n');
}

function spans(block: any): string {
  const defs = new Map((block.markDefs ?? []).map((d: any) => [d._key, d]));
  return (block.children ?? [])
    .map((c: any) => {
      let t: string = c.text ?? '';
      if (!t.trim()) return t;
      for (const m of c.marks ?? []) {
        if (m === 'strong') t = `**${t}**`;
        else if (m === 'em') t = `*${t}*`;
        else if (m === 'code') t = `\`${t}\``;
        else {
          const def: any = defs.get(m);
          if (def?.href) t = `[${t}](${def.href})`;
        }
      }
      return t;
    })
    .join('');
}
