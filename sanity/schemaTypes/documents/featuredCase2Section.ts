export default {
  name: 'featuredCase2Section',
  title: 'Featured Case 2 Section',
  type: 'document',
  fields: [
    { name: 'tag', title: 'Tag', type: 'string' },
    { name: 'title', title: 'Title', type: 'string' },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    },
    {
      name: 'ctaLabel',
      title: 'Button — Label',
      type: 'string',
      initialValue: 'VIEW PROJECT',
    },
    { name: 'ctaHref', title: 'Button — Link', type: 'string' },
    { name: 'panelTitle', title: 'Panel Title (right)', type: 'string' },
    {
      name: 'items',
      title: 'Cards (right panel)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'icon', title: 'Icon (top-left)', type: 'image', options: { hotspot: true } },
            { name: 'image', title: 'Main Photo', type: 'image', options: { hotspot: true } },
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'subtitle', title: 'Subtitle', type: 'string' },
          ],
        },
      ],
      validation: (Rule: any) => Rule.max(2),
    },
  ],
}
