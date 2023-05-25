import * as dotenv from 'dotenv';
/**
 * Nested config system.
 * All env files must use commonjs for exports i.e module.exports
 */
import {IConfig} from './configTypes';

dotenv.config({path: './.env'});

import _ from 'lodash';
import Fs from 'fs';

const Path = require('path');

// load base config
const config: IConfig = require('../default.env');
const nodeEnv = process.env.NODE_ENV;

// Attempt to merge with nodeEnv config if exist
try {

  let envFilePath = Path.join(__dirname, nodeEnv + '.env.js');
  let envFileExists = Fs.existsSync(envFilePath);

  // check for .ts variant of config file
  if (!envFileExists) {
    envFilePath = Path.join(__dirname, nodeEnv + '.env.ts');
    envFileExists = Fs.existsSync(envFilePath);
  }

  if (!envFileExists) {
    console.warn(`[Environment Config] No js/ts config file found for env=${nodeEnv}. Using default.env`);
  } else {
    const envModulePath = `./${nodeEnv}.env`;
    const envConfig = require(envModulePath);
    _.merge(config, envConfig);

    console.log('[Environment Config Success]', process.env.NODE_ENV, 'env settings loaded.');
  }

} catch (err) {
  console.error('[Environment Config Fail]', err);
  console.error('[Environment Config Fail]', process.env.NODE_ENV, 'env not loaded. Defaulting to default.env config');
}
// console.log(config);

export default config;
