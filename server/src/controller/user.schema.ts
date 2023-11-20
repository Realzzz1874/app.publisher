import * as Joi from 'joi';

// 修改用户名
export const updateUsernameSchema = Joi.object({
  username: Joi.string().alphanum().min(1).max(10).required(),
});
