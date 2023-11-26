import HttpError from '../interface/HttpError';
import mongoose from '../database/mongodb';
import UserModel from '../model/user';
import { ResponseStatus } from '../types';
import TeamModel from '../model/team';

export default class UserService {
  static async getUserByUsername(username: string) {
    return await UserModel.findOne({ username: username });
  }
  static async registerUser(username: string, password: string, email: string) {
    const user = new UserModel({ username, password, email });
    return await user.save();
  }
  // 获取用户详情 [可从详情中获取基本信息和团队列表]
  static async getUserByUserId(userId: string) {
    return await UserModel.findById(userId).select('-password').exec();
  }

  // 修改密码
  static async changePassword(userId: string, newPassword: string) {
    return await UserModel.findByIdAndUpdate(userId, {
      password: newPassword,
    });
  }

  // 修改用户名
  static async updateUsername(userId: string, username: string) {
    const user = await UserModel.findById(userId);
    if (user) {
      // 事务更新
      const session = await mongoose.startSession();
      session.startTransaction();
      try {
        user.username = username;
        user.save();
        const teamsId = user.teams?.map((t) => t._id);
        if (teamsId?.length) {
          await TeamModel.updateMany(
            { _id: { $in: teamsId }, 'members._id': userId },
            { $set: { 'members.$.username': username } }
          );
        }
        await session.commitTransaction();
        return true;
      } catch {
        session.abortTransaction();
        return false;
      } finally {
        session.endSession();
      }
    } else {
      throw new HttpError(ResponseStatus.BAD_REQUEST, '用户不存在');
    }
  }

  // 查询用户 [username | email]
  static async findUser(keyword: string) {
    return await UserModel.find({
      $or: [
        {
          username: { $regex: keyword, $options: 'i' },
        },
        { email: { $regex: keyword, $options: 'i' } },
      ],
    }).select(['username', 'email', '_id']);
  }
}
