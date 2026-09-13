export default {
  name: 'projectsPageSection',
  title: 'Project Index',
  type: 'document',
  fields: [
    // Header
    { name: 'title',       title: 'Title (e.g. "Projects That Make an Impact")', type: 'text', rows: 2 },
    { name: 'description', title: 'Description',                                type: 'text', rows: 3 },
    {
      name: 'featuredProjects',
      title: 'Grid — Projects',
      description:
        'Pick which Project Pages show up on the /projects grid, and drag to set their order. Create the project first (under Project Pages), then add it here.',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'project'}]}],
    },
  ],
}
