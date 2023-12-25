import mongoose, { Document, Schema } from 'mongoose';
import { MESSAGE_CATEGORY, MESSAGE_STATUS } from '../enum';

export interface IMessage extends Document {
  category: string;
  content: string;
  senderId: string;
  receiverId: string;
  sendAt: Date;
  status: string;
}

const MessageSchema = new Schema({
  category: { type: String, enum: [MESSAGE_CATEGORY.member] },
  content: { type: String, required: true },
  senderId: { type: String, required: true },
  receiverId: { type: String, required: true },
  sendAt: { type: Date, default: Date.now, required: true },
  status: {
    type: String,
    default: MESSAGE_STATUS.unread,
    enum: [MESSAGE_STATUS.read, MESSAGE_STATUS.unread],
  },
});

const MessageModel = mongoose.model<IMessage>('Message', MessageSchema);
export default MessageModel;
