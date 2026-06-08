export default {
  name: 'tickerSection',
  title: 'Ticker Section',
  type: 'document',
  fields: [
    {
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'tickerItem',
          fields: [
            { name: 'label', title: 'Label', type: 'string' },
            {
              name: 'image',
              title: 'Image / Icon',
              type: 'image',
              options: { hotspot: true },
            },
          ],
          preview: { select: { title: 'label' } },
        },
      ],
    },
  ],
}
