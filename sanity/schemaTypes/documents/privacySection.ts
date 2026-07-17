export default {
  name: 'privacySection',
  title: 'Privacy Policy',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Page Title',
      type: 'string',
      initialValue: 'Privacy Policy',
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
        'Each section becomes a numbered block and an entry in the side index. GDPR art. 13/14 requires: controller identity and contact, data collected, purposes and legal basis, recipients and processors, transfers outside the EU, retention periods, your rights (access, rectification, erasure, restriction, portability, objection), right to withdraw consent, right to lodge a complaint with the CNIL.',
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    },
  ],
}
