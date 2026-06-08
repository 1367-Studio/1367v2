// schemaTypes/documents/header.ts
export default {
  name: 'header',
  title: 'Header',
  type: 'document',
  fields: [
    {
      name: 'siteName',
      title: '1367 Studio',
      type: 'string',
    },
    {
      name: 'navigation',
      title: 'Navegação',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'label', title: 'Label', type: 'string'},
            {name: 'href', title: 'Link', type: 'string'},
            {
              name: 'position',
              title: 'Posição',
              type: 'string',
              options: {
                list: [
                  {title: 'Left', value: 'left'},
                  {title: 'Right', value: 'right'},
                ],
              },
            },
          ],
        },
      ],
    },
  ],
}
