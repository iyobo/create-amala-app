import {launchAPI} from './endpoints/restApi';
import {initializeDatabase} from './data';
import config from './config/config';


console.log(`Starting application: ${config.appName}...`);

(async function () {
  try {
    await initializeDatabase();
    await launchAPI();
  }
  catch(err){
    console.error('[Launch Error] Could not start Service: ',err)
  }
})()

export {}