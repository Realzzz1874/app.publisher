import { Context } from '@/core/koa';

import {
  createTeamSchema,
  UpdateNameSchema,
  UserRoleSchema,
  AddUserSchema,
} from './team.schema';
import { ResponseStatus } from '../types';
import TeamService from '../service/team';

export default class TeamController {
  // 创建团队
  static async createTeam(ctx: Context) {
    const body = ctx.request.body;
    const { value, error } = createTeamSchema.validate(body);
    if (error) {
      ctx.error(error.message, ResponseStatus.INVALID_PARAMS);
    } else {
      const { name } = value;
      const team = await TeamService.createTeam(name, ctx.userId);
      team ? ctx.success(team._id) : ctx.error('SYSTEM ERROR');
    }
  }

  // 修改团队名称
  static async updateTeamName(ctx: Context) {
    const body = ctx.request.body;
    const { value, error } = UpdateNameSchema.validate(body);
    if (error) {
      ctx.error(error.message, ResponseStatus.INVALID_PARAMS);
    } else {
      const { name, teamId } = value;
      const team = await TeamService.updateTeamName(teamId, name, ctx.userId);
      team ? ctx.success(team._id) : ctx.error('SYSTEM ERROR');
    }
  }

  // 获取团队详情
  static async getTeamById(ctx: Context) {
    const { teamId } = ctx.params;
    if (!teamId) {
      ctx.error('', ResponseStatus.INVALID_PARAMS);
    } else {
      const team = await TeamService.getTeamById(teamId);
      team ? ctx.success(team) : ctx.error('', ResponseStatus.BAD_REQUEST);
    }
  }

  // 解散团队
  static async dissolveTeam(ctx: Context) {
    const { teamId } = ctx.params;
    if (!teamId) {
      ctx.error('', ResponseStatus.INVALID_PARAMS);
    } else {
      const userId = ctx.userId;
      const f = await TeamService.dissolveTeam(userId, teamId);
      f ? ctx.success(f) : ctx.error('', ResponseStatus.BAD_REQUEST);
    }
  }

  // 移除成员
  static async removeUser(ctx: Context) {
    const { teamId, removeUserId } = ctx.params;
    if (!teamId || !removeUserId) {
      ctx.error('', ResponseStatus.INVALID_PARAMS);
    } else {
      const userId = ctx.userId;
      const f = await TeamService.removeMember(userId, teamId, removeUserId);
      f ? ctx.success(f) : ctx.error('移除失败', ResponseStatus.BAD_REQUEST);
    }
  }

  // 修改成员角色
  static async changeRole(ctx: Context) {
    const { teamId, roleId } = ctx.params;
    if (!teamId || !roleId) {
      ctx.error('', ResponseStatus.INVALID_PARAMS);
    } else {
      const body = ctx.request.body;
      const { value, error } = UserRoleSchema.validate(body);
      if (error) {
        ctx.error('角色不合规', ResponseStatus.INVALID_PARAMS);
      } else {
        const { role } = value;
        const userId = ctx.userId;
        const f = await TeamService.changeRole(userId, teamId, roleId, role);
        f ? ctx.success(f) : ctx.error('修改失败', ResponseStatus.BAD_REQUEST);
      }
    }
  }

  // 将某用户加入团队
  static async addMember(ctx: Context) {
    const { teamId } = ctx.params;
    if (!teamId) {
      ctx.error('', ResponseStatus.INVALID_PARAMS);
    } else {
      const body = ctx.request.body;
      const { value, error } = AddUserSchema.validate(body);
      if (error) {
        ctx.error('', ResponseStatus.INVALID_PARAMS);
      } else {
        const { role, memberId } = value;
        const userId = ctx.userId;
        const f = await TeamService.addMember(userId, teamId, memberId, role);
        f ? ctx.success(f) : ctx.error('添加失败', ResponseStatus.BAD_REQUEST);
      }
    }
  }
}
