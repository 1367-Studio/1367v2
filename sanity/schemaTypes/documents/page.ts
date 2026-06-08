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
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    },
  ],
}
