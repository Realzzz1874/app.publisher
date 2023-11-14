import { Context } from '@/core/koa';
import { sign } from '../utils/jwt';

import { loginSchema } from './auth.schema';
import { ResponseStatus } from '../types';

export default class AuthController {
  static async login(ctx: Context) {
    const body = ctx.request?.body;
    const { value, error } = loginSchema.validate(body);
    // 校验参数
    if (error) {
      ctx.error(error.message, ResponseStatus.INVALID_PARAMS);
    } else {
      const { username, password } = value;
      if (username == 'zhangsan' && password == 'zhangsan123') {
        const t = sign('1001');
        ctx.success(t);
      } else {
        ctx.error('用户名或密码不正确', ResponseStatus.BAD_REQUEST);
      }
    }
  }
}
