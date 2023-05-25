import {bootstrapControllers, getControllers} from 'amala';
import {requestContextFlow} from '../util/requestContext';
import config from '../config/config';
import koaHelmet from 'koa-helmet';

const bearerToken = require('koa-bearer-token')

const jwt = require('koa-jwt');

export async function launchAPI() {
  console.log('Launching Rest API...');

  const {app, router} = await bootstrapControllers({
    basePath: '/api',
    controllers: [
      __dirname + '/controllers/**/*',
      // UserController,
      // AuthController,
      // OrgController
    ], // It is recommended to add controllers classes directly to this array, but you can also add glob strings
    disableVersioning: true,
    validatorOptions: {
      whitelist: true,
      forbidNonWhitelisted: true
    },
    flow: [
      koaHelmet(),
      requestContextFlow,
      bearerToken({reqKey: 'accessToken'}),
      jwt({secret: config.security.keys, passthrough: true, key: 'jwtData'})
    ],
    enableOpenApi: true,
    openApiInfo: {
      title: config.appName,
      version: '1'
    },
    openApiPath: '/api/docs',
    attachRoutes: true,
    diagnostics: config.devMode
  });

  // Allow for secure cookie transmission over unsecure channels.
  // Make sure this server is running behind a proxy or load balancer and not exposed to the whole internet.
  app.keys = config.security.keys;
  app.proxy = true;

  console.log('Number of API controllers:', Object.keys(getControllers()).length);

  // authentication

  // setupAuthStrategies();
  //
  // app.use(router.routes());
  // app.use(router.allowedMethods());

  // https://mikro-orm.io/docs/installation#request-context
  // app.use((ctx, next) => RequestContext.createAsync(orm.em, next));

  const port = config.server.port;
  app.listen(port);

  console.log(`API running on port ${port}!`);
}