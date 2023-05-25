import { Context, Controller, Ctx, Get } from 'amala'

@Controller('/hello')
export class HelloController {
  @Get('/')
  async index(@Ctx() ctx: Context) {
    return { foo: 'bar' }
  }
}
