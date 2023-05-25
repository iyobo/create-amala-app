import {errors} from 'amala';


/**
 * Determines if the request is authenticated. Incomplete. Implement this for your app
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
export async function isLoggedIn (ctx, next) {
    const accessToken = ctx.request.accessToken || ctx.request.bearer;

    // if (!accessToken) throw errors.unauthorized('Invalid auth token');

    //TODO: validate the token

    await next();
}



