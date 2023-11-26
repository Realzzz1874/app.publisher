import { MESSAGE_CATEGORY, MESSAGE_STATUS } from '../enum';
import MessageModel, { IMessage } from '../model/message';

export default class MessageService {
  // 获取未读消息列表 未读不分页，一次性全部获取
  static async getUnreadMessages(receiverId: string) {
    return await MessageModel.find({
      receiverId,
      status: MESSAGE_STATUS.unread,
    }).sort({ sendAt: -1 });
  }

  // 将消息标记为 read
  static async readMessages(userId: string, messageIds: string[]) {
    await MessageModel.updateMany(
      { receiverId: userId, _id: { $in: messageIds } },
      { $set: { status: MESSAGE_STATUS.read } }
    );
  }

  // 写入一条消息
  static async addMessage(
    senderId: string,
    receiverId: string,
    category: MESSAGE_CATEGORY,
    content: string
  ) {
    const message = new MessageModel();
    message.senderId = senderId;
    message.receiverId = receiverId;
    message.content = content;
    message.category = category;
    message.status = MESSAGE_STATUS.unread;
    await message.save();
  }

  // 批量插入多条消息
  static async addMessageMulti(messages: IMessage[]) {
    await MessageModel.insertMany(messages);
  }
}
