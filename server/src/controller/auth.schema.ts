import * as Joi from 'joi';

// 登录
export const loginSchema = Joi.object({
  username: Joi.string().alphanum().min(1).max(10).required(),
  password: Joi.string().pattern(/^[\S]{6,12}$/),
});

// 注册
export const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(1).max(10).required(),
  password: Joi.string().pattern(/^[\S]{6,12}$/),
  email: Joi.string().email().required(),
});

// 修改密码
export const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().pattern(/^[\S]{6,12}$/),
  newPassword: Joi.string().pattern(/^[\S]{6,12}$/),
});
