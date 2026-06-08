export default {
  name: 'featuredCase',
  title: 'Featured Case',
  type: 'object',
  fields: [
    {
      name: 'tag',
      title: 'Tag',
      type: 'string',
    },
    {
      name: 'title',
      title: 'Título',
      type: 'string',
    },
    {
      name: 'description',
      title: 'Descrição',
      type: 'text',
      rows: 4,
    },
    {
      name: 'ctaLabel',
      title: 'Texto do botão',
      type: 'string',
      initialValue: 'VIEW PROJECT',
    },
    {
      name: 'ctaHref',
      title: 'Link do botão',
      type: 'string',
    },
    {
      name: 'image',
      title: 'Imagem (painel direito)',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'cardTitle',
      title: 'Card — Título',
      type: 'string',
    },
    {
      name: 'cardSubtitle',
      title: 'Card — Subtítulo',
      type: 'string',
    },
    {
      name: 'cardCta',
      title: 'Card — Botão',
      type: 'string',
    },
  ],
}
