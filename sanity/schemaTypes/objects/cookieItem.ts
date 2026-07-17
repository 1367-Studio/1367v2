export default {
  name: 'cookieItem',
  title: 'Cookie',
  type: 'object',
  fields: [
    {name: 'name', title: 'Name', type: 'string'},
    {name: 'provider', title: 'Provider', type: 'string', description: 'e.g. "1367studio.com", "Google"'},
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Strictly necessary', value: 'necessary'},
          {title: 'Analytics', value: 'analytics'},
          {title: 'Marketing', value: 'marketing'},
          {title: 'Preferences', value: 'preferences'},
        ],
      },
    },
    {name: 'purpose', title: 'Purpose', type: 'text', rows: 2},
    {name: 'duration', title: 'Duration', type: 'string', description: 'e.g. "13 months", "Session"'},
  ],
  preview: {select: {title: 'name', subtitle: 'purpose'}},
}
