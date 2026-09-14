export default {
  name: 'blogPageSection',
  title: 'Blog Page',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title (e.g. "From the Studio")',
      type: 'text',
      rows: 2,
    },
    {
      name: 'slug',
      title: 'Slug',
      description: 'Reserved for future use — the /blog URL is currently fixed in code.',
      type: 'slug',
      options: {source: 'title'},
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    },
  ],
}
