import { JWT_SECRET, JWT_EXP_TIME } from '../constant';
import * as jwt from 'jsonwebtoken';

export const verify = (token: string) => {
  return jwt.verify(token, JWT_SECRET) as { userId: string };
};

export const sign = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXP_TIME });
};
