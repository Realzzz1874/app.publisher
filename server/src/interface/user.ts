export namespace IUser {
  export interface BaseUser {
    user: {
      username: string;
      email: string;
      _id: string;
    };
  }
  export interface MyInfo extends BaseUser {
    teams?: Array<{
      _id: string;
      name: string;
      role: string;
    }>;
  }
}
