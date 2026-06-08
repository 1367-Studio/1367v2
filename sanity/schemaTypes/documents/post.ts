export default {
  name: 'post',
  title: 'Post',
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
      options: { source: 'title' },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'publishedAt',
      title: 'Data de publicação',
      type: 'datetime',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'coverImage',
      title: 'Imagem de capa',
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          title: 'Texto alternativo',
          type: 'string',
        },
      ],
    },
    {
      name: 'excerpt',
      title: 'Resumo',
      type: 'text',
      rows: 3,
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
};
