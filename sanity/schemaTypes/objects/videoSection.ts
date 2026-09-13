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
      title: 'Media (in order)',
      description:
        'Each slot is a video OR a static image — fill in one or the other. "Two videos side by side" needs 2. "Single video" needs 1. "One video + two stacked" needs 3 (main first, then the two stacked ones). "Video + SVG" needs 1 (the media that goes on the left).',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'videoItem',
          title: 'Media',
          fields: [
            {
              name: 'video',
              title: 'Video',
              description: 'Leave empty if using a static Image instead.',
              type: 'file',
              options: {accept: 'video/*'},
            },
            {
              name: 'poster',
              title: 'Poster (video fallback frame)',
              type: 'image',
              options: {hotspot: true},
            },
            {
              name: 'image',
              title: 'Image',
              description: 'Used instead of Video when no video is set.',
              type: 'image',
              options: {hotspot: true},
              fields: [{name: 'alt', title: 'Alt text', type: 'string'}],
            },
          ],
          validation: (Rule: any) =>
            Rule.custom((item: any) => {
              if (!item?.video && !item?.image) {
                return 'Set either a Video or an Image.'
              }
              return true
            }),
          preview: {
            select: {media: 'image', poster: 'poster', hasVideo: 'video'},
            prepare({media, poster, hasVideo}: any) {
              return {
                title: hasVideo ? 'Video' : media ? 'Image' : 'Empty',
                media: media ?? poster,
              }
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
