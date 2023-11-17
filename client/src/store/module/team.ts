import { defineStore } from 'pinia'
import piniaPersistConfig from '../helper/persist'

interface Team {
  selectedTeamId: string
}

export const TeamStore = defineStore({
  id: 'app_publisher_team',
  state: (): Team => ({
    selectedTeamId: ''
  }),
  getters: {},
  actions: {
    setSelectedTeamId(id: string) {
      this.selectedTeamId = id
    }
  },
  persist: piniaPersistConfig('app_publisher_team')
})
