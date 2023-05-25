'use strict';
import config from '../config/config';
import jwt from 'jsonwebtoken';
import {errorNotLoggedIn} from './errors';

const argon2 = require('argon2');
const Chance = require('chance');
export const chance = new Chance();

export async function hashPassword(plain): Promise<string> {
    if (!plain) return null;
    return argon2.hash(plain);
}

export async function verifyPassword(plain, hash): Promise<boolean> {
    if (!plain) return false;

    return argon2.verify(hash, plain);
}


export async function jwtCreate(payload): Promise<any> {
    if (!payload) return false;

    return jwt.sign(payload, config.security.keys[0], {expiresIn: Math.floor(Date.now() / 1000) + (60 * 60)});
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


export const generateHumanCode = (): string => chance.string({length: 7, casing: 'lower', alpha: false, numeric: true});

