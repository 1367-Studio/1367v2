export default {
  name: 'footer',
  title: 'Footer',
  type: 'document',
  fields: [
    {
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: "Let's design what's next.",
    },
    {
      name: 'ctaLabel',
      title: 'Button — Label',
      type: 'string',
      initialValue: 'CONTACT US',
    },
    {
      name: 'ctaHref',
      title: 'Button — Link',
      type: 'string',
    },
    {
      name: 'navLinks',
      title: 'Nav Links',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'navLink',
          fields: [
            { name: 'label', title: 'Label', type: 'string' },
            { name: 'href', title: 'Link', type: 'string' },
          ],
          preview: { select: { title: 'label' } },
        },
      ],
    },
    {
      name: 'heading_fr',
      title: 'Heading (French pages)',
      type: 'string',
      initialValue: 'Imaginons la suite.',
    },
    {
      name: 'ctaLabel_fr',
      title: 'Button — Label (French pages)',
      type: 'string',
      initialValue: 'NOUS CONTACTER',
    },
    {
      name: 'navLinks_fr',
      title: 'Nav Links (French pages)',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'navLink',
          fields: [
            { name: 'label', title: 'Label', type: 'string' },
            { name: 'href', title: 'Link', type: 'string' },
          ],
          preview: { select: { title: 'label' } },
        },
      ],
    },
    {
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'locations',
      title: 'Offices',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'location',
          fields: [
            { name: 'city', title: 'City', type: 'string' },
            { name: 'country', title: 'Country', type: 'string' },
            { name: 'phone', title: 'Phone', type: 'string' },
            { name: 'address', title: 'Address', type: 'text', rows: 3 },
          ],
          preview: { select: { title: 'city', subtitle: 'country' } },
        },
      ],
    },
  ],
}
