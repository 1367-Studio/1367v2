/**
 * Service / location landing pages (SEO): /sanity-agency, /fr/agence-sanity, …
 * The route files live in the frontend (src/pages/…); this document holds the copy.
 * The frontend matches a document by its `path`, so don't change the path of a
 * live page without adding a redirect.
 */
const textItem = (name: string, title: string) => ({
  type: 'object',
  name,
  title,
  fields: [
    {name: 'title', title: 'Title', type: 'string', validation: (Rule: any) => Rule.required()},
    {name: 'body', title: 'Text', type: 'text', rows: 3},
  ],
  preview: {select: {title: 'title', subtitle: 'body'}},
})

export default {
  name: 'landingPage',
  title: 'Landing Page (SEO)',
  type: 'document',
  groups: [
    {name: 'seo', title: 'SEO', default: true},
    {name: 'hero', title: 'Hero'},
    {name: 'sections', title: 'Sections'},
    {name: 'faq', title: 'FAQ'},
  ],
  fields: [
    {
      name: 'lang',
      title: 'Language',
      type: 'string',
      group: 'seo',
      options: {list: [{title: 'English', value: 'en'}, {title: 'Français', value: 'fr'}], layout: 'radio'},
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'path',
      title: 'URL path',
      description: 'Must match an existing page route, e.g. /sanity-agency or /fr/agence-sanity.',
      type: 'string',
      group: 'seo',
      readOnly: true,
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'alternatePath',
      title: 'Translation (other language) path',
      description: 'Used for hreflang. Leave empty when the page exists in one language only.',
      type: 'string',
      group: 'seo',
    },
    {
      name: 'title',
      title: 'SEO title',
      description: 'Max ~60 characters. Shown in Google and the browser tab.',
      type: 'string',
      group: 'seo',
      validation: (Rule: any) => Rule.required().max(65),
    },
    {
      name: 'description',
      title: 'Meta description',
      description: 'Max ~160 characters.',
      type: 'text',
      rows: 3,
      group: 'seo',
      validation: (Rule: any) => Rule.required().max(165),
    },
    {name: 'serviceName', title: 'Service name (structured data)', type: 'string', group: 'seo'},
    {name: 'breadcrumb', title: 'Breadcrumb label', type: 'string', group: 'seo'},

    {name: 'eyebrow', title: 'Eyebrow', type: 'string', group: 'hero'},
    {name: 'h1', title: 'H1', type: 'string', group: 'hero', validation: (Rule: any) => Rule.required()},
    {name: 'lead', title: 'Lead paragraph', type: 'text', rows: 4, group: 'hero'},
    {name: 'ctaLabel', title: 'Button label', type: 'string', group: 'hero'},
    {name: 'highlights', title: 'Highlights (pills)', type: 'array', of: [{type: 'string'}], group: 'hero'},

    {name: 'problemsTitle', title: 'Problems — title', type: 'string', group: 'sections'},
    {name: 'problems', title: 'Problems', type: 'array', of: [textItem('problem', 'Problem')], group: 'sections'},
    {name: 'servicesTitle', title: 'Services — title', type: 'string', group: 'sections'},
    {name: 'services', title: 'Services', type: 'array', of: [textItem('serviceItem', 'Service')], group: 'sections'},
    {name: 'processTitle', title: 'Process — title', type: 'string', group: 'sections'},
    {name: 'process', title: 'Process steps', type: 'array', of: [textItem('step', 'Step')], group: 'sections'},
    {name: 'proofTitle', title: 'Case studies — title', type: 'string', group: 'sections'},
    {
      name: 'cases',
      title: 'Case studies',
      type: 'array',
      group: 'sections',
      of: [
        {
          type: 'object',
          name: 'caseLink',
          fields: [
            {name: 'project', title: 'Project', type: 'reference', to: [{type: 'project'}]},
            {name: 'summary', title: 'Summary', type: 'text', rows: 3},
          ],
          preview: {select: {title: 'project.title', subtitle: 'summary'}},
        },
      ],
    },
    {
      name: 'quote',
      title: 'Testimonial',
      type: 'object',
      group: 'sections',
      fields: [
        {name: 'text', title: 'Quote', type: 'text', rows: 3},
        {name: 'author', title: 'Author', type: 'string'},
      ],
    },
    {
      name: 'local',
      title: 'Location block',
      type: 'object',
      group: 'sections',
      fields: [
        {name: 'title', title: 'Title', type: 'string'},
        {name: 'body', title: 'Text', type: 'text', rows: 3},
        {name: 'lines', title: 'Address / contact lines', type: 'array', of: [{type: 'string'}]},
      ],
    },
    {name: 'relatedTitle', title: 'Related links — title', type: 'string', group: 'sections'},
    {
      name: 'related',
      title: 'Related links',
      type: 'array',
      group: 'sections',
      of: [
        {
          type: 'object',
          name: 'relatedLink',
          fields: [
            {name: 'label', title: 'Label', type: 'string'},
            {name: 'href', title: 'Link', type: 'string'},
          ],
          preview: {select: {title: 'label', subtitle: 'href'}},
        },
      ],
    },
    {
      name: 'closing',
      title: 'Closing call to action',
      type: 'object',
      group: 'sections',
      fields: [
        {name: 'title', title: 'Title', type: 'string'},
        {name: 'description', title: 'Text', type: 'text', rows: 3},
        {name: 'ctaLabel', title: 'Button label', type: 'string'},
      ],
    },

    {name: 'faqTitle', title: 'FAQ — title', type: 'string', group: 'faq'},
    {
      name: 'faqs',
      title: 'Questions',
      type: 'array',
      group: 'faq',
      of: [
        {
          type: 'object',
          name: 'faqItem',
          fields: [
            {name: 'q', title: 'Question', type: 'string'},
            {name: 'a', title: 'Answer', type: 'text', rows: 4},
          ],
          preview: {select: {title: 'q'}},
        },
      ],
    },
  ],
  preview: {select: {title: 'title', subtitle: 'path'}},
}
