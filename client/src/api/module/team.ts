import axios from '../index'
import { type Team } from '@/interface'

// 创建团队
export const createTeamApi = (params: { name: string }) => {
  return axios.post<string>('/team', params)
}

// 获取团队详情
export const getTeamByIdApi = (teamId: string) => {
  return axios.get<Team.TeamDetail>(`/team/${teamId}`)
}

// 修改团队名称
export const updateTeamNameApi = (params: Team.UpdateTeamNameDTO) => {
  return axios.put<string>('/team/name', params)
}

// 解散团队
export const dissolveTeamApi = (teamId: string) => {
  return axios.delete<boolean>(`/team/${teamId}`)
}
