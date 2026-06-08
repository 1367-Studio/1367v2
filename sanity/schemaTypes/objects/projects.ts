export default {
  name: 'projects',
  title: 'Projects',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
    },
    {
      name: 'brandsLabel',
      title: 'Brands Label',
      type: 'string',
    },
    {
      name: 'brands',
      title: 'Brands',
      type: 'array',
      of: [{type: 'brandLogo'}],
    },
  ],
}
