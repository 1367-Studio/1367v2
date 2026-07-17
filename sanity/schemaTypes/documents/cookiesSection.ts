export default {
  name: 'cookiesSection',
  title: 'Cookie Policy',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Page Title',
      type: 'string',
      initialValue: 'Cookie Policy',
    },
    {
      name: 'intro',
      title: 'Intro',
      type: 'text',
      rows: 3,
      description: 'Short paragraph under the page title. Optional.',
    },
    {
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'string',
      description: 'Shown above the content, e.g. "16 July 2026".',
    },
    {
      name: 'sections',
      title: 'Sections',
      type: 'array',
      of: [{type: 'legalSection'}],
      description:
        'Each section becomes a numbered block and an entry in the side index. ePrivacy / CNIL expects: what cookies are, the categories you set (strictly necessary, analytics, marketing), who sets them, how long they last, and how to accept, refuse or withdraw consent.',
    },
    {
      name: 'cookies',
      title: 'Cookie Table',
      type: 'array',
      of: [{type: 'cookieItem'}],
      description:
        'Optional table listing each cookie individually. Rendered under the sections.',
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    },
  ],
}
