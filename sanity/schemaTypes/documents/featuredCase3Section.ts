export default {
  name: 'featuredCase3Section',
  title: 'Featured Cases Section',
  type: 'document',
  fields: [
    {
      name: 'cases',
      title: 'Cases',
      type: 'array',
      of: [
        {
          type: 'object',
          preview: {
            select: {title: 'title', subtitle: 'tag'},
          },
          fields: [
            {name: 'tag', title: 'Tag', type: 'string'},
            {name: 'title', title: 'Title', type: 'string'},
            {
              name: 'bgImage',
              title: 'Background Image',
              type: 'image',
              options: {hotspot: true},
            },
            {
              name: 'manImageDesktop',
              title: 'Subject Image — Desktop',
              type: 'image',
              options: {hotspot: true},
            },
            {
              name: 'manImageMobile',
              title: 'Subject Image — Mobile',
              type: 'image',
              options: {hotspot: true},
            },
            {
              name: 'rightText',
              title: 'Right Text',
              type: 'text',
              rows: 4,
            },
            {
              name: 'ctaLabel',
              title: 'Button — Label',
              type: 'string',
              initialValue: 'VIEW PROJECT',
            },
            {name: 'ctaHref', title: 'Button — Link', type: 'string'},
          ],
        },
      ],
    },
  ],
}
