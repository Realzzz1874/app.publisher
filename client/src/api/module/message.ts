import axios from '../index'
import { type Message } from '@/interface'

// 获取未读信息数量
export const getUnreadMessageCountApi = () => {
  return axios.get<number>('/message/unread/count')
}

// 获取未读信息
export const getUnreadMessagesApi = () => {
  return axios.get<Message.MessageItem[]>('/message/unread')
}

// 获取已读消息
export const getReadMessagesApi = (page: number, size = 20) => {
  return axios.get<Message.ReadMessages>(`/message/read?page=${page}&size=${size}`)
}

// 将消息标记为已读
export const readMessagesApi = (messageIds?: string[]) => {
  return axios.put<boolean>('/message/read', { messageIds })
}
