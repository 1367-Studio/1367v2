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
      name: 'projects',
      title: 'Projects',
      type: 'projects',
    },
    {
      name: 'featuredCase2',
      title: 'Featured Case 2',
      type: 'featuredCase2',
    },
    {
      name: 'marquee',
      title: 'Marquee',
      type: 'marquee',
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    },
  ],
}
