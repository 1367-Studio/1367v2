export default {
  name: 'focusAreasSection',
  title: 'Focus Areas Section',
  type: 'document',
  fields: [
    {
      name: 'label',
      title: 'Section Label',
      type: 'string',
      initialValue: 'Focus Areas',
    },
    {
      name: 'items',
      title: 'Focus Areas',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'title', title: 'Title', type: 'string'},
            {
              name: 'subItems',
              title: 'Sub Items',
              type: 'array',
              of: [{type: 'string'}],
            },
            {
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {hotspot: true},
            },
          ],
          preview: {select: {title: 'title'}},
        },
      ],
    },
  ],
}
