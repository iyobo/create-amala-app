// import {verifyPassword} from '../crypto';
//
// import {promisify} from 'util';
// import {errorInternal} from '../errors';
// import {User} from '../../data/models/auth/User';
// import {UserIdentity} from '../../data/models/auth/UserIdentity';
// import {thisEm} from '../requestContext';
// import authMessagingActions from '../../services/notifications/UserNotifications';
// import config from '../../config/config';
// import {EAuthProvider} from '../../../../common/enums/authEnums';
//
//
// const passport = require('koa-passport');
// const JwtStrategy = require('passport-jwt').Strategy,
//   ExtractJwt = require('passport-jwt').ExtractJwt;
//
// const FacebookTokenStrategy = require('passport-facebook-token');
// const GoogleTokenStrategy = require('passport-token-google').Strategy;
//
// /**
//  * This function is called from internal jollof. It sets up the app with Authentication strategies.
//  * Jollof comes with Passport, though you could effectually ignore passport and end up using whatever you want.
//  *
//  * Passport is an express plugin with over 300 different authentication strategies! It might look unwieldy due to
//  * the fact that it was built with legacy ES5 in mine, but it's well worth it to understand it and build apps with
//  * unlimited connectivity!
//  *
//  * Users today expect to login to your app with Google, Facebook, Twitter, etc and will easily move on if
//  * you do not provide the options to.
//  *
//  * This App scaffold makes it easy. Just get the keys from these social sites and replace them in configs.
//  *
//  * @param passport - the passport instance
//  */
// export const setupAuthStrategies = () => {
//     passport.serializeUser(function (user, done) {
//         done(null, user.id);
//     });
//
//     /**
//      * passport uses this to convert a userId into a user object
//      */
//     passport.deserializeUser(async function (id, done) {
//         try {
//             const em = thisEm();
//             const user = await em.findOne(User, id);
//             if (!user) {
//                 throw new Error('user record does not exist. Was it deleted while the user session was active?');
//             }
//             done(null, user);
//         } catch (err) {
//             done(err);
//         }
//     });
//
//     /**
//      * The Passport Local Strategy covers checking username and password against a datasource.
//      */
//     const LocalStrategy = require('passport-local').Strategy;
//     passport.use(EAuthProvider.LOCAL, new LocalStrategy({
//           usernameField: 'email',
//           passwordField: 'password',
//           session: false
//       },
//       async function (email, password, done) {
//
//           // This user object uses Email as username.
//           try {
//               const em = thisEm();
//               const identity = await em.findOne(UserIdentity, {email, provider: EAuthProvider.LOCAL}, ['user']);
//
//               if (identity && identity.user && await verifyPassword(password, identity.password)) {
//                   done(null, identity.user);
//               } else {
//                   done(null, null);
//               }
//           } catch (err) {
//               done(err);
//           }
//       })
//     );
//
//
//     const jwtOptions = {
//         jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//         secretOrKey: config.security.keys[0],
//         // issuer: config.security.issuer,
//         // audience: config.security.issuer
//     };
//
//     passport.use('jwt', new JwtStrategy(jwtOptions, async function (jwt_payload, done) {
//         const em = thisEm();
//
//         const user = await em.findOne(User, jwt_payload.sub);
//         if (user) {
//             return done(null, user);
//         } else {
//             return done(null, false);
//             // or you could create a new account
//         }
//     }));
//
//
//     /**
//      * Here are some other strategies you can activate.
//      */
//     passport.use(EAuthProvider.FACEBOOK, new FacebookTokenStrategy(config.auth.facebook,
//       async function (accessToken, refreshToken, profile, done) {
//           try {
//               await socialAuthenticate(EAuthProvider.FACEBOOK, accessToken, profile, done);
//           } catch (err) {
//               done(err);
//           }
//       }
//     ));
//
//     passport.use(EAuthProvider.GOOGLE, new GoogleTokenStrategy(config.auth.google,
//       async function (accessToken, refreshToken, profile, done) {
//           try {
//               await socialAuthenticate(EAuthProvider.GOOGLE, accessToken, profile, done);
//           } catch (err) {
//               done(err);
//           }
//       }
//     ));
//
// };
//
//
// async function socialAuthenticate(provider: EAuthProvider, accessToken: string, profile: any, done: (error: Error, userId?: User) => void) {
//     try {
//         const email = profile.emails[0].value;
//
//         // Search for Facebook user identity
//         const em = thisEm();
//         const userIdentity = await em.findOne(UserIdentity, {email, provider}, ['user']);
//         if (userIdentity) {
//             // login
//             userIdentity.accessToken = accessToken;
//
//             if (!userIdentity.user) throw errorInternal(`userIdentity ${userIdentity.id} exists but associated user ${userIdentity?.user} does not exist`);
//
//             if (profile.photos && profile.photos.length > 0) {
//                 (userIdentity.user as User).picture = profile.photos[0].value;
//             }
//
//             await em.flush();
//
//             done(null, userIdentity.user as User);
//         } else {
//             // social useridentity does not exist.
//
//             // ...but does this user exist somehow?
//             const userIdentity = await em.findOne(UserIdentity, {email, provider: 'local'}, ['user']);
//             const user = userIdentity.user as User;
//             const userIdentityRepo = em.getRepository(UserIdentity);
//
//             if (userIdentity && user) {
//                 // if they do, then hoorah this is the case of a pre-existing user choosing to tie their social identity to their account!
//
//                 const newSocialUserIdentity = userIdentityRepo.create({
//                     email,
//                     provider,
//                     userId: user.id,
//                     profileId: profile.id,
//                     accessToken: accessToken,
//                 });
//
//                 await em.persistAndFlush(newSocialUserIdentity);
//                 done(null, user);
//             } else {
//                 // This is a totally new person signing up via socials
//                 const userRepo = em.getRepository(User);
//
//                 const newUser = userRepo.create({
//                     firstName: profile.name.givenName,
//                     lastName: profile.name.familyName,
//                     email: email,
//                     isAdmin: false
//                 });
//
//                 const newSocialUserIdentity = userIdentityRepo.create({
//                     email,
//                     provider,
//                     userId: newUser.id,
//                     profileId: profile.id,
//                     accessToken: accessToken,
//                 });
//
//                 // Create User and Identity
//                 await em.persistAndFlush([newUser, newSocialUserIdentity]);
//
//                 // notify
//                 await authMessagingActions(newUser);
//
//                 done(null, newUser);
//             }
//         }
//     } catch (error) {
//         done(error);
//     }
// }
//
// export const authenticate = promisify(passport.authenticate);
