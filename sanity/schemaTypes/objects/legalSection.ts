export default {
  name: 'legalSection',
  title: 'Section',
  type: 'object',
  fields: [
    {
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 12,
      description:
        'Plain text. Press Enter for a new paragraph, line breaks are preserved on the page. Start a line with "- " to render it as a bullet.',
    },
  ],
  preview: {select: {title: 'heading', subtitle: 'body'}},
}
