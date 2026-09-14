export default {
  name: 'tableBlock',
  title: 'Table',
  type: 'object',
  fields: [
    {
      name: 'rows',
      title: 'Rows',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'row',
          title: 'Row',
          fields: [
            {
              name: 'cells',
              title: 'Cells',
              type: 'array',
              of: [{type: 'string'}],
            },
          ],
          preview: {
            select: {cells: 'cells'},
            prepare({cells}: any) {
              return {title: (cells || []).join(' | ') || 'Empty row'}
            },
          },
        },
      ],
      validation: (Rule: any) => Rule.min(1),
    },
  ],
  preview: {
    select: {rows: 'rows'},
    prepare({rows}: any) {
      return {
        title: 'Table',
        subtitle: `${rows?.length ?? 0} row(s)`,
      }
    },
  },
}
