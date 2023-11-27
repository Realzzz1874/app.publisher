import { Context } from '@/core/koa';
import MessageService from '../service/message';
export default class MessageController {
  // 获取未读消息数量
  static async countUnreadMessages(ctx: Context) {
    const userId = ctx.userId;
    const res = await MessageService.countUnreadMessages(userId);
    ctx.success(res);
  }

  // 获取未读消息
  static async getUnreadMessages(ctx: Context) {
    const userId = ctx.userId;
    const res = await MessageService.getUnreadMessages(userId);
    ctx.success(res);
  }

  // 获取已读消息 分页获取
  static async getReadMessages(ctx: Context) {
    const userId = ctx.userId;
    const query = ctx.request.query;
    const page = query.page ? parseInt(query.page as string) : 1;
    const size = query.size ? parseInt(query.size as string) : 20;
    const res = await MessageService.getReadMessages(userId, page, size);
    ctx.success(res);
  }

  // 将消息标记为已读
  static async readMessages(ctx: Context) {
    const body = ctx.request.body as { messageIds?: string[] };
    const userId = ctx.userId;
    await MessageService.readMessages(userId, body.messageIds);
    ctx.success(true);
  }
}
