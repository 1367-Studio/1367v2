import { client } from './sanity';

// Singleton page documents whose copy the agent should know about. Header,
// footer and legal pages are left out: they add tokens without helping answers.
const PAGE_IDS = [
  'heroSection',
  'statementSection',
  'focusAreasSection',
  'buildingWorldwideSection',
  'letsBuildSection',
  'testimonialsSection',
  'featuredCaseSection',
  'featuredCase2Section',
  'featuredCase3Section',
  'aboutHeroSection',
  'aboutTextRevealSection',
  'aboutPhilosophySection',
  'projectsPageSection',
  'contactSection',
];

const QUERY = `{
  "agent": *[_id == "agentKnowledge"][0]{
    welcomeMessage, suggestedQuestions, about, services, stack, languages, facts[]{topic, answer}, rules
  },
  "pages": *[_id in $pageIds],
  "projects": *[_type == "project" && defined(slug.current)] | order(heroYear desc){
    title, "slug": slug.current, excerpt, heroClient, heroService, heroYear, heroIndustry,
    overviewTitle, overviewBody, whatWeDidTitle, whatWeDidBody, testimonialQuote, testimonialAuthor
  },
  "cases": *[_type == "case"] | order(year desc){ title, client, year, services, excerpt },
  "posts": *[_type == "post" && defined(slug.current)] | order(publishedAt desc){
    title, "slug": slug.current, publishedAt, excerpt,
    "categories": categories[]->title,
    "text": pt::text(body)
  }
}`;

export interface AgentConfig {
  welcomeMessage?: string;
  suggestedQuestions?: string[];
}

interface Knowledge {
  config: AgentConfig;
  text: string;
}

const TTL_MS = 5 * 60 * 1000;
const POST_CHARS = 2500;
let cache: { at: number; value: Knowledge } | null = null;

export async function getAgentKnowledge(): Promise<Knowledge> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.value;

  const data = await client.fetch(QUERY, { pageIds: PAGE_IDS });
  const agent = data.agent ?? {};
  const out: string[] = [];

  if (agent.about) out.push(`## About the studio\n${agent.about}`);
  if (agent.services?.length) out.push(`## Services\n${list(agent.services)}`);
  if (agent.stack?.length) out.push(`## Stack\n${list(agent.stack)}`);
  if (agent.languages?.length) out.push(`## Languages the team speaks\n${list(agent.languages)}`);
  for (const f of agent.facts ?? []) out.push(`## ${f.topic}\n${f.answer}`);

  if (data.projects?.length) {
    out.push(
      `## Projects (case study pages)\n` +
        data.projects
          .map((p: any) =>
            [
              `### ${p.title} (/projects/${p.slug})`,
              field('Client', p.heroClient),
              field('Service', p.heroService),
              field('Year', p.heroYear),
              field('Industry', p.heroIndustry),
              p.excerpt,
              p.overviewTitle && `${p.overviewTitle}: ${p.overviewBody ?? ''}`,
              p.whatWeDidTitle && `${p.whatWeDidTitle}: ${p.whatWeDidBody ?? ''}`,
              p.testimonialQuote && `Testimonial: "${p.testimonialQuote}" (${p.testimonialAuthor ?? 'client'})`,
            ]
              .filter(Boolean)
              .join('\n'),
          )
          .join('\n\n'),
    );
  }

  if (data.cases?.length) {
    out.push(
      `## Other client work\n` +
        data.cases
          .map((c: any) =>
            [`- ${c.title}`, c.client && `for ${c.client}`, c.year && `(${c.year})`, c.services?.length && `| ${c.services.join(', ')}`, c.excerpt && `| ${c.excerpt}`]
              .filter(Boolean)
              .join(' '),
          )
          .join('\n'),
    );
  }

  if (data.posts?.length) {
    out.push(
      `## Blog posts\n` +
        data.posts
          .map((p: any) =>
            [
              `### ${p.title} (/blog/${p.slug})`,
              field('Published', p.publishedAt?.slice(0, 10)),
              field('Categories', p.categories?.filter(Boolean).join(', ')),
              p.excerpt,
              p.text && truncate(p.text, POST_CHARS),
            ]
              .filter(Boolean)
              .join('\n'),
          )
          .join('\n\n'),
    );
  }

  if (data.pages?.length) {
    out.push(
      `## Website copy\n` +
        data.pages
          .map((d: any) => `### ${d._type}\n${flatten(d).join('\n')}`)
          .join('\n\n'),
    );
  }

  if (agent.rules) out.push(`## Extra instructions from the studio\n${agent.rules}`);

  const value: Knowledge = {
    config: { welcomeMessage: agent.welcomeMessage, suggestedQuestions: agent.suggestedQuestions },
    text: out.join('\n\n'),
  };
  cache = { at: Date.now(), value };
  return value;
}

export async function getAgentConfig(): Promise<AgentConfig> {
  try {
    return (await getAgentKnowledge()).config;
  } catch {
    return {};
  }
}

const SKIP_KEYS = new Set(['asset', 'crop', 'hotspot', 'seo', 'slug', 'href', 'url', 'link', 'video', 'file']);

// Walks a page document and keeps only the human-readable strings, so new
// fields added in the Studio reach the agent without touching this file.
function flatten(value: any, out: string[] = []): string[] {
  if (typeof value === 'string') {
    const s = value.trim();
    if (s && !/^(https?:|#|image-|file-)/.test(s)) out.push(s);
  } else if (Array.isArray(value)) {
    for (const v of value) flatten(v, out);
  } else if (value && typeof value === 'object') {
    if (value._type === 'image' || value._type === 'file' || value._type === 'reference') return out;
    if (value._type === 'block') {
      const text = (value.children ?? []).map((c: any) => c.text ?? '').join('');
      if (text.trim()) out.push(text.trim());
      return out;
    }
    for (const [k, v] of Object.entries(value)) {
      if (k.startsWith('_') || SKIP_KEYS.has(k)) continue;
      flatten(v, out);
    }
  }
  return out;
}

const list = (items: string[]) => items.map((i) => `- ${i}`).join('\n');
const field = (label: string, v: unknown) => (v ? `${label}: ${v}` : '');
const truncate = (s: string, n: number) => (s.length > n ? `${s.slice(0, n)}…` : s);
