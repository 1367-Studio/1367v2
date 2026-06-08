import {defineCliConfig} from 'sanity/cli'
import {loadEnv} from 'vite'

const {PUBLIC_SANITY_PROJECT_ID} = loadEnv(process.env.NODE_ENV || 'development', process.cwd(), '')

export default defineCliConfig({
  api: {
    projectId: PUBLIC_SANITY_PROJECT_ID,
    dataset: 'production',
  },
  /**
   * Enable auto-updates for studios.
   * Learn more at https://www.sanity.io/docs/cli#auto-updates
   */
  autoUpdates: true,
})
