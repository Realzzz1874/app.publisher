import * as Joi from 'joi';

// 创建
export const createTeamSchema = Joi.object({
  name: Joi.string().min(1).max(10).required(),
});

// 修改名称
export const UpdateNameSchema = Joi.object({
  name: Joi.string().min(1).max(10).required(),
  teamId: Joi.string().required(),
});
