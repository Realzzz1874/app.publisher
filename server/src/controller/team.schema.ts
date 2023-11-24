import * as Joi from 'joi';
import { ROLES } from '../enum';

// 创建
export const createTeamSchema = Joi.object({
  name: Joi.string().min(1).max(10).required(),
});

// 修改名称
export const UpdateNameSchema = Joi.object({
  name: Joi.string().min(1).max(10).required(),
  teamId: Joi.string().required(),
});

// 修改角色
export const UserRoleSchema = Joi.object({
  role: Joi.string().valid(ROLES.manager, ROLES.guest).required(),
});

// 将某用户加入团队
export const AddUserSchema = Joi.object({
  role: Joi.string().valid(ROLES.manager, ROLES.guest).required(),
  memberId: Joi.string().required(),
});
