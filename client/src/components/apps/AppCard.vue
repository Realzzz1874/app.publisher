<template>
  <div class="app-card">
    <n-card
      :hoverable="true"
      :title="appInfo.appName"
      content-style="display: flex; flex-direction: column; justify-content: flex-start; align-items: center;"
    >
      <template #header-extra>
        <n-icon :size="36" :component="AppleFilled" v-if="appInfo.platform == 'ios'" />
        <n-icon
          :size="36"
          color="#18a058"
          :component="AndroidFilled"
          v-if="appInfo.platform == 'android'"
        />
      </template>
      <n-avatar :size="60" :src="appInfo.icon" :fallback-src="appIconError" />
    </n-card>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'

import { NCard, NIcon, NAvatar } from 'naive-ui'
import { AppleFilled, AndroidFilled } from '@vicons/material'

const appIconError = 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg'
const appInfo = reactive({
  platform: 'ios',
  appName: '猎豹移动银行',
  PackageName: 'com.mobile.ynetbank',
  currentVersion: '50',
  icon: 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg',
  downloadUrl: 'https://store.lbapp.cn:11443/mpaas-dev-ios'
})
</script>

<style scoped lang="scss">
.app-card {
  @include wh(264px, 330px);
  position: relative;
  .n-card {
    @include wh(100%, 100%);
    .n-card__content {
      width: 30px;
      @include flex(column, flex-start, center);
    }
  }
}
</style>
