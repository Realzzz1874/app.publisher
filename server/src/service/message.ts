import { MESSAGE_CATEGORY, MESSAGE_STATUS } from '../enum';
import MessageModel, { IMessage } from '../model/message';

export default class MessageService {
  // 获取未读消息数量
  static async countUnreadMessages(receiverId: string) {
    return await MessageModel.countDocuments({
      receiverId,
      status: MESSAGE_STATUS.unread,
    });
  }

  // 获取未读消息列表 未读不分页，一次性全部获取
  static async getUnreadMessages(receiverId: string) {
    return await MessageModel.find({
      receiverId,
      status: MESSAGE_STATUS.unread,
    }).sort({ sendAt: -1 });
  }

  // 获取已读消息列表，分页获取
  static async getReadMessages(receiverId: string, page: number, size = 20) {
    const skip = (page - 1) * size;
    const total = await MessageModel.countDocuments({
      receiverId,
      status: MESSAGE_STATUS.read,
    });
    const list = await MessageModel.find({
      receiverId,
      status: MESSAGE_STATUS.read,
    })
      .sort({ sendAt: -1 })
      .skip(skip)
      .limit(size);
    return { total, list };
  }

  // 将消息标记为 read
  static async readMessages(userId: string, messageIds?: string[]) {
    if (messageIds?.length) {
      await MessageModel.updateMany(
        { receiverId: userId, _id: { $in: messageIds } },
        { $set: { status: MESSAGE_STATUS.read } }
      );
    } else {
      // 消息一键已读
      await MessageModel.updateMany(
        { receiverId: userId },
        { $set: { status: MESSAGE_STATUS.read } }
      );
    }
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
