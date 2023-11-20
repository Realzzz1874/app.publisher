import { Context } from '@/core/koa';

import { createTeamSchema, UpdateNameSchema } from './team.schema';
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
}
