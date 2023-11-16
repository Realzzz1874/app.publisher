import * as Koa from 'koa';
import { Context } from '@/core/koa';
import { ResponseStatus } from '../types';
import { verify } from '../utils/jwt';

// token 携带的信息
interface User {
  userId: string;
}

const jwtMiddleware = async (ctx: Context, next: Koa.Next) => {
  const token = ctx.header.authorization?.split(' ')[1];
  if (!token) {
    return ctx.error('', ResponseStatus.UN_AUTH);
  }
  const decoded = verify(token) as User;
  ctx.userId = decoded.userId;
  await next();
};
export default jwtMiddleware;
