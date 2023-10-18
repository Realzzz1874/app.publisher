<template>
  <div class="app-card">
    <n-card
      :hoverable="true"
      content-style="display: flex; flex-direction: column; justify-content: flex-start; align-items: center; padding: 10px;"
      footer-style="display: flex; flex-direction: row; justify-content: flex-end; align-items: center; padding: 10px;"
    >
      <template #header>
        <span class="app-name" @click="goDetail">{{ appInfo.appName }}</span>
      </template>
      <template #header-extra>
        <n-icon :size="36" :component="AppleFilled" v-if="appInfo.platform == 'ios'" />
        <n-icon
          :size="36"
          color="#18a058"
          :component="AndroidFilled"
          v-if="appInfo.platform == 'android'"
        />
      </template>
      <n-avatar :size="60" :src="appInfo.icon" :fallback-src="appIconError" @click="goDetail" />
      <p class="first-p">
        <span class="label">下载地址:</span
        ><span class="value download" @click="copy">{{ appInfo.downloadUrl }}</span>
      </p>

      <p>
        <span class="label">PackageName:</span><span class="value">{{ appInfo.packageName }}</span>
      </p>
      <p>
        <span class="label">当前版本:</span
        ><span class="value">{{ appInfo.releaseVersionCode }}</span>
      </p>

      <template #footer>
        <n-space>
          <n-button tertiary type="default" size="tiny"> 编辑 </n-button>
          <n-button tertiary type="default" size="tiny"> 预览 </n-button>
        </n-space>
      </template>
    </n-card>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import useClipboard from 'vue-clipboard3'

import { NCard, NIcon, NAvatar, useMessage, NButton, NSpace } from 'naive-ui'
import { AppleFilled, AndroidFilled } from '@vicons/material'

const message = useMessage()
const { toClipboard } = useClipboard()

const appIconError = 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg'
const appInfo = reactive({
  platform: 'ios',
  appName: '猎豹移动银行',
  packageName: 'com.mobile.ynetbank',
  releaseVersionCode: '1092',
  icon: 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg',
  downloadUrl: 'https://store.lbapp.cn:11443/mpaas-dev-ios',
  id: 'test-id'
})

const emit = defineEmits(['go-app-detail'])
function goDetail() {
  emit('go-app-detail', { appId: appInfo.id, appName: appInfo.appName })
}
async function copy() {
  try {
    await toClipboard(appInfo.downloadUrl)
    message.success('复制成功')
  } catch (e) {
    console.error(e)
  }
}
</script>

<style scoped lang="scss">
.app-card {
  @include wh(264px, 330px);
  position: relative;
  .n-card {
    @include wh(100%, 100%);
    .app-name {
      cursor: pointer;
      font-weight: 500;
      font-size: $color_font_black;
    }
    .n-avatar {
      cursor: pointer;
    }
    p {
      font-size: 10px;
      width: 100%;
      @include flex(row, flex-start, center);
      margin-top: 6px;
      .label {
        width: 100px;
        text-align: right;
        margin-right: 10px;
      }
      .value {
        width: calc(100% - 100px);
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .download {
        cursor: pointer;
      }
    }
    .first-p {
      margin-top: 30px;
    }
  }
}
</style>
