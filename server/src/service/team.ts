import TeamModel from '../model/team';
import UserModel from '../model/user';
import mongoose from '../database/mongodb';
import HttpError from '../interface/HttpError';
import { ResponseStatus } from '../types';

export default class TeamService {
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
    // user 必须是 owner | manager 才可以修改
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
}
