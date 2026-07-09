export default {
  name: 'heroSection',
  title: 'Hero Section',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Use \\n to break into two lines (e.g. "Building\\nWorldwide")',
    },
    {
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      description: 'Use \\n to break into two lines (e.g. "Building\\nWorldwide")',
    },
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
