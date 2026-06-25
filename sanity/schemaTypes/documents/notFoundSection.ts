export default {
  name: 'notFoundSection',
  title: '404 — Not Found',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Heading',
      type: 'string',
      initialValue: 'Page not Found',
    },
    {
      name: 'ctaLabel',
      title: 'Button Label',
      type: 'string',
      initialValue: 'go back to home',
    },
    {
      name: 'ctaHref',
      title: 'Button Link',
      type: 'string',
      initialValue: '/',
    },
  ],
}
