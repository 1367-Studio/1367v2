export default {
  name: 'projectsPageSection',
  title: 'Projects Page',
  type: 'document',
  fields: [
    // Hero
    { name: 'heroClient',   title: 'Hero — Client Name',  type: 'string' },
    { name: 'heroTitle',    title: 'Hero — Title',         type: 'string' },
    { name: 'heroService',  title: 'Hero — Service',       type: 'string' },
    { name: 'heroYear',     title: 'Hero — Year',          type: 'number' },
    { name: 'heroIndustry', title: 'Hero — Industry',      type: 'string' },

    // Overview
    { name: 'overviewTitle', title: 'Overview — Title', type: 'string' },
    { name: 'overviewBody',  title: 'Overview — Body',  type: 'text', rows: 5 },

    // What We Did
    { name: 'whatWeDidTitle', title: 'What We Did — Title', type: 'string' },
    { name: 'whatWeDidBody',  title: 'What We Did — Body',  type: 'text', rows: 5 },

    // Testimonial
    { name: 'testimonialQuote',  title: 'Testimonial — Quote',  type: 'text', rows: 4 },
    { name: 'testimonialAuthor', title: 'Testimonial — Author', type: 'string' },

    // Tablet Picture
    {
      name: 'tabletImage',
      title: 'Tablet Image',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', title: 'Alt text', type: 'string' }],
    },
  ],
}
