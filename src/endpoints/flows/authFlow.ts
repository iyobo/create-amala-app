/**
 * Created by iyobo on 2017-05-17.
 */


import {errorForbidden, errorNotFound, errorNotLoggedIn} from '../../util/errors';
import {jwtVerify} from '../../util/crypto';
import {thisEm} from '../../util/requestContext';
import {User} from '../../data/models/auth/User';
import {Org} from '@backend/data/models/org/Org';
import {OrgMember} from '@backend/data/models/org/OrgMember';

const jwt = require('koa-jwt');

/**
 * Determines if one can view the Jollof admin
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
export async function canViewAdmin(ctx, next) {

    if (ctx.isAuthenticated() && ctx.state.user.isAdmin) {
        await next();
    } else {
        //If user is not authorized to use admin, throw a misleading redirect to avoid hinting.
        //ctx.response.status = 401;
        throw errorForbidden('You do not have rights to do that', {
            // suggestion: 'login'
        });
    }

}

/**
 * Determines if one is logged In
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
export async function isLoggedIn (ctx, next) {
    const accessToken = ctx.request.accessToken || ctx.cookies.get('jwtToken');

    if (!accessToken) throw errorNotLoggedIn('Not logged in');

    const payload = await jwtVerify(accessToken);
    ctx.state.userId = payload.userId;
    const user = await thisEm().findOne(User, payload.userId);

    // This user has either been deleted or has changed it's ID. The former is more likely. This is also likely during initial dev stage.
    if (!user) {
        throw errorNotLoggedIn('Sorry your account cannot be found. Login again or create a new account.');
    }

    ctx.state.user = user;
    await next();
}



