export default {
  name: 'contactSection',
  title: 'Contact Section',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Page Title',
      type: 'string',
      initialValue: "Let's build something that matters.",
    },
    {
      name: 'connectTitle',
      title: 'Connect Block Title',
      type: 'text',
      rows: 2,
      initialValue: 'Connect\nwith us',
    },
    {
      name: 'offices',
      title: 'Offices',
      type: 'array',
      of: [{type: 'officeItem'}],
    },
    {
      name: 'email',
      title: 'Contact Email',
      type: 'string',
      initialValue: 'hello@1367studio.com',
    },
    {
      name: 'submitLabel',
      title: 'Form Button Label',
      type: 'string',
      initialValue: 'Submit',
    },
  ],
}
