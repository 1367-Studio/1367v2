export default {
  name: 'featuredCase3Section',
  title: 'Featured Case 3 Section',
  type: 'document',
  fields: [
    {name: 'tag', title: 'Tag', type: 'string'},
    {name: 'title', title: 'Title', type: 'string'},
    {
      name: 'rightText',
      title: 'Right text',
      type: 'text',
      rows: 4,
    },
    {
      name: 'ctaLabel',
      title: 'Button — Label',
      type: 'string',
      initialValue: 'VIEW PROJECT',
    },
    {name: 'ctaHref', title: 'Button — Link', type: 'string'},
  ],
}
