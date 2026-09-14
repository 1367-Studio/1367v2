export default {
  name: 'videoBlock',
  title: 'Video',
  type: 'object',
  fields: [
    {
      name: 'video',
      title: 'Video',
      type: 'file',
      options: {accept: 'video/*'},
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'poster',
      title: 'Poster (fallback image)',
      type: 'image',
      options: {hotspot: true},
    },
    {
      name: 'caption',
      title: 'Caption',
      type: 'string',
    },
  ],
  preview: {
    select: {media: 'poster', caption: 'caption'},
    prepare({media, caption}: any) {
      return {
        title: 'Video',
        subtitle: caption || undefined,
        media,
      }
    },
  },
}
