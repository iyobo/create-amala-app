import {Body, Controller, CurrentUser, Flow, Get, Params, Post, Put} from 'amala';
import {EAuthProvider} from '../../../../common/enums/authEnums';
import {User} from '@backend/data/models/auth/User';
import {thisEm} from '@backend/util/requestContext';
import {UserIdentity} from '@backend/data/models/auth/UserIdentity';
import {hashPassword} from '@backend/util/crypto';
import {UpdateUserParams, UserSignupParams} from '@common/types/transports/userTransports';
import {isLoggedIn} from '../flows/authFlow';
import {errorBadRequest} from '@backend/util/errors';
import {notifications} from '@backend/services/notificationService';


@Controller('/user')
export class UserController {

  @Get('/me')
  @Flow(isLoggedIn)
  async me(@CurrentUser() user: User): Promise<User> {
    return user;
  }

  @Get('/')
  @Flow(isLoggedIn)
  async getUsers(): Promise<User[]> {
    return await thisEm().find(User, {});
  }

  @Post('/')
  async createLocalUser(@Body({required: true}) input: UserSignupParams) {
    const em = thisEm();

    const existingUser = await em.findOne(User, {email: input.email});
    if (existingUser) throw errorBadRequest('A user with that email already exists');

    const user = new User({
      firstName: input.firstName,
      lastName: input.lastName,
      username: input.username,
      email: input.email,
      phone: input.phone
    });

    const userIdentity = new UserIdentity({
      password: await hashPassword(input.password),
      email: input.email,
      provider: EAuthProvider.LOCAL,
      user: user.id
    })

    await em.persistAndFlush([user, userIdentity]);

    // don't wait for email send. It's not crucial
    notifications.user.newUser(user)
    return user;
  }

  @Get('/:userId')
  @Flow(isLoggedIn)
  async getUser(@Params('userId') userId: string): Promise<User> {
    const em = thisEm();

    return em.findOne(User,{id: userId});
  }

  @Put('/:userId')
  @Flow(isLoggedIn)
  async updateUser(@Params('userId') userId: string, @Body() body: UpdateUserParams): Promise<User> {
    const em = thisEm();
    const users = em.getRepository(User);

    await users.nativeUpdate({id: userId}, body);
    return this.getUser(userId);
  }

}