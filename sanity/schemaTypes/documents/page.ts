export default {
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    {
      name: 'identifier',
      title: 'Identificador',
      type: 'string',
      description: 'Uso interno: "home" ou "contact"',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'title',
      title: 'Título',
      type: 'string',
    },
    {
      name: 'body',
      title: 'Conteúdo',
      type: 'blockContent',
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    },
  ],
}
