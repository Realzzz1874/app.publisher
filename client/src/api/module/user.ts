import axios from '../index'
import { type User } from '@/interface'

// 获取用户个人信息
export const getMyInfo = () => {
  return axios.get<User.InfoWithTeams>('/user')
}

// 修改密码
export const changePasswordApi = (params: User.ChangePasswordDTO) => {
  return axios.put<boolean>('/user/password', params)
}

// 修改用户名
export const changeUsernameApi = (username: string) => {
  return axios.put<boolean>('/user/username', { username })
}

// 模糊查询用户 [username | email]
export const findUsersApi = (keyword: string) => {
  return axios.get<User.InfoWithTeams[]>(`/users?keyword=${keyword}`)
}
