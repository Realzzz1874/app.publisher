import UserModel from '../model/user';
export default class UserService {
  static async getUser(username: string) {
    return await UserModel.findOne({ username: username });
  }
  static async registerUser(username: string, password: string, email: string) {
    const user = new UserModel({ username, password, email });
    return await user.save();
  }
}
