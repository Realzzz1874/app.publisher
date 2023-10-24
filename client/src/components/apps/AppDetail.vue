<template>
  <div class="app-detail">
    <div class="app-info"></div>
    <div class="app-wrapper">
      <n-tabs type="line" animated>
        <n-tab-pane name="version" tab="版本信息">
          <div class="wrapper-list"></div>
        </n-tab-pane>
        <n-tab-pane name="appSetting" tab="应用设置">
          <div class="wrapper-list"></div>
        </n-tab-pane>
      </n-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NTabs, NTabPane } from 'naive-ui'

const props = defineProps<{
  teamId: string
  appId: string
}>()
</script>

<style scoped lang="scss">
.app-detail {
  padding: 10px 20px;
  height: 100%;
  .app-info {
    height: 140px;
    background-color: $color_bg_white;
  }
  .app-wrapper {
    margin-top: 10px;
    .wrapper-list {
      background-color: $color_bg_white;
      height: calc(100vh - 290px);
      overflow-y: scroll;
    }
  }
}
</style>
