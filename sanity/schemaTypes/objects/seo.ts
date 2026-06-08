export default {
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'Meta title',
      type: 'string',
    },
    {
      name: 'description',
      title: 'Meta description',
      type: 'text',
      rows: 3,
    },
    {
      name: 'ogImage',
      title: 'Imagem OG',
      type: 'image',
    },
  ],
};
