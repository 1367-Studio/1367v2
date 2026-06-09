export default {
  name: 'ticker',
  title: 'Ticker',
  type: 'object',
  fields: [
    {
      name: 'items',
      title: 'Itens',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'tickerItem',
          fields: [
            {
              name: 'label',
              title: 'Texto',
              type: 'string',
            },
            {
              name: 'image',
              title: 'Imagem / Ícone',
              type: 'image',
              options: { hotspot: true },
            },
          ],
          preview: {
            select: { title: 'label' },
          },
        },
      ],
    },
  ],
}
