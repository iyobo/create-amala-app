import { launchAPI } from './api/api'
import { initializeDatabase } from './data/data'
import config from './config/lib/config'

console.log(`Starting application: ${config.appName}...`)
;(async function () {
  try {
    await initializeDatabase()
    await launchAPI()
  } catch (err) {
    console.error('[Launch Error] Could not start Service: ', err)
  }
})()

export {}
