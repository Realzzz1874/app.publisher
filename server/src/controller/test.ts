import { Context } from '@/core/koa';
import { sign } from '../utils/jwt';
export default class TestController {
  static async testGet(ctx: Context) {
    ctx.success('test done');
  }

  static async testPost(ctx: Context) {
    const params = ctx.request.body;
    // const t = sign('123454321');
    // console.log('t', t);
    // ctx.success(t);

    console.log('testPost ====>', params);
    ctx.success(params);
  }
}
