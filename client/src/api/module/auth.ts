import axios from '../index'

import { type Auth } from '../interface'

export const loginApi = (params: Auth.LoginDTO) => {
  return axios.post<Auth.LoginResDTO>('/login', params, { silence: false })
}

export const registerApi = (params: Auth.RegisterDTO) => {
  return axios.post<Auth.LoginResDTO>('/register', params)
}
