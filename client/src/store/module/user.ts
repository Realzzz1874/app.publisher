import { defineStore } from 'pinia'
import piniaPersistConfig from '../helper/persist'

interface User {
  token: string
  userInfo?: { name: string }
}

export const UserStore = defineStore({
  id: 'app_publisher_user',
  state: (): User => ({
    token: ''
  }),
  getters: {},
  actions: {
    setToken(token: string) {
      this.token = token
    },
    setUser(userInfo: User['userInfo']) {
      this.userInfo = userInfo
    }
  },
  persist: piniaPersistConfig('app_publisher_user')
})
