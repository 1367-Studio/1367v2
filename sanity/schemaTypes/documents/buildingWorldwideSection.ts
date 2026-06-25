import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'buildingWorldwideSection',
  title: 'Building Worldwide Section',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Use \\n to break into two lines (e.g. "Building\\nWorldwide")',
    }),
  ],
})
