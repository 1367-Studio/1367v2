export default {
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    {
      name: 'identifier',
      title: 'Identificador',
      type: 'string',
      description: 'Uso interno: "home"',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'title',
      title: 'Título',
      type: 'string',
    },
    {
      name: 'hero',
      title: 'Hero',
      type: 'hero',
    },
    {
      name: 'statement',
      title: 'Statement',
      type: 'statement',
    },
    {
      name: 'ticker',
      title: 'Ticker',
      type: 'ticker',
    },
    {
      name: 'featuredCase',
      title: 'Featured Case (Split Screen)',
      type: 'featuredCase',
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    },
  ],
}
