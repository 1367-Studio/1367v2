export default {
  name: 'aboutPhilosophySection',
  title: 'About — Our Philosophy Section',
  type: 'document',
  fields: [
    {name: 'label', title: 'Top label', type: 'string'},
    {name: 'text', title: 'Philosophy text', type: 'text', rows: 5},
    {
      name: 'stats',
      title: 'Stats',
      type: 'array',
      of: [{type: 'stat'}],
    },
  ],
}
