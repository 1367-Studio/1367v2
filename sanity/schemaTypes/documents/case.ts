export default {
  name: 'case',
  title: 'Case',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'client',
      title: 'Cliente',
      type: 'string',
    },
    {
      name: 'year',
      title: 'Ano',
      type: 'number',
    },
    {
      name: 'services',
      title: 'Serviços',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags', // aparece como tags no Studio
      },
    },
    {
      name: 'coverImage',
      title: 'Imagem de capa',
      type: 'image',
      options: {hotspot: true},
      fields: [{name: 'alt', title: 'Alt', type: 'string'}],
    },
    {
      name: 'excerpt',
      title: 'Resumo',
      type: 'text',
      rows: 3,
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    },
  ],
}
