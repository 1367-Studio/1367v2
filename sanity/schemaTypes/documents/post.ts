export default {
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'featured',
      title: 'Featured',
      description:
        'Show this post in the large featured slot at the top of /blog. If more than one post is marked featured, the most recent one wins.',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'authors',
      title: 'Authors',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'author'}]}],
    },
    {
      name: 'categories',
      title: 'Categories',
      description: 'Used for the filter pills on /blog and the badges on the card.',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'category'}]}],
    },
    {
      name: 'coverImage',
      title: 'Image',
      description: 'Shown on the post card in the /blog grid, and at the top of the post.',
      type: 'image',
      options: { hotspot: true },
      fields: [
        { name: 'alt', title: 'Alt text', type: 'string' },
      ],
    },
    {
      name: 'excerpt',
      title: 'Excerpt',
      description: 'Short blurb shown on the post card in the /blog grid.',
      type: 'text',
      rows: 3,
    },
    {
      name: 'ctaLabel',
      title: 'Card CTA Label',
      description: 'Button text on the post card, e.g. "Read more". Defaults to "Read more".',
      type: 'string',
    },
    {
      name: 'description',
      title: 'Description',
      description: 'Longer intro shown at the top of the post itself (not the card).',
      type: 'text',
      rows: 3,
    },
    {
      name: 'body',
      title: 'Body',
      description:
        'Add blocks in the order they should appear on the post — text, image, table, or video.',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H1', value: 'h1'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
            {title: 'H4', value: 'h4'},
            {title: 'Quote', value: 'blockquote'},
          ],
          lists: [
            {title: 'Bullet', value: 'bullet'},
            {title: 'Numbered', value: 'number'},
          ],
          marks: {
            decorators: [
              {title: 'Bold', value: 'strong'},
              {title: 'Italic', value: 'em'},
            ],
            annotations: [
              {
                name: 'link',
                title: 'Link',
                type: 'object',
                fields: [{name: 'href', title: 'URL', type: 'url'}],
              },
            ],
          },
        },
        {type: 'imageBlock'},
        {type: 'tableBlock'},
        {type: 'videoBlock'},
      ],
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    },
  ],
  preview: {
    select: {title: 'title', slug: 'slug.current', media: 'coverImage'},
    prepare({title, slug, media}: any) {
      return {
        title: title ?? 'Untitled post',
        subtitle: slug ? `/blog/${slug}` : 'no slug yet',
        media,
      }
    },
  },
}
