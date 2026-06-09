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
    {
      name: 'image',
      title: 'Image (right panel)',
      type: 'image',
      options: { hotspot: true },
    },
    { name: 'imageTitle', title: 'Image — Title', type: 'string' },
  ],
}
