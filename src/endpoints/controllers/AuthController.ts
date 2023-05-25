import {Body, Controller, Ctx, Post} from 'amala';
import {User} from '@backend/data/models/auth/User';
import {Context} from 'koa';
import {errorBadInput, errorNotFound, errorNotLoggedIn} from '@backend/util/errors';
import {thisEm} from '@backend/util/requestContext';
import {PasswordRecovery} from '@backend/data/models/auth/PasswordRecovery';
import {generateExpiryMilliseconds, isPasswordRecoveryExpired} from '@backend/util/crono';
import {generateHumanCode, jwtCreate, verifyPassword} from '@backend/util/crypto';
import {UserIdentity} from '@backend/data/models/auth/UserIdentity';
import config from '../../config/config';
import {AuthLoginParams} from '@common/types/transports/authTransports';
import {EAuthProvider} from '../../../../common/enums/authEnums';
import {notifications} from '@backend/services/notificationService';



@Controller('/auth')
export class AuthController {


  @Post('/login')
  async login(
    @Ctx() ctx: Context,
    @Body({required: true}) input: AuthLoginParams) {

    const {identity, password} = input;
    const em = thisEm();
    let email;

    // User identities are email and provider based. Ensure we have an email to begin login with
    if (identity.includes('@')) {
      email = identity;
    } else {
      // this is a username. Get user with username, then get email.
      const user = await em.findOne(User, {username: identity});
      if (!user) throw new errorNotLoggedIn('Invalid user credentials');
      email = user.email;
    }

    // Now we have email, Does local userIdentity of this email exist?
    const ui = await em.findOne(UserIdentity, {provider: EAuthProvider.LOCAL, email},['user']);
    if (!ui) throw new errorNotLoggedIn('Invalid user credentials');

    //verify the password
    if (!await verifyPassword(password, ui.password)) {
      throw new errorNotLoggedIn('Invalid user credentials');
    }

    // if we are here, all is well. Generate JWT and send back to user in secure cookie
    const jwtToken = await jwtCreate({userId: (ui.user as User).id});

    // Communicate token to client. Favor cookies instead
    ctx.set('Authorization',`Bearer ${jwtToken}`)
    ctx.cookies.set('jwtToken', jwtToken, config.security.cookies);

    return ui.user;

  }

  // @Post('/loginFacebook')
  // async loginFacebook(@Ctx() ctx: Context) {
  //
  //   const authenticatedUser: User = await new Promise((resolve, reject) => {
  //     passport.authenticate(EAuthProvider.FACEBOOK, function (err, user, info, status) {
  //       // console.log({err, user, info, status});
  //       if (err || info) reject(err || info);
  //       resolve(user);
  //     })(ctx);
  //   });
  //
  //   if (!authenticatedUser)
  //     throw errorNotLoggedIn('Invalid OAuth session');
  //
  //   await ctx.login(authenticatedUser);
  //   return {user: authenticatedUser, token: ctx.sessionId, expiry: null};
  //   // return {user: authenticatedUser, token: ctx.sessionId, expiry: config.session.maxAge};
  // }
  //
  // @Post('/loginGoogle')
  // async loginGoogle(@Ctx() ctx: Context) {
  //
  //   const authenticatedUser = await new Promise((resolve, reject) => {
  //     passport.authenticate(EAuthProvider.GOOGLE, function (err, user, info, status) {
  //       // console.log({err, user, info, status});
  //       if (err || info) reject(err || info);
  //       resolve(user);
  //     })(ctx);
  //   });
  //
  //   if (!authenticatedUser)
  //     throw errorNotLoggedIn('Invalid OAuth session');
  //
  //   await ctx.login(authenticatedUser);
  //   // return {user: authenticatedUser, token: ctx.sessionId, expiry: config.session.maxAge};
  //   return {user: authenticatedUser, token: ctx.sessionId, expiry: null};
  // }


  //obsolete. JWT logouts are client side affairs
  @Post('/logout')
  async logout(@Ctx() ctx: Context) {
    ctx.remove('Authorization')
    ctx.cookies.set('jwtToken', null, config.security.cookies);
    ctx.session = null;
  }

  @Post('/requestPasswordReset')
  async requestPasswordReset(@Body('email') email: string) {
    if (!email) throw errorBadInput('No email provided');

    const em = thisEm();

    const user = await em.findOne(User, {email});
    if (!user) throw errorNotFound('No such user exists'); //is user does not exist, fail.

    const pr = await em.create(PasswordRecovery, {
      email: user.email,
      user: user.id,
      resetCode: generateHumanCode(),
      expiresOn: generateExpiryMilliseconds()
    });

    await em.persistAndFlush([pr]);

    await notifications.user.passwordReset(user, pr);
  }

  @Post('/resetPassword')
  async resetPassword(
    @Body('email') email,
    @Body('resetCode') resetCode: string,
    @Body('newPassword') newPassword: string,
  ) {
    const error = errorNotFound('Not a valid resetCode');

    if (!email || !resetCode) throw error;

    const em = thisEm();

    const pr = await em.findOne(PasswordRecovery, {email, resetCode});
    if (!pr || isPasswordRecoveryExpired(pr)) throw errorBadInput('Incorrect entry');

    //reset this user's local password
    let localIdentity = await em.findOne(UserIdentity, {provider: 'local', user: pr.user});

    if (!localIdentity) {
      // It is possible that this user never logged in with a password and only logged in with social.
      // Create a local identity for this user.
      localIdentity = em.create(UserIdentity, {
        provider: 'local',
        user: pr.user,
        email,
        password: newPassword
      });

      em.persist(localIdentity);
    } else {
      localIdentity.password = newPassword;
    }

    // mark passwordRec as used
    pr.usedOn = new Date();

    await em.flush();

    return true;
  }

}