export default {
  name: 'header',
  title: 'Header',
  type: 'document',
  fields: [
    {
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: { hotspot: false },
    },
    {
      name: 'navigation',
      title: 'Navigation',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Label', type: 'string' },
            { name: 'href', title: 'Link', type: 'string' },
            {
              name: 'position',
              title: 'Position',
              type: 'string',
              options: {
                list: [
                  { title: 'Left', value: 'left' },
                  { title: 'Right', value: 'right' },
                ],
              },
            },
          ],
        },
      ],
    },
    {
      name: 'menuPrimary',
      title: 'Menu — primary links',
      description: 'The large links in the burger menu (e.g. Our Work, Inside 1367, Get in touch).',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Label', type: 'string' },
            { name: 'href', title: 'Link', type: 'string' },
          ],
          preview: { select: { title: 'label', subtitle: 'href' } },
        },
      ],
    },
    {
      name: 'menuSecondary',
      title: 'Menu — secondary links',
      description: 'The small links below (e.g. Blog, Privacy Policy, Legal Notice).',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Label', type: 'string' },
            { name: 'href', title: 'Link', type: 'string' },
          ],
          preview: { select: { title: 'label', subtitle: 'href' } },
        },
      ],
    },
    {
      name: 'menuImages',
      title: 'Menu — images',
      description: 'The three thumbnails at the bottom of the menu. Each can link somewhere.',
      type: 'array',
      validation: (Rule: any) => Rule.max(3),
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
              fields: [{ name: 'alt', title: 'Alt text', type: 'string' }],
            },
            { name: 'href', title: 'Link', type: 'string' },
          ],
          preview: { select: { media: 'image', subtitle: 'href' } },
        },
      ],
    },
  ],
}
