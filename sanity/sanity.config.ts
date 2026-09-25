import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {assist} from '@sanity/assist'
import {workflowDefaultDocumentNode, workflowStudioPlugin} from '@sanity/workflow-studio-plugin'
import {schemaTypes} from './schemaTypes'
import deskStructure from './deskStructure'

export default defineConfig({
  name: 'default',
  title: '1367-v2',
  projectId: 'ydpqen8a',
  dataset: 'production',
  plugins: [
    structureTool({
      structure: deskStructure,
      defaultDocumentNode: workflowDefaultDocumentNode(),
    }),
    visionTool(),
    assist(),
    workflowStudioPlugin({
      tag: 'dev', // must match the tag in sanity.workflow.ts
      mappings: [{docType: 'post', definition: 'article-review', label: 'Article review'}],
    }),
  ],
  schema: {
    types: schemaTypes,
  },
})
