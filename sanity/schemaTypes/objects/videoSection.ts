export default {
  type: 'object',
  name: 'videoSection',
  title: 'Video Section',
  fields: [
    {
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          {title: 'Two videos side by side', value: 'two'},
          {title: 'Single video', value: 'one'},
          {title: 'One video + two stacked', value: 'stack'},
          {title: 'Video + SVG', value: 'videoSvg'},
        ],
        layout: 'radio',
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'videos',
      title: 'Videos (in order)',
      description:
        '"Two videos side by side" needs 2. "Single video" needs 1. "One video + two stacked" needs 3 (main first, then the two stacked ones). "Video + SVG" needs 1 (the video that goes on the left).',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'videoItem',
          title: 'Video',
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
          ],
          preview: {
            select: {media: 'poster'},
            prepare() {
              return {title: 'Video'}
            },
          },
        },
      ],
      validation: (Rule: any) => Rule.min(1).max(3),
    },
    {
      name: 'svg',
      title: 'SVG (right side)',
      description: 'Only used by the "Video + SVG" layout.',
      type: 'file',
      options: {accept: 'image/svg+xml'},
    },
  ],
  preview: {
    select: {layout: 'layout', videoCount: 'videos.length'},
    prepare({layout, videoCount}: any) {
      const labels: Record<string, string> = {
        two: 'Two videos side by side',
        one: 'Single video',
        stack: 'One video + two stacked',
        videoSvg: 'Video + SVG',
      }
      return {
        title: labels[layout] ?? 'Video section',
        subtitle: `${videoCount ?? 0} video(s)`,
      }
    },
  },
}
