import { Context } from '@/core/koa';
import UserService from '../service/user';
import { ResponseStatus } from '../types';

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
}
