import * as Joi from 'joi';

export const loginSchema = Joi.object({
  username: Joi.string().alphanum().min(1).max(10).required(),
  password: Joi.string().pattern(/^[\S]{6,12}$/),
});
