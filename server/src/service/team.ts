import TeamModel from '../model/team';
import UserModel from '../model/user';
import mongoose from '../database/mongodb';
import HttpError from '../interface/HttpError';
import { ResponseStatus } from '../types';
import { ROLES } from '../enum';

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
          role: ROLES.owner,
        },
      ];
      user.teams?.push({ _id: team._id, name, role: ROLES.owner });
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
            $or: [{ role: ROLES.owner }, { role: ROLES.manager }],
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

    if (res.role != ROLES.owner) {
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
    const user = await this.getUserTeamRole(userId, teamId);
    if (user.role == ROLES.owner || user.role == ROLES.manager) {
      const removeUser = await this.getUserTeamRole(removeUserId, teamId);
      if (removeUser.role == ROLES.owner) {
        // 不能把 owner 移除了
        throw new HttpError(ResponseStatus.BAD_REQUEST, '无权操作');
      }
      // 事务更新
      const session = await mongoose.startSession();
      session.startTransaction();
      try {
        // removeUser 删除 teamId 对应的 team
        await UserModel.updateOne(
          { _id: removeUserId },
          {
            $pull: {
              teams: { _id: teamId },
            },
          }
        );
        // teamId 删除对应的 removeUser
        await TeamModel.updateOne(
          {
            _id: teamId,
          },
          {
            $pull: {
              members: { _id: removeUserId },
            },
          }
        );
        await session.commitTransaction();
        return true;
      } catch {
        session.abortTransaction();
      } finally {
        session.endSession();
      }
    } else {
      throw new HttpError(ResponseStatus.BAD_REQUEST, '无权操作');
    }
  }

  // 将某用户加入团队
  // userId: 操作者 [owner | manager]
  // memberId: 需要添加用户 [manager | guest]
  // role: 角色 [manager | guest]
  static async addMember(
    userId: string,
    teamId: string,
    memberId: string,
    role: string
  ) {
    const user = await this.getUserTeamRole(userId, teamId);
    if (user.role == ROLES.owner || user.role == ROLES.manager) {
      let team = await TeamModel.findById(teamId);
      if (!team) {
        throw new HttpError(ResponseStatus.BAD_REQUEST, '团队不存在');
      }
      team.members.forEach((u) => {
        if (u._id == memberId) {
          throw new HttpError(ResponseStatus.BAD_REQUEST, '已经加入');
        }
      });
      let member = await UserModel.findById(memberId);
      if (!member) {
        throw new HttpError(ResponseStatus.BAD_REQUEST, '用户不存在');
      }
      // 事务更新
      const session = await mongoose.startSession();
      session.startTransaction();
      try {
        team.members.push({
          _id: memberId,
          username: member.username,
          email: member.email,
          role,
        });
        await team.save();
        member.teams?.push({
          _id: teamId,
          name: team.name,
          role,
        });
        await member.save();
        await session.commitTransaction();
        return true;
      } catch {
        session.abortTransaction();
      } finally {
        session.endSession();
      }
    } else {
      throw new HttpError(ResponseStatus.BAD_REQUEST, '无权操作');
    }
  }

  // 修改成员角色
  // userId: 操作者 [owner | manager]
  // roleId: 需要修改者 [manager | guest]
  // role: 角色 [manager | guest]
  static async changeRole(
    userId: string,
    teamId: string,
    roleId: string,
    role: string
  ) {
    if (userId == roleId) {
      throw new HttpError(ResponseStatus.BAD_REQUEST, '禁止修改自己的权限');
    }
    const user = await this.getUserTeamRole(userId, teamId);
    const roleUser = await this.getUserTeamRole(roleId, teamId);
    if (user.role == ROLES.owner || user.role == ROLES.manager) {
      if (roleUser.role == ROLES.manager || roleUser.role == ROLES.guest) {
        if (role == ROLES.manager || role == ROLES.guest) {
          // 事务更新
          const session = await mongoose.startSession();
          session.startTransaction();
          try {
            await UserModel.updateOne(
              { _id: roleId, 'teams._id': teamId },
              {
                $set: {
                  'teams.$.role': role,
                },
              }
            );
            await TeamModel.updateOne(
              { _id: teamId, 'members._id': roleId },
              {
                $set: {
                  'members.$.role': role,
                },
              }
            );
            await session.commitTransaction();
            return true;
          } catch {
            session.abortTransaction();
          } finally {
            session.endSession();
          }
        } else {
          throw new HttpError(ResponseStatus.BAD_REQUEST, '角色不正确');
        }
      } else {
        throw new HttpError(ResponseStatus.BAD_REQUEST, '无权操作');
      }
    } else {
      throw new HttpError(ResponseStatus.BAD_REQUEST, '无权操作');
    }
  }
}
