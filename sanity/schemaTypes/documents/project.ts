export default {
  name: 'project',
  title: 'Project Page',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      description: 'Nome do projeto (ex: "ASR Temp").',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      description: 'Define a URL da página: /projects/<slug>',
      type: 'slug',
      options: {source: 'title'},
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'excerpt',
      title: 'Excerpt',
      description: 'Short blurb shown on the project card in the /projects grid.',
      type: 'text',
      rows: 3,
    },
    {
      name: 'coverImage',
      title: 'Cover Image',
      description:
        'Image shown on the project card in the /projects grid. Also used as the poster/fallback frame if a Cover Video is set.',
      type: 'image',
      options: {hotspot: true},
      fields: [{name: 'alt', title: 'Alt text', type: 'string'}],
    },
    {
      name: 'coverVideo',
      title: 'Cover Video',
      description:
        'Optional. If set, this autoplays (muted, looped) on the project card in the /projects grid instead of the Cover Image.',
      type: 'file',
      options: {accept: 'video/*'},
    },
    {
      name: 'ctaLabel',
      title: 'Card CTA Label',
      description:
        'Button text on the project card, e.g. "New Website" or "See more". Defaults to "See more".',
      type: 'string',
    },
    {
      name: 'heroClient',
      title: 'Hero — Client Name',
      type: 'string',
    },
    {
      name: 'heroTitle',
      title: 'Hero — Title',
      type: 'string',
    },
    {
      name: 'heroService',
      title: 'Hero — Service',
      type: 'string',
    },
    {
      name: 'heroYear',
      title: 'Hero — Year',
      type: 'number',
    },
    {
      name: 'heroIndustry',
      title: 'Hero — Industry',
      type: 'string',
    },
    {
      name: 'sections',
      title: 'Video Sections',
      description:
        'Each section is one row on the page. Add videos in the order they should appear.',
      type: 'array',
      of: [{type: 'videoSection'}],
    },
    {
      name: 'overviewTitle',
      title: 'Overview — Title',
      type: 'string',
    },
    {
      name: 'overviewBody',
      title: 'Overview — Body',
      type: 'text',
      rows: 5,
    },
    {
      name: 'tabletImage',
      title: 'Tablet Image',
      type: 'image',
      options: {hotspot: true},
      fields: [{name: 'alt', title: 'Alt text', type: 'string'}],
    },
    {
      name: 'whatWeDidTitle',
      title: 'What We Did — Title',
      type: 'string',
    },
    {
      name: 'whatWeDidBody',
      title: 'What We Did — Body',
      type: 'text',
      rows: 5,
    },
    {
      name: 'testimonialQuote',
      title: 'Testimonial — Quote',
      type: 'text',
      rows: 4,
    },
    {
      name: 'testimonialAuthor',
      title: 'Testimonial — Author',
      type: 'string',
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
        title: title ?? 'Untitled project',
        subtitle: slug ? `/projects/${slug}` : 'no slug yet',
        media,
      }
    },
  },
}
