import UserModel from '../model/user';
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
    return await UserModel.findById(userId);
  }
}
