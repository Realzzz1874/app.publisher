import * as jwt from 'jsonwebtoken';
import config from '../config/index';
import HttpError from '../interface/HttpError';
import { ResponseStatus } from '../types';
const JWT_SECRET = config.JWT_SECRET || 'app.publisher';
const JWT_EXP_TIME = config.JWT_EXP_TIME || 7 * 24 * 60 * 60;
export const verify = (token: string) => {
  try {
    const res = jwt.verify(token, JWT_SECRET) as { userId: string };
    return res;
  } catch {
    throw new HttpError(ResponseStatus.UN_AUTH, '');
  }
};

export const sign = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: JWT_EXP_TIME,
  });
};
