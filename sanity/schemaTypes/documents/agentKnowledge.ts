export default {
  name: 'agentKnowledge',
  title: 'Ask Agent',
  type: 'document',
  fields: [
    {
      name: 'welcomeMessage',
      title: 'Welcome message',
      type: 'text',
      rows: 2,
      description: 'Shown when the chat panel opens, before the visitor asks anything.',
    },
    {
      name: 'suggestedQuestions',
      title: 'Suggested questions',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Clickable starter questions shown under the welcome message.',
      validation: (Rule: any) => Rule.max(4),
    },
    {
      name: 'about',
      title: 'About the studio',
      type: 'text',
      rows: 6,
      description: 'Who we are, where we are, what we do. The agent treats this as the source of truth.',
    },
    {
      name: 'services',
      title: 'Services',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'stack',
      title: 'Stack',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Frameworks, CMS, hosting and tools we work with.',
    },
    {
      name: 'languages',
      title: 'Languages spoken',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'facts',
      title: 'Knowledge entries',
      type: 'array',
      description:
        'Anything else the agent should know: process, timelines, pricing stance, partnerships, team. One topic per entry.',
      of: [
        {
          type: 'object',
          name: 'fact',
          fields: [
            { name: 'topic', title: 'Topic', type: 'string', validation: (Rule: any) => Rule.required() },
            { name: 'answer', title: 'Answer', type: 'text', rows: 4, validation: (Rule: any) => Rule.required() },
          ],
          preview: { select: { title: 'topic', subtitle: 'answer' } },
        },
      ],
    },
    {
      name: 'rules',
      title: 'Extra instructions',
      type: 'text',
      rows: 4,
      description: 'Optional tone or behaviour rules, e.g. "Never quote a price, always suggest a call".',
    },
  ],
  preview: {
    prepare: () => ({ title: 'Ask Agent' }),
  },
}
