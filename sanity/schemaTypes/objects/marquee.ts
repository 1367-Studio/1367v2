export default {
  name: 'marquee',
  title: 'Marquee',
  type: 'object',
  fields: [
    {
      name: 'items',
      title: 'Itens',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [{name: 'label', title: 'Texto', type: 'string'}],
        },
      ],
    },
  ],
}
