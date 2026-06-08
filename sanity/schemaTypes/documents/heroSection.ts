export default {
  name: 'heroSection',
  title: 'Hero Section',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'subtitle', title: 'Subtitle', type: 'string' },
    { name: 'description', title: 'Description', type: 'string' },
    { name: 'ctaLabel', title: 'Button — Label', type: 'string' },
    { name: 'ctaHref', title: 'Button — Link', type: 'string' },
    {
      name: 'video',
      title: 'Background Video',
      type: 'file',
      options: { accept: 'video/*' },
    },
  ],
}
