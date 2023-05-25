import {orm} from '../data';
import {v4} from 'uuid';
import {EntityManager} from '@mikro-orm/core';

const {AsyncLocalStorage} = require("async_hooks");
export const requestContext = new AsyncLocalStorage();

export const requestContextFlow = async (ctx, next) => {
  await requestContext.run(new Map(), async () => {
    const store = requestContext.getStore();
    store.set("requestId", v4());
    store.set("em", orm.em.fork());
    await next();
  });
};

export function thisRequest(property: 'requestId' | 'em'): any {
  const store = requestContext.getStore() as Map<string, any>;
  return store?.get(property);
}

/**
 * Returns the current data entityManager if called within a request, or forks a new one adhoc.
 */
export function thisEm(): EntityManager {
  const store = requestContext.getStore() as Map<string, any>;
  if (store) {
    return store?.get('em');
  } else {
    return orm.em.fork();
  }
}

