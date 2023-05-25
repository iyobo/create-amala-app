import {bootstrapControllers, getControllers} from 'amala';
import {requestContextFlow} from '../util/requestContext';
import config from '../config/lib/config';

import jwt from 'koa-jwt';
import * as process from 'process';

const bearerToken = require('koa-bearer-token');

export async function launchAPI() {
  console.log('Launching Rest API...');

  const {app, router} = await bootstrapControllers({
    basePath: '/api',
    controllers: [
      __dirname + '/controllers/**/*',
    ], // It is recommended to add controllers as classes directly to this array, but you can also add glob path strings
    disableVersioning: true,
    validatorOptions: {
      whitelist: true,
      forbidNonWhitelisted: true
    },
    flow: [
      requestContextFlow,
      bearerToken({reqKey: 'accessToken'}),
      jwt({secret: config.security.keys, passthrough: true, key: 'jwtData'})
    ],
    openAPI:{
      enabled: true,
      publicURL: process.env.BASE_API_URL,
      spec:{
        info:{
          title: config.appName,
          version: '1'
        }
      }
    },
    attachRoutes: true,
    diagnostics: config.devMode,
    useHelmet: true,
  });


  app.keys = config.security.keys;
  app.proxy = true;

  console.log('Number of API controllers:', Object.keys(getControllers()).length);

  const port = config.server.port;
  app.listen(port);

  console.log(`API running on port ${port}!`);
}