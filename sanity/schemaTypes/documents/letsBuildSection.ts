export default {
  name: 'letsBuildSection',
  title: "Let's Build Section",
  type: 'document',
  fields: [
    {name: 'title', title: 'Title', type: 'string'},
    {
      name: 'ctaLabel',
      title: 'Button — Label',
      type: 'string',
      initialValue: 'VIEW PROJECT',
    },
    {name: 'ctaHref', title: 'Button — Link', type: 'string'},
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    },
  ],
}
