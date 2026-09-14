export default {
  name: 'imageBlock',
  title: 'Image',
  type: 'object',
  fields: [
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'alt',
      title: 'Alt text',
      type: 'string',
    },
    {
      name: 'caption',
      title: 'Caption',
      type: 'string',
    },
  ],
  preview: {
    select: {media: 'image', caption: 'caption', alt: 'alt'},
    prepare({media, caption, alt}: any) {
      return {
        title: 'Image',
        subtitle: caption || alt || undefined,
        media,
      }
    },
  },
}
