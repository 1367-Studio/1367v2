/**
 * Service / location landing pages (SEO plan, Oct 2026).
 *
 * One entry per URL. Copy only states facts that are already true elsewhere on
 * the site or in Sanity: official Sanity agency partner, Sanity Pioneers,
 * the three published case studies and their real testimonials. No invented
 * clients, prices or timelines.
 *
 * FR ↔ EN pairs share `alternates` so each page emits hreflang for both.
 */

export type Lang = "en" | "fr";

export interface LandingPageData {
  key: string;
  lang: Lang;
  path: string;
  alternates?: { hreflang: string; href: string }[];
  title: string;
  description: string;
  /** Name used for the Service JSON-LD node. */
  serviceName: string;
  eyebrow: string;
  h1: string;
  lead: string;
  ctaLabel: string;
  highlights: string[];
  problemsTitle: string;
  problems: { title: string; body: string }[];
  servicesTitle: string;
  services: { title: string; body: string }[];
  processTitle: string;
  process: { title: string; body: string }[];
  proofTitle: string;
  cases: { name: string; href: string; summary: string }[];
  quote?: { text: string; author: string };
  local?: { title: string; body: string; lines: string[] };
  faqTitle: string;
  faqs: { q: string; a: string }[];
  relatedTitle: string;
  related: { label: string; href: string }[];
  closing: { title: string; description: string; ctaLabel: string };
  breadcrumb: string;
}

const SANITY_PAIR = [
  { hreflang: "fr", href: "/fr/agence-sanity" },
  { hreflang: "en", href: "/sanity-agency" },
  { hreflang: "x-default", href: "/sanity-agency" },
];

const MIGRATION_PAIR = [
  { hreflang: "fr", href: "/fr/migration-sanity" },
  { hreflang: "en", href: "/sanity-migration" },
  { hreflang: "x-default", href: "/sanity-migration" },
];

const CASES_EN = [
  {
    name: "Formwise",
    href: "/projects/formwise",
    summary:
      "A management SaaS for associations and private schools. Envol Culture runs more than 300 students on it every day.",
  },
  {
    name: "ASR Temp",
    href: "/projects/asr-temp",
    summary:
      "A temporary-staffing platform and website that brings applicants, job offers and client relations into one place.",
  },
  {
    name: "Strat Éclosia",
    href: "/projects/strat-eclosia",
    summary:
      "A bespoke website that presents a strategy consultancy’s expertise, services and positioning.",
  },
];

const CASES_FR = [
  {
    name: "Formwise",
    href: "/projects/formwise",
    summary:
      "Un SaaS de gestion pour associations et établissements privés. Envol Culture y gère plus de 300 élèves chaque jour.",
  },
  {
    name: "ASR Temp",
    href: "/projects/asr-temp",
    summary:
      "Une plateforme d’intérim et un site sur mesure qui réunissent candidats, offres d’emploi et relation client.",
  },
  {
    name: "Strat Éclosia",
    href: "/projects/strat-eclosia",
    summary:
      "Un site sur mesure qui met en valeur l’expertise, les offres et le positionnement d’un cabinet de conseil en stratégie.",
  },
];

const QUOTE_EN = {
  text: "We use Formwise to manage over 300 students daily. 1367 Studio built a reliable, clear platform perfectly tailored to the needs of a modern school.",
  author: "School director, Envol Culture",
};

const QUOTE_FR = {
  text: "Nous utilisons Formwise pour gérer plus de 300 élèves au quotidien. 1367 Studio a construit une plateforme fiable et claire, parfaitement adaptée aux besoins d’une école moderne.",
  author: "Directeur d’établissement, Envol Culture",
};

export const landingPages: Record<string, LandingPageData> = {
  // ─────────────────────────────────────────────────────────── FR · Sanity
  frAgenceSanity: {
    key: "frAgenceSanity",
    lang: "fr",
    path: "/fr/agence-sanity",
    alternates: SANITY_PAIR,
    title: "Agence Sanity CMS à Paris & Marseille | 1367 Studio",
    description:
      "1367 Studio est une agence partenaire officielle de Sanity, à Paris et Marseille. Sites Next.js, SaaS et migrations vers Sanity pour les équipes en France.",
    serviceName: "Développement Sanity CMS",
    eyebrow: "Agence Sanity · Paris & Marseille",
    h1: "Agence Sanity officielle, à Paris et Marseille.",
    lead: "Votre CMS freine votre équipe : chaque nouvelle page demande un développeur, le contenu est dupliqué partout et le site ralentit. Nous concevons votre modèle de contenu dans Sanity et le connectons à un front Next.js rapide, que votre équipe édite seule.",
    ctaLabel: "Réserver un appel",
    highlights: ["Partenaire officiel Sanity", "Programme Sanity Pioneers", "Next.js · TypeScript · Vercel"],
    problemsTitle: "Ce que nous réglons",
    problems: [
      {
        title: "Un CMS que l’équipe évite",
        body: "Des champs inutiles, des pages figées, aucune prévisualisation. Nous configurons un Sanity Studio qui parle le vocabulaire de votre métier, avec aperçu en temps réel.",
      },
      {
        title: "Un site qui ne suit plus le produit",
        body: "Votre offre a évolué, votre site non. Un modèle de contenu structuré permet de créer de nouvelles pages et sections sans repasser par le développement.",
      },
      {
        title: "Du contenu copié sur chaque canal",
        body: "Avec Sanity, un même contenu alimente le site, l’application et les autres canaux via une API. Vous le modifiez une fois.",
      },
    ],
    servicesTitle: "Nos services Sanity",
    services: [
      {
        title: "Modélisation de contenu",
        body: "Nous partons de la façon dont votre équipe écrit et publie, puis traduisons cela en schémas Sanity clairs et évolutifs.",
      },
      {
        title: "Sanity Studio sur mesure",
        body: "Interfaces d’édition adaptées, prévisualisation, workflows de relecture et rôles par équipe.",
      },
      {
        title: "Front Next.js",
        body: "Sites et applications Next.js en TypeScript, déployés sur Vercel, pensés pour le référencement et les Core Web Vitals.",
      },
      {
        title: "Migration vers Sanity",
        body: "Depuis WordPress, Contentful ou un autre CMS, avec reprise des contenus, des métadonnées SEO et des redirections.",
      },
      {
        title: "IA et agents de contenu",
        body: "Automatisation des tâches répétitives dans Sanity, avec une validation humaine avant toute publication.",
      },
      {
        title: "Maintenance et évolutions",
        body: "Nouveaux types de contenu, nouvelles pages et améliorations du Studio au fil de vos besoins.",
      },
    ],
    processTitle: "Comment nous travaillons",
    process: [
      { title: "Cadrage", body: "Un appel pour comprendre votre contenu, votre équipe et vos objectifs, puis une proposition chiffrée." },
      { title: "Modèle de contenu", body: "Les schémas Sanity sont validés avec votre équipe éditoriale avant toute intégration." },
      { title: "Construction", body: "Studio et front Next.js livrés en itérations, avec des aperçus en ligne à chaque étape." },
      { title: "Mise en ligne et suivi", body: "Redirections, contrôle SEO, formation de l’équipe, puis accompagnement continu." },
    ],
    proofTitle: "Projets récents",
    cases: CASES_FR,
    quote: QUOTE_FR,
    local: {
      title: "Une agence Sanity en France",
      body: "Nous travaillons depuis Marseille et Paris, en français ou en anglais, avec des équipes partout en France et à l’étranger. Les ateliers peuvent se faire sur place.",
      lines: ["Rue Paradis, 13008 Marseille", "Paris 8e", "hello@1367studio.com · +33 7 63 85 83 88"],
    },
    faqTitle: "Questions fréquentes",
    faqs: [
      {
        q: "Qu’est-ce que Sanity ?",
        a: "Sanity est un CMS headless : le contenu est stocké sous forme de données structurées et diffusé par API vers votre site, votre application ou tout autre canal. L’interface d’édition, Sanity Studio, se configure en code pour coller à votre métier.",
      },
      {
        q: "Pourquoi choisir une agence partenaire Sanity ?",
        a: "1367 Studio est partenaire officiel de Sanity et membre du programme Sanity Pioneers. Nous avons un accès direct à l’équipe Sanity et suivons les nouveautés de la plateforme dès leur sortie. Sanity est au cœur de chaque projet que nous livrons.",
      },
      {
        q: "Sanity ou WordPress ?",
        a: "WordPress convient à un site simple géré par une seule personne. Sanity devient pertinent quand plusieurs personnes publient, que le contenu alimente plusieurs canaux ou que le site doit rester rapide en grandissant.",
      },
      {
        q: "Combien coûte un projet Sanity ?",
        a: "Chaque projet est chiffré après un premier échange, selon le volume de contenu, le nombre de modèles et les intégrations. Sanity propose aussi une offre gratuite pour démarrer.",
      },
      {
        q: "Travaillez-vous avec des équipes hors de Marseille et Paris ?",
        a: "Oui. Nous travaillons avec des équipes dans toute la France, au Royaume-Uni et aux États-Unis, en français ou en anglais.",
      },
    ],
    relatedTitle: "À lire aussi",
    related: [
      { label: "Migration WordPress vers Sanity", href: "/fr/migration-sanity" },
      { label: "Agence web à Marseille", href: "/fr/agence-web-marseille" },
      { label: "1367 Studio devient partenaire Sanity", href: "/blog/1367-studio-sanity-agency-partner" },
      { label: "Les nouveautés Sanity d’Everything NYC 2026", href: "/blog/sanity-s-new-features-from-everything-nyc-2026-explained-simply" },
    ],
    closing: {
      title: "Parlons de votre contenu.",
      description: "Dites-nous ce que votre CMS ou votre site ne permet pas aujourd’hui. Nous revenons vers vous avec un périmètre clair et la prochaine étape.",
      ctaLabel: "Réserver un appel",
    },
    breadcrumb: "Agence Sanity",
  },

  // ─────────────────────────────────────────────────────── FR · Marseille
  frAgenceWebMarseille: {
    key: "frAgenceWebMarseille",
    lang: "fr",
    path: "/fr/agence-web-marseille",
    title: "Agence web à Marseille : Next.js & Sanity | 1367 Studio",
    description:
      "Agence web à Marseille (8e) : sites sur mesure, plateformes et logiciels en Next.js et Sanity pour les entreprises qui ont dépassé leur site actuel.",
    serviceName: "Création de sites et développement web sur mesure à Marseille",
    eyebrow: "Agence web · Marseille 8e",
    h1: "Agence web à Marseille pour sites et logiciels sur mesure.",
    lead: "Votre site ne reflète plus votre entreprise, vos outils internes tiennent avec des tableurs, ou votre plateforme n’existe encore que sur le papier. Nous concevons et développons des sites, des portails clients et des logiciels sur mesure, depuis la rue Paradis.",
    ctaLabel: "Réserver un appel",
    highlights: ["Basés à Marseille 8e", "Partenaire officiel Sanity", "Sites, SaaS & outils internes"],
    problemsTitle: "Les situations que nous connaissons bien",
    problems: [
      {
        title: "Un site qui date",
        body: "Lent, difficile à modifier, plus en phase avec votre offre. Nous le reconstruisons sur une base moderne que votre équipe peut faire évoluer seule.",
      },
      {
        title: "Des process gérés à la main",
        body: "Candidatures, inscriptions, devis ou plannings dans des tableurs. Nous les transformons en plateforme, comme pour ASR Temp ou Formwise.",
      },
      {
        title: "Un produit à lancer",
        body: "Une idée de SaaS ou de portail client à concrétiser. Nous cadrons, concevons et développons la première version, puis l’accompagnons.",
      },
    ],
    servicesTitle: "Ce que nous réalisons",
    services: [
      { title: "Sites vitrines sur mesure", body: "Design et développement Next.js, contenu géré dans Sanity, optimisés pour le référencement." },
      { title: "Plateformes et SaaS", body: "Applications web métier, espaces membres et produits SaaS, de la maquette à la production." },
      { title: "Portails clients", body: "Espaces sécurisés pour vos clients, candidats ou adhérents, connectés à vos outils." },
      { title: "Outils internes", body: "Remplacer les tableurs par des outils adaptés à vos équipes, avec les intégrations nécessaires." },
      { title: "Applications mobiles", body: "Applications natives ou multiplateformes reliées à la même base de contenu." },
      { title: "Refonte et migration", body: "Reprise de l’existant, des contenus et du référencement, sans perte de trafic." },
    ],
    processTitle: "Notre méthode",
    process: [
      { title: "Premier échange", body: "Un appel ou une rencontre à Marseille pour comprendre votre besoin et vos contraintes." },
      { title: "Proposition", body: "Un périmètre clair, un découpage par étapes et un devis." },
      { title: "Design et développement", body: "Livraisons régulières avec des aperçus en ligne pour valider au fur et à mesure." },
      { title: "Mise en ligne", body: "Contrôle SEO et performance, formation, puis maintenance et évolutions." },
    ],
    proofTitle: "Quelques réalisations",
    cases: CASES_FR,
    quote: QUOTE_FR,
    local: {
      title: "Une équipe à Marseille",
      body: "Notre bureau est rue Paradis, dans le 8e arrondissement. Nous accompagnons des entreprises à Marseille, Aix-en-Provence et dans toute la région, ainsi qu’à Paris.",
      lines: ["Rue Paradis, 13008 Marseille", "hello@1367studio.com", "+33 7 63 85 83 88"],
    },
    faqTitle: "Questions fréquentes",
    faqs: [
      {
        q: "Quelle est la différence avec une agence web classique ?",
        a: "Nous développons sur mesure en Next.js et Sanity plutôt qu’à partir de thèmes. Le résultat est plus rapide, plus simple à faire évoluer et pensé pour le référencement dès le départ.",
      },
      {
        q: "Faites-vous aussi des logiciels sur mesure ?",
        a: "Oui : plateformes métier, SaaS, portails clients et outils internes. Formwise, par exemple, gère au quotidien plus de 300 élèves chez Envol Culture.",
      },
      {
        q: "Combien coûte un site sur mesure à Marseille ?",
        a: "Chaque projet est chiffré après un premier échange, selon le nombre de pages, les fonctionnalités et les intégrations. Nous ne publions pas de tarif fixe, car aucun projet ne se ressemble.",
      },
      {
        q: "Peut-on se rencontrer ?",
        a: "Oui, à notre bureau de la rue Paradis ou dans vos locaux à Marseille et alentour. Nous travaillons aussi entièrement à distance si vous préférez.",
      },
      {
        q: "Gérez-vous le référencement ?",
        a: "Nous livrons des sites optimisés techniquement : performance, balisage, données structurées, sitemap et redirections. Pour les campagnes SEO ou publicitaires, nous travaillons avec votre agence marketing.",
      },
    ],
    relatedTitle: "À lire aussi",
    related: [
      { label: "Agence Sanity à Paris & Marseille", href: "/fr/agence-sanity" },
      { label: "Migration WordPress vers Sanity", href: "/fr/migration-sanity" },
      { label: "Nos projets", href: "/projects" },
      { label: "À propos de 1367 Studio", href: "/about" },
    ],
    closing: {
      title: "Un projet à Marseille ?",
      description: "Dites-nous ce qui freine votre site ou vos outils aujourd’hui. Nous revenons vers vous avec un périmètre clair et la prochaine étape.",
      ctaLabel: "Réserver un appel",
    },
    breadcrumb: "Agence web Marseille",
  },

  // ─────────────────────────────────────────────────────── FR · Migration
  frMigrationSanity: {
    key: "frMigrationSanity",
    lang: "fr",
    path: "/fr/migration-sanity",
    alternates: MIGRATION_PAIR,
    title: "Migration WordPress vers Sanity | 1367 Studio",
    description:
      "Migrez de WordPress, Contentful ou d’un autre CMS vers Sanity sans perdre votre référencement : contenus, médias, métadonnées SEO et redirections repris.",
    serviceName: "Migration de CMS vers Sanity",
    eyebrow: "Migration CMS · Sanity",
    h1: "Migrer de WordPress vers Sanity sans perdre votre SEO.",
    lead: "Plugins qui cassent à chaque mise à jour, éditeur de pages lourd, site lent : WordPress a fait son temps pour votre équipe. Nous migrons vos contenus vers Sanity et votre site vers Next.js, en gardant vos URL, vos métadonnées et votre trafic.",
    ctaLabel: "Parler de votre migration",
    highlights: ["Partenaire officiel Sanity", "Reprise SEO complète", "WordPress · Contentful · autres CMS"],
    problemsTitle: "Quand migrer vers Sanity",
    problems: [
      { title: "Le site ralentit", body: "Thèmes et plugins s’empilent et les Core Web Vitals se dégradent. Un front Next.js sur Sanity repart sur une base légère." },
      { title: "Publier est devenu compliqué", body: "Chaque mise en page passe par un développeur. Sanity sépare le contenu de sa mise en forme : l’équipe publie seule." },
      { title: "Le contenu doit servir ailleurs", body: "Application, autre site, nouvelles langues : avec Sanity, le même contenu est disponible partout via API." },
    ],
    servicesTitle: "Ce que comprend la migration",
    services: [
      { title: "Audit de l’existant", body: "Inventaire des types de contenu, champs personnalisés, plugins, médias et URL." },
      { title: "Modèle de contenu Sanity", body: "Chaque type WordPress est repensé en schéma Sanity structuré, pas simplement copié." },
      { title: "Migration des contenus", body: "Articles, pages, médias, auteurs et taxonomies importés par script, vérifiés puis relancés si besoin." },
      { title: "Reprise SEO", body: "Titres, descriptions, balises canoniques et URL repris ; redirections 301 pour tout ce qui change." },
      { title: "Nouveau front Next.js", body: "Un site rapide, accessible et prêt pour les moteurs de recherche et les moteurs IA." },
      { title: "Formation", body: "Votre équipe prend en main Sanity Studio avant la bascule." },
    ],
    processTitle: "Étapes de la migration",
    process: [
      { title: "Audit et plan", body: "Cartographie des contenus et des URL, plan de redirections et calendrier." },
      { title: "Modèle et scripts", body: "Schémas Sanity validés, puis scripts d’import testés sur une copie." },
      { title: "Gel et import final", body: "Publication suspendue un court moment, import définitif et vérification." },
      { title: "Bascule et contrôle", body: "Mise en ligne, redirections actives, suivi dans la Search Console." },
    ],
    proofTitle: "Projets récents",
    cases: CASES_FR,
    faqTitle: "Questions fréquentes",
    faqs: [
      { q: "Vais-je perdre mon référencement ?", a: "Non, si la migration est préparée : nous reprenons les URL, les titres et descriptions, les balises canoniques, et mettons en place des redirections 301 pour chaque adresse qui change." },
      { q: "Peut-on continuer à publier pendant la migration ?", a: "Oui, presque tout le temps. Nous ne demandons qu’un court gel des publications avant l’import final." },
      { q: "Peut-on garder WordPress en partie ?", a: "C’est possible pendant une transition, mais nous recommandons en général une migration complète vers Sanity pour ne maintenir qu’un seul outil." },
      { q: "Migrez-vous depuis d’autres CMS que WordPress ?", a: "Oui : Contentful, Prismic, Strapi, Webflow ou un CMS maison, du moment que le contenu est exportable." },
    ],
    relatedTitle: "À lire aussi",
    related: [
      { label: "Agence Sanity à Paris & Marseille", href: "/fr/agence-sanity" },
      { label: "Agence web à Marseille", href: "/fr/agence-web-marseille" },
      { label: "Comment nous utilisons l’IA dans la gestion de contenu", href: "/blog/how-we-use-ai-in-content-management" },
    ],
    closing: {
      title: "Prêt à quitter WordPress ?",
      description: "Envoyez-nous l’adresse de votre site. Nous revenons vers vous avec une première lecture de la migration et la prochaine étape.",
      ctaLabel: "Parler de votre migration",
    },
    breadcrumb: "Migration Sanity",
  },

  // ─────────────────────────────────────────────────────────── EN · Sanity
  enSanityAgency: {
    key: "enSanityAgency",
    lang: "en",
    path: "/sanity-agency",
    alternates: SANITY_PAIR,
    title: "Sanity CMS Agency for SaaS & Product Teams | 1367 Studio",
    description:
      "Official Sanity agency partner and Sanity Pioneer. We design Sanity content models and Next.js front ends for SaaS and product teams in the UK, US and Europe.",
    serviceName: "Sanity CMS development",
    eyebrow: "Sanity CMS agency · Official partner",
    h1: "Official Sanity partner for SaaS and product teams.",
    lead: "Your team ships product every week, but every new landing page still waits on a developer. We model your content in Sanity, build a Studio your marketers actually like, and connect it to a fast Next.js front end, so publishing stops being an engineering ticket.",
    ctaLabel: "Book a call",
    highlights: ["Official Sanity agency partner", "Sanity Pioneers program", "Next.js · TypeScript · Vercel"],
    problemsTitle: "What we fix",
    problems: [
      { title: "Marketing waits on engineering", body: "Every new page or section needs a pull request. A structured content model and page-building blocks let marketing publish on their own." },
      { title: "A CMS nobody wants to open", body: "Forty fields, half of them irrelevant, and no preview. We configure Sanity Studio around how your team works, with live preview." },
      { title: "The site no longer matches the product", body: "Your product moved on and the site didn’t. We rebuild it on Sanity and Next.js so it can keep up." },
    ],
    servicesTitle: "Sanity services",
    services: [
      { title: "Content modelling", body: "Schemas designed around how your team writes, reviews and reuses content, not around page templates." },
      { title: "Custom Sanity Studio", body: "Tailored inputs, previews, review workflows and roles, so editors see exactly what they publish." },
      { title: "Next.js front ends", body: "TypeScript, App Router, deployed on Vercel, built for Core Web Vitals and search." },
      { title: "Migrations to Sanity", body: "From WordPress, Contentful or a home-grown CMS, with content, SEO metadata and redirects carried over." },
      { title: "AI content workflows", body: "Sanity agents and automations for repetitive content work, with a human approval step before anything ships." },
      { title: "Ongoing support", body: "New content types, pages and Studio improvements as your product grows." },
    ],
    processTitle: "How we work",
    process: [
      { title: "Discovery", body: "A call to understand your content, team and goals, followed by a scoped proposal." },
      { title: "Content model", body: "Sanity schemas agreed with your editors before any front-end work." },
      { title: "Build", body: "Studio and Next.js site delivered in iterations, with a live preview at every step." },
      { title: "Launch and support", body: "Redirects, SEO checks and team training, then ongoing improvements." },
    ],
    proofTitle: "Recent work",
    cases: CASES_EN,
    quote: QUOTE_EN,
    local: {
      title: "Working with UK and US teams",
      body: "We’re based in Paris and Marseille, one hour ahead of London, and work in English with teams across the UK, the US and Europe. Calls fit both London hours and US East Coast mornings.",
      lines: ["Paris & Marseille, France", "hello@1367studio.com", "+33 7 63 85 83 88"],
    },
    faqTitle: "FAQ",
    faqs: [
      { q: "What does an official Sanity agency partner mean?", a: "1367 Studio is part of Sanity’s agency partner program and the Sanity Pioneers program. That gives us direct access to the Sanity team and early insight into new platform features. Sanity is the content platform on every project we deliver." },
      { q: "Do you only build with Next.js?", a: "Next.js is our main framework and our default for Sanity projects. We also work with Astro, Angular and Ruby on Rails when a project calls for it." },
      { q: "Do you work with UK and US companies?", a: "Yes. We work in English with teams in the UK, the US and across Europe. Most of our collaboration happens remotely, with workshops in person when useful." },
      { q: "How much does a Sanity project cost?", a: "Every project is scoped individually after a first call, based on content volume, number of models and integrations. We don’t publish fixed prices." },
      { q: "Can you take over an existing Sanity project?", a: "Yes. We can audit your current schemas and front end, then improve the Studio, performance or content model without starting from scratch." },
    ],
    relatedTitle: "Related",
    related: [
      { label: "Migrate to Sanity", href: "/sanity-migration" },
      { label: "Next.js development agency", href: "/nextjs-agency" },
      { label: "1367 Studio is now a Sanity agency partner", href: "/blog/1367-studio-sanity-agency-partner" },
      { label: "Everything NYC 2026, as a Sanity Pioneer", href: "/blog/everything-nyc-2026" },
    ],
    closing: {
      title: "Let’s talk about your content.",
      description: "Tell us what your CMS or site can’t do today. We’ll come back with a clear scope and the next step.",
      ctaLabel: "Book a call",
    },
    breadcrumb: "Sanity agency",
  },

  // ─────────────────────────────────────────────────────── EN · Migration
  enSanityMigration: {
    key: "enSanityMigration",
    lang: "en",
    path: "/sanity-migration",
    alternates: MIGRATION_PAIR,
    title: "WordPress & Contentful to Sanity Migration | 1367 Studio",
    description:
      "Move from WordPress, Contentful or another CMS to Sanity without losing traffic. Content, media, SEO metadata and redirects carried over by a Sanity partner.",
    serviceName: "CMS migration to Sanity",
    eyebrow: "CMS migration · Sanity",
    h1: "Move to Sanity without losing your traffic.",
    lead: "Plugins that break on every update, a page builder your team fights with, a site that keeps getting slower. We migrate your content to Sanity and your site to Next.js, keeping your URLs, metadata and rankings intact.",
    ctaLabel: "Plan your migration",
    highlights: ["Official Sanity agency partner", "Full SEO carry-over", "WordPress · Contentful · custom CMS"],
    problemsTitle: "When it’s time to migrate",
    problems: [
      { title: "The site keeps slowing down", body: "Themes and plugins pile up and Core Web Vitals suffer. A Next.js front end on Sanity starts from a lean base." },
      { title: "Publishing needs a developer", body: "Sanity separates content from layout, so your team can publish and reuse content on its own." },
      { title: "Content has to go further", body: "An app, a second site, new languages: Sanity serves the same content everywhere through its API." },
    ],
    servicesTitle: "What the migration covers",
    services: [
      { title: "Audit", body: "An inventory of content types, custom fields, plugins, media and URLs." },
      { title: "Sanity content model", body: "Each legacy type is redesigned as a structured Sanity schema, not copied one-to-one." },
      { title: "Scripted content import", body: "Posts, pages, media, authors and taxonomies imported by script, verified and re-runnable." },
      { title: "SEO carry-over", body: "Titles, descriptions, canonicals and URLs preserved; 301 redirects for anything that changes." },
      { title: "New Next.js front end", body: "Fast, accessible and ready for search and AI answer engines." },
      { title: "Team training", body: "Your editors learn Sanity Studio before the switch." },
    ],
    processTitle: "Migration steps",
    process: [
      { title: "Audit and plan", body: "Content and URL map, redirect plan and timeline." },
      { title: "Model and scripts", body: "Sanity schemas agreed, import scripts tested on a copy." },
      { title: "Freeze and final import", body: "A short publishing freeze, then the final import and checks." },
      { title: "Switch and monitor", body: "Go live, redirects active, Search Console monitored." },
    ],
    proofTitle: "Recent work",
    cases: CASES_EN,
    faqTitle: "FAQ",
    faqs: [
      { q: "Will we lose our SEO?", a: "Not if the migration is planned. We keep URLs, titles, descriptions and canonicals, and add 301 redirects for every URL that changes." },
      { q: "Can we keep publishing during the migration?", a: "Almost the whole time. We only ask for a short publishing freeze before the final import." },
      { q: "Which CMSs can you migrate from?", a: "WordPress, Contentful, Prismic, Strapi, Webflow or a custom CMS, as long as the content can be exported." },
      { q: "Do we have to rebuild the front end too?", a: "Usually yes, since the old theme is tied to the old CMS. We rebuild it in Next.js, which is also where most of the speed gains come from." },
    ],
    relatedTitle: "Related",
    related: [
      { label: "Sanity CMS agency", href: "/sanity-agency" },
      { label: "Next.js development agency", href: "/nextjs-agency" },
      { label: "How we use AI in content management", href: "/blog/how-we-use-ai-in-content-management" },
    ],
    closing: {
      title: "Ready to leave WordPress?",
      description: "Send us your site’s address. We’ll come back with a first read on the migration and the next step.",
      ctaLabel: "Plan your migration",
    },
    breadcrumb: "Sanity migration",
  },

  // ─────────────────────────────────────────────────────────── EN · Next.js
  enNextjsAgency: {
    key: "enNextjsAgency",
    lang: "en",
    path: "/nextjs-agency",
    title: "Next.js Development Agency | 1367 Studio",
    description:
      "Next.js agency building marketing sites, SaaS front ends and customer portals in TypeScript, with Sanity for content. For teams in the UK, US and France.",
    serviceName: "Next.js development",
    eyebrow: "Next.js development agency",
    h1: "Next.js websites and SaaS front ends, built to rank.",
    lead: "Your site was built for the company you were. We rebuild marketing sites, customer portals and SaaS front ends in Next.js and TypeScript, with Sanity for content, so they stay fast as you grow and your team can change them without us.",
    ctaLabel: "Book a call",
    highlights: ["Next.js · TypeScript", "Sanity for content", "Deployed on Vercel"],
    problemsTitle: "What we fix",
    problems: [
      { title: "Slow pages", body: "Heavy themes and client-side bloat hurt Core Web Vitals and rankings. We ship server-rendered pages that load fast on mobile." },
      { title: "A front end nobody wants to touch", body: "Legacy React or jQuery, no types, no tests. We rebuild in TypeScript with a structure your next hire can follow." },
      { title: "Portals that don’t exist yet", body: "Customers, applicants or members still email you spreadsheets. We build the portal they log into instead." },
    ],
    servicesTitle: "Next.js services",
    services: [
      { title: "Marketing websites", body: "Next.js and Sanity sites your marketing team edits on its own." },
      { title: "SaaS front ends", body: "Product UIs, dashboards and onboarding flows for SaaS platforms." },
      { title: "Customer portals", body: "Secure areas for customers, applicants or members, connected to your systems." },
      { title: "Replatforming", body: "Moving from WordPress, Gatsby or a legacy React app to Next.js with SEO continuity." },
      { title: "Performance work", body: "Core Web Vitals audits and fixes on existing Next.js sites." },
      { title: "AI features", body: "Chat agents and content automation built into your site, like the one on this page." },
    ],
    processTitle: "How we work",
    process: [
      { title: "Discovery", body: "A call to understand your product, users and constraints, then a scoped proposal." },
      { title: "Design and architecture", body: "Page structure, components and data flow agreed before code." },
      { title: "Build", body: "Iterative delivery with preview deployments for every change." },
      { title: "Launch and support", body: "Redirects, SEO and performance checks, then ongoing improvements." },
    ],
    proofTitle: "Recent work",
    cases: CASES_EN,
    quote: QUOTE_EN,
    faqTitle: "FAQ",
    faqs: [
      { q: "Why Next.js?", a: "Next.js renders pages on the server, which makes them fast to load and easy for search engines and AI crawlers to read. It also scales from a marketing site to a full SaaS front end on one framework." },
      { q: "Which CMS do you pair with Next.js?", a: "Sanity, on every project. We are an official Sanity agency partner." },
      { q: "Do you work with UK and US teams?", a: "Yes, in English, remotely, with calls that fit London hours and US East Coast mornings." },
      { q: "How much does a Next.js project cost?", a: "Every project is scoped individually after a first call. We don’t publish fixed prices." },
    ],
    relatedTitle: "Related",
    related: [
      { label: "Sanity CMS agency", href: "/sanity-agency" },
      { label: "Migrate to Sanity", href: "/sanity-migration" },
      { label: "Agents in the workflow, people at the top", href: "/blog/agents-in-the-workflow-people-at-the-top" },
    ],
    closing: {
      title: "Let’s rebuild it properly.",
      description: "Tell us what your current site or front end can’t do. We’ll come back with a clear scope and the next step.",
      ctaLabel: "Book a call",
    },
    breadcrumb: "Next.js agency",
  },
};

export const landingPageList = Object.values(landingPages);
