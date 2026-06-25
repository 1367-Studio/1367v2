export default {
  name: 'officeItem',
  title: 'Office',
  type: 'object',
  fields: [
    {name: 'city', title: 'City, Country', type: 'string'},
    {name: 'phone', title: 'Phone', type: 'string'},
    {name: 'address', title: 'Address', type: 'text', rows: 3},
  ],
  preview: {
    select: {title: 'city'},
  },
}
