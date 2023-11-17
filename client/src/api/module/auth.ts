import axios from '../index'

import { type Auth, type User } from '../interface'

// 登录
export const loginApi = (params: Auth.LoginDTO) => {
  return axios.post<User.MyInfo>('/login', params, { silence: false })
}

// 注册
export const registerApi = (params: Auth.RegisterDTO) => {
  return axios.post<Auth.LoginResDTO>('/register', params)
}

// 找回密码
export const findPasswordApi = (params: { email: string }) => {
  return axios.post<void>('/password', params)
}

// 修改密码
export const resetPasswordApi = (params: Auth.ResetPasswordDTO) => {
  return axios.put<void>('/password', params)
}
