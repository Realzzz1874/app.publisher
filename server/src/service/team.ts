import TeamModel from '../model/team';
import UserModel from '../model/user';
import mongoose from '../database/mongodb';
import HttpError from '../interface/HttpError';
import { ResponseStatus } from '../types';

export default class TeamService {
  // 获取 user 在 team 中的角色
  static async getUserTeamRole(userId: string, teamId: string) {
    const team = await TeamModel.findById(teamId);
    let role = '';
    if (!team) return { role };
    const members = team.members;
    members.forEach((m) => {
      if (m._id == userId) {
        role = m.role;
      }
    });
    return { role, team };
  }
  // 创建团队
  static async createTeam(name: string, creatorId: string) {
    const user = await UserModel.findById(creatorId);
    if (!user) {
      throw new HttpError(ResponseStatus.BAD_REQUEST, '');
    }
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const team = new TeamModel({ name, creatorId });
      team.members = [
        {
          _id: creatorId,
          username: user.username,
          email: user.email,
          role: 'owner',
        },
      ];
      user.teams?.push({ _id: team._id, name, role: 'owner' });
      await user.save();
      await team.save();
      await session.commitTransaction();
      return team;
    } catch {
      session.abortTransaction();
    } finally {
      session.endSession();
    }
  }
  // 修改团队名称
  static async updateTeamName(teamId: string, name: string, userId: string) {
    let team = await TeamModel.findOne(
      {
        _id: teamId,
        members: {
          $elemMatch: {
            _id: userId,
            $or: [{ role: 'owner' }, { role: 'manager' }],
          },
        },
      },
      '_id, members'
    );
    if (!team) {
      // 无权修改
      throw new HttpError(ResponseStatus.BAD_REQUEST, '无权修改此团队');
    }
    // 事务更新
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      team.name = name;
      team.save();
      // 更新用户表的 team.name
      const membersId = team.members.map((m) => m._id);
      await UserModel.updateMany(
        { _id: { $in: membersId }, 'teams._id': teamId },
        { $set: { 'teams.$.name': name } }
      );
      await session.commitTransaction();
      return team;
    } catch {
      session.abortTransaction();
    } finally {
      session.endSession();
    }
  }

  //  根据 teamId 获取团队详情
  static async getTeamById(id: string) {
    return await TeamModel.findById(id);
  }

  // 解散团队
  static async dissolveTeam(userId: string, teamId: string) {
    // 只有 owner 才可以解散
    const res = await this.getUserTeamRole(userId, teamId);
    if (res.role != 'owner') {
      throw new HttpError(ResponseStatus.BAD_REQUEST, '无权操作此团队');
    } else {
      const team = res.team!;
      const session = await mongoose.startSession();
      session.startTransaction();
      try {
        const membersId = team.members.map((m) => m._id);
        await UserModel.updateMany(
          { _id: { $in: membersId } },
          {
            $pull: {
              teams: { _id: team._id },
            },
          }
        );
        await TeamModel.deleteOne({ _id: team._id });
        await session.commitTransaction();
        return true;
      } catch {
        session.abortTransaction();
      } finally {
        session.endSession();
      }
    }
  }

  // 移除成员
  // userId: 操作 id
  // teamId: 团队 id
  // removeUserId: 要移除 id
  static async removeMember(
    userId: string,
    teamId: string,
    removeUserId: string
  ) {
    // 只有 owner | manager 才可以移除成员
  }
}
