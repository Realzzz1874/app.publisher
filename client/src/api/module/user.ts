import axios from '../index'
import { type User } from '../interface'

// 获取用户个人信息
export const getMyInfo = () => {
  return axios.get<User.MyInfo>('/user')
}
