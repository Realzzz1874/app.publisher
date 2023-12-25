<template>
  <div class="team-detail">
    <n-tabs type="line" animated>
      <n-tab-pane name="appList" tab="应用列表">
        <AppList :teamId="teamId" />
      </n-tab-pane>
      <n-tab-pane name="teamSetting" tab="团队设置">
        <TeamSetting :teamId="teamId" />
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
import { NTabs, NTabPane } from 'naive-ui'
import AppList from './AppList.vue'
import TeamSetting from './TeamSetting.vue'

defineProps<{
  teamId: string
}>()
</script>

<style scoped lang="scss">
.team-detail {
  padding: 10px 20px;
  height: 100%;
}
</style>
