import UserModel from '../model/user';
export default class UserService {
  static async getUser(username: string) {
    return await UserModel.findOne({ username: username });
  }
}
