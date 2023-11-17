import axios from '../index'

// 创建团队
export const createTeamApi = (params: { name: string }) => {
  return axios.post<string>('/team', params)
}
