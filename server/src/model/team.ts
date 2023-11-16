import { ObjectId } from 'mongodb';
import mongoose, { Document, Schema } from 'mongoose';

interface ITeam extends Document {
  name: string;
  creatorId: string;
  createAt: Date;
  members: Array<{
    _id: string;
    username: string;
    email: string;
    role: string;
  }>;
}

const TeamSchema = new Schema({
  name: { type: String, required: true },
  creatorId: { type: String, required: true },
  createAt: { type: Date, default: Date.now, required: true },
  members: [
    {
      _id: ObjectId,
      username: String,
      email: String,
      role: {
        type: String,
        enum: ['owner', 'manager', 'guest'],
      },
    },
  ],
});

const TeamModel = mongoose.model<ITeam>('Team', TeamSchema);

export default TeamModel;
