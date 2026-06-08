export default {
  name: 'brandLogo',
  title: 'Brand Logo',
  type: 'object',
  fields: [
    {
      name: 'name',
      title: 'Nome da empresa',
      type: 'string',
    },
    {
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {hotspot: false},
      fields: [
        {
          name: 'alt',
          title: 'Alt text',
          type: 'string',
        },
      ],
    },
  ],
}
