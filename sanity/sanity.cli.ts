import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'ydpqen8a',
    dataset: 'production',
  },
  deployment: {
    appId: 'inmoinh3ugtee7qbvfnza73d',
    autoUpdates: true,
  },
  /**
   * Enable auto-updates for studios.
   * Learn more at https://www.sanity.io/docs/cli#auto-updates
   */
})
