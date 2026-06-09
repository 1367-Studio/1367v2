export default {
  name: 'testimonialItem',
  title: 'Testimonial Item',
  type: 'object',
  fields: [
    { name: 'quote', title: 'Quote', type: 'text' },
    { name: 'author', title: 'Author (Name - Company)', type: 'string' },
    {
      name: 'avatar',
      title: 'Avatar',
      type: 'image',
      options: { hotspot: true },
    },
  ],
}
