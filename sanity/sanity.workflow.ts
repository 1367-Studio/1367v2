import {existsSync} from 'node:fs'

import {defineWorkflowConfig} from '@sanity/workflow-engine/define'

import {articleReview} from './workflows/article-review'

// The workflow CLI doesn't load .env files on its own
if (existsSync('.env')) process.loadEnvFile('.env')

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.PUBLIC_SANITY_DATASET
if (!projectId || !dataset) {
  throw new Error('Set PUBLIC_SANITY_PROJECT_ID and PUBLIC_SANITY_DATASET in sanity/.env')
}

export default defineWorkflowConfig({
  deployments: [
    {
      name: 'dev',
      tag: 'dev',
      expectedMinReaderModel: 10,
      workflowResource: {type: 'dataset', id: `${projectId}.${dataset}`},
      definitions: [articleReview],
    },
  ],
})
