export default {
  name: 'testimonialsSection',
  title: 'Testimonials Section',
  type: 'document',
  fields: [
    {
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      of: [{ type: 'testimonialItem' }],
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
      of: [{ type: 'brandLogo' }],
    },
  ],
}
