export default {
  name: 'projectSection',
  title: 'Project Section',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'subtitle', title: 'Subtitle', type: 'string' },
    { name: 'brandsLabel', title: 'Brands Label', type: 'string' },
    {
      name: 'brands',
      title: 'Brands',
      type: 'array',
      of: [{ type: 'brandLogo' }],
    },
  ],
}
