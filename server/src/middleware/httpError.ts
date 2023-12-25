import * as Koa from 'koa';
import { Context } from '@/core/koa';
import HttpError from '../interface/HttpError';
import { ResponseStatus } from '../types';

const HttpErrorMiddleware = async (ctx: Context, next: Koa.Next) => {
  try {
    await next();
  } catch (error) {
    if (error instanceof HttpError) {
      ctx.error(error.message, error.status);
    } else {
      ctx.error('SYSTEM ERROR', ResponseStatus.SYSTEM_ERROR);
    }
  }
};

export default HttpErrorMiddleware;
