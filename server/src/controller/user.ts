import { Context } from '@/core/koa';
import UserService from '../service/user';
import { ResponseStatus } from '../types';
import { changePasswordSchema } from './auth.schema';
import { updateUsernameSchema } from './user.schema';
import * as bcrypt from 'bcrypt';

export default class UserController {
  // 获取用户详情
  static async getUserByUserId(ctx: Context) {
    const userId = ctx.userId;
    const user = await UserService.getUserByUserId(userId);
    if (user) {
      ctx.success(user);
    } else {
      ctx.error('用户不存在', ResponseStatus.BAD_REQUEST);
    }
  }

  // 修改密码
  static async changePassword(ctx: Context) {
    const body = ctx.request.body;
    const { value, error } = changePasswordSchema.validate(body);
    if (error) {
      ctx.error(error.message, ResponseStatus.INVALID_PARAMS);
    } else {
      const { oldPassword, newPassword } = value;
      const userId = ctx.userId;
      const user = await UserService.getUserByUserId(userId);
      if (user) {
        const val = await bcrypt.compare(oldPassword as string, user.password);
        if (val) {
          const p = await bcrypt.hash(newPassword, 10);
          const res = await UserService.changePassword(userId, p);
          res ? ctx.success(true) : ctx.error('', ResponseStatus.BAD_REQUEST);
        } else {
          ctx.error('原密码不正确', ResponseStatus.BAD_REQUEST);
        }
      } else {
        ctx.error('用户不存在', ResponseStatus.BAD_REQUEST);
      }
    }
  }

  static async updateUsername(ctx: Context) {
    const body = ctx.request.body;
    const { value, error } = updateUsernameSchema.validate(body);
    if (error) {
      ctx.error(error.message, ResponseStatus.INVALID_PARAMS);
    } else {
      const { username } = value;
      const user = await UserService.getUserByUsername(username as string);
      if (user) {
        ctx.error('用户已存在', ResponseStatus.BAD_REQUEST);
      } else {
        const userId = ctx.userId;
        const res = await UserService.updateUsername(userId, username);
        res ? ctx.success(true) : ctx.error('', ResponseStatus.BAD_REQUEST);
      }
    }
  }

  // 模糊查询用户 [username | email]
  static async findUsers(ctx: Context) {
    const query = ctx.request.query;
    if (query.keyword) {
      const users = await UserService.findUser(query.keyword as string);
      if (users.length) {
        const arr = users.map((u) => {
          return {
            _id: u._id,
            username: u.username,
            email: u.email,
          };
        });
        ctx.success(arr);
      } else {
        ctx.success([]);
      }
    } else {
      ctx.error('', ResponseStatus.INVALID_PARAMS);
    }
  }
}
