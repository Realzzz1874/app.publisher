import { defineStore } from 'pinia'
import piniaPersistConfig from '../helper/persist'
import { getMyInfo } from '@/api/module/user'
import { getUnreadMessageCountApi } from '@/api/module/message'

interface User {
  token: string
  userInfo?: { username: string; email: string; _id: string }
  teams?: Array<{
    _id: string
    name: string
    role: string
  }>
  unreadMessageCount: number // 未读消息数量
}

export const UserStore = defineStore({
  id: 'app_publisher_user',
  state: (): User => ({
    token: '',
    userInfo: {
      username: '',
      email: '',
      _id: ''
    },
    teams: [],
    unreadMessageCount: 0
  }),
  getters: {},
  actions: {
    setToken(token: string) {
      this.token = token
    },
    setUser(userInfo: User['userInfo']) {
      this.userInfo = userInfo
    },
    setTeams(teams: User['teams']) {
      this.teams = teams
    },
    async getMyInfo() {
      const res = await getMyInfo()
      if (res.data) {
        this.teams = res.data.teams
      }
    },
    async logout() {
      this.token = ''
      this.userInfo = { username: '', email: '', _id: '' }
      this.teams = []
    },
    async getUnreadMessageCount() {
      const res = await getUnreadMessageCountApi()
      if (!isNaN(res.data)) {
        this.unreadMessageCount = res.data
      }
    },
    setUnreadMessageCount(count: number) {
      this.unreadMessageCount = count
    }
  },
  persist: piniaPersistConfig('app_publisher_user')
})
