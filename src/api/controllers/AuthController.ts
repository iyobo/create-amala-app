import {Body, Context, Controller, Ctx, Post} from 'amala';
import {AuthLoginParams} from '../schemas/AuthLoginParams';


@Controller('/auth')
export class AuthController {


  @Post('/login')
  async login(
    @Ctx() ctx: Context,
    @Body({required: true}) input: AuthLoginParams) {

    //TODO: verify login. Create and return JWT. etc

    return {};

  }

}