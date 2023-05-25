'use strict';
import config from '../config/lib/config';
import jwt from 'jsonwebtoken';
import { errorNotLoggedIn } from 'amala/dist/util/errors';

import Chance from 'chance';
import KSUID from 'ksuid';

export const chance = new Chance();

export async function jwtCreate(payload): Promise<any> {
  if (!payload) return false;

  return jwt.sign(payload, config.security.keys[0], {
    expiresIn: Math.floor(Date.now() / 1000) + 60 * 60
  });
}

export async function jwtVerify(signedJWT): Promise<any> {
  if (!signedJWT) return false;

  return new Promise((resolve, reject) => {
    jwt.verify(signedJWT, config.security.keys[0], (err, payload) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          reject(errorNotLoggedIn(`Token expired: ${err.message}`));
        } else if (err.name === 'JsonWebTokenError') {
          reject(errorNotLoggedIn(`Auth Token is Malformed: ${err.message}`));
        } else {
          reject(errorNotLoggedIn(`${err.message}`));
        }
      } else {
        resolve(payload);
      }
    });
  });
}

export const generateId = (): string => {
  const ksuidFromSync = KSUID.randomSync();
  return ksuidFromSync.string;
};
