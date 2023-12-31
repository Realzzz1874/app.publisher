import { Context } from '@/core/koa';
import * as bcrypt from 'bcrypt';
import { sign } from '../utils/jwt';
import config from '../config/index';

import { loginSchema, registerSchema } from './auth.schema';
import { ResponseStatus } from '../types';
import UserService from '../service/user';
import { IUser } from '../interface/user';

export default class AuthController {
  static async login(ctx: Context) {
    const body = ctx.request?.body;
    const { value, error } = loginSchema.validate(body);
    // 校验参数
    if (error) {
      ctx.error(error.message, ResponseStatus.INVALID_PARAMS);
    } else {
      const { username, password } = value;
      const user = await UserService.getUserByUsername(username as string);
      if (user) {
        const val = await bcrypt.compare(password as string, user.password);
        if (val) {
          const t = sign(user._id);
          const u: IUser.MyInfo = {
            user: {
              username: user.username,
              email: user.email,
              _id: user._id,
            },
            teams: user.teams,
          };
          ctx.success({ token: t, ...u });
        } else {
          ctx.error('用户名或密码不正确', ResponseStatus.BAD_REQUEST);
        }
      } else {
        ctx.error('用户名或密码不正确', ResponseStatus.BAD_REQUEST);
      }
    }
  }

  static async register(ctx: Context) {
    if (!Number(config.ALLOW_REGISTER)) {
      return ctx.error('禁止注册', ResponseStatus.BAD_REQUEST);
    }
    const body = ctx.request?.body;
    const { value, error } = registerSchema.validate(body);
    if (error) {
      ctx.error(error.message, ResponseStatus.INVALID_PARAMS);
    } else {
      const { username, password, email } = value;
      const user = await UserService.getUserByUsername(username as string);
      if (!user) {
        const bcryptPassword = await bcrypt.hash(password, 10);
        const user = await UserService.registerUser(
          username,
          bcryptPassword,
          email
        );
        const t = sign(user._id);
        const u: IUser.BaseUser = {
          user: {
            username: user.username,
            email: user.email,
            _id: user._id,
          },
        };
        ctx.success({ token: t, ...u });
      } else {
        ctx.error(`${username} 已被使用`, ResponseStatus.BAD_REQUEST);
      }
    }
  }
}
