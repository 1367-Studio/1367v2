export default {
  name: 'mentionsLegalesSection',
  title: 'Mentions Légales',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Page Title',
      type: 'string',
      initialValue: 'Mentions Légales',
    },
    {
      name: 'intro',
      title: 'Intro',
      type: 'text',
      rows: 3,
      description: 'Short paragraph under the page title. Optional.',
    },
    {
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'string',
      description: 'Shown above the content, e.g. "16 July 2026".',
    },
    {
      name: 'sections',
      title: 'Sections',
      type: 'array',
      of: [{type: 'legalSection'}],
      description:
        'Each section becomes a numbered block and an entry in the side index. Required by French law (LCEN art. 6-III): publisher identity, share capital, RCS/SIRET, VAT number, publication director, host name and address.',
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    },
  ],
}
