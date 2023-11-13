import * as Koa from 'koa';
import { Context } from '@/core/koa';
import * as jwt from 'jsonwebtoken';
import { ErrorResponseCode } from '../types';
import { verify } from '../utils/jwt';

const jwtMiddleware = async (ctx: Context, next: Koa.Next) => {
  try {
    const token = ctx.header.authorization?.split(' ')[1];
    if (!token) {
      return ctx.error('', ErrorResponseCode.UN_AUTH);
    }
    const decoded = verify(token) as { userId: string };
    ctx.state.userId = decoded.userId;
    await next();
  } catch {
    return ctx.error('', ErrorResponseCode.UN_AUTH);
  }
};
export default jwtMiddleware;
