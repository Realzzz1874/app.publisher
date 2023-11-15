import { Context } from '@/core/koa';
import * as bcrypt from 'bcrypt';
import { sign } from '../utils/jwt';

import { loginSchema } from './auth.schema';
import { ResponseStatus } from '../types';
import UserService from '../service/user';

export default class AuthController {
  static async login(ctx: Context) {
    const body = ctx.request?.body;
    const { value, error } = loginSchema.validate(body);
    // 校验参数
    if (error) {
      ctx.error(error.message, ResponseStatus.INVALID_PARAMS);
    } else {
      const { username, password } = value;
      const user = await UserService.getUser(username as string);
      console.log('user', user);

      if (user) {
        const val = await bcrypt.compare(password as string, user.password);
        if (val) {
          const t = sign(user._id);
          ctx.success(t);
        } else {
          ctx.error('用户名或密码不正确', ResponseStatus.BAD_REQUEST);
        }
      } else {
        ctx.error('用户名或密码不正确', ResponseStatus.BAD_REQUEST);
      }
    }
  }
}
