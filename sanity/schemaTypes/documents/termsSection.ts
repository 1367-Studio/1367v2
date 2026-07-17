export default {
  name: 'termsSection',
  title: 'Terms & Conditions',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Page Title',
      type: 'string',
      initialValue: 'Terms & Conditions',
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
        'Each section becomes a numbered block and an entry in the side index. Typically: scope, services, quotes and orders, pricing and payment, late payment penalties, deliverables and IP transfer, client obligations, liability, confidentiality, termination, force majeure, governing law and jurisdiction, consumer withdrawal right.',
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    },
  ],
}
