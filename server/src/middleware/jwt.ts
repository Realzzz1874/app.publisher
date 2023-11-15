import * as Koa from 'koa';
import { Context } from '@/core/koa';
import * as jwt from 'jsonwebtoken';
import { ResponseStatus } from '../types';
import { verify } from '../utils/jwt';

// token 携带的信息
interface User {
  userId: string;
}

const jwtMiddleware = async (ctx: Context, next: Koa.Next) => {
  try {
    const token = ctx.header.authorization?.split(' ')[1];
    if (!token) {
      return ctx.error('', ResponseStatus.UN_AUTH);
    }
    const decoded = verify(token) as User;
    ctx.state.userId = decoded.userId;
    await next();
  } catch {
    return ctx.error('', ResponseStatus.UN_AUTH);
  }
};
export default jwtMiddleware;
