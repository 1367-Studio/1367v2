import {
  defineAction,
  defineActivity,
  defineField,
  defineStage,
  defineTransition,
  defineWorkflow,
} from '@sanity/workflow-engine/define'
export const articleReview = defineWorkflow({
  name: 'article-review',
  title: 'Article review',
  description: 'Takes one article from drafting, through an editor review, to approved.',
  initialStage: 'drafting',
  fields: [
    defineField({
      type: 'subject',
      name: 'subject',
      title: 'Article',
      required: true,
      description: 'The document this instance moves through the stages.',
      initialValue: {type: 'input'},
    }),
  ],
  stages: [
    defineStage({
      name: 'drafting',
      title: 'Drafting',
      description: 'The writer is working on the article.',
      activities: [
        defineActivity({
          name: 'write',
          title: 'Write the article',
          actions: [
            defineAction({
              name: 'submit',
              title: 'Submit for review',
              status: 'done',
            }),
          ],
        }),
      ],
      transitions: [defineTransition({name: 'to-review', title: 'Send to review', to: 'review'})],
    }),
    defineStage({
      name: 'review',
      title: 'Editorial review',
      description: 'An editor reads the article and approves it.',
      activities: [
        defineActivity({
          name: 'sign-off',
          title: 'Review the article',
          actions: [
            defineAction({
              name: 'approve',
              title: 'Approve',
              status: 'done',
            }),
          ],
        }),
      ],
      transitions: [
        defineTransition({name: 'to-approved', title: 'Approve and finish', to: 'approved'}),
      ],
    }),
    defineStage({
      name: 'approved',
      title: 'Approved',
      description: 'The article is approved. Nothing more to do here.',
    }),
  ],
})