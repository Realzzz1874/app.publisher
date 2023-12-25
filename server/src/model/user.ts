import { ROLES } from '../enum';
import { ObjectId } from 'mongodb';
import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  teams?: [
    {
      _id: string;
      name: string;
      role: string;
    }
  ];
}

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  teams: [
    {
      _id: ObjectId,
      name: String,
      role: {
        type: String,
        enum: [ROLES.owner, ROLES.manager, ROLES.guest],
      },
    },
  ],
});

const UserModel = mongoose.model<IUser>('User', UserSchema);

export default UserModel;
