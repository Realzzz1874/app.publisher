<template>
  <div class="app-list-block">
    <div class="header-opt">
      <n-button type="primary">
        <template #icon>
          <n-icon :size="20" :component="CloudUploadOutlined" />
        </template>
        上传应用
      </n-button>
      <div class="filter-block">
        <div class="platform">
          <n-checkbox-group v-model:value="platforms">
            <n-space size="small"
              ><n-checkbox size="large" value="ios" label="ios" />
              <n-checkbox size="large" value="android" label="android"
            /></n-space>
          </n-checkbox-group>
        </div>
        <div>
          <n-input placeholder="输入名称搜索" type="text" round v-model:value="keyword">
            <template #prefix>
              <n-icon :size="22" :component="ManageSearchOutlined" />
            </template>
          </n-input>
        </div>
      </div>
    </div>
    <!--  -->
    <div class="app-list-wrapper">
      <div v-if="appList.length == 0">
        <n-result status="404" title="空空如也" description="点击【左上角按钮】上传第一个应用吧" />
      </div>
      <div v-else>
        <div class="card-item" v-for="(item, index) in appList" :key="index">
          <AppCard />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { NIcon, NButton, NInput, NCheckbox, NCheckboxGroup, NSpace, NResult } from 'naive-ui'
import { CloudUploadOutlined, ManageSearchOutlined } from '@vicons/material'

import AppCard from './AppCard.vue'

const keyword = ref('')
const platforms = ref(['ios', 'android'])

const appList = ref([1])
</script>

<style scoped lang="scss">
.app-list-block {
  @include wh(100%, 100%);
  box-sizing: border-box;
  // background-color: $color_bg_white;
  padding: 8px 26px;
  .header-opt {
    @include wh(100%, 60px);
    @include flex(row, space-between, center);
    .filter-block {
      @include flex(row, flex-end, center);
      .platform {
        margin-right: 20px;
      }
      .n-checkbox-group {
        @include flex(row, flex-end, center);
      }
    }
    .n-input {
      border: 1px solid $color_main;
      background-color: $color_bg_grey;
    }
  }

  .app-list-wrapper {
    width: 100%;
    margin-top: 40px;
  }
}
</style>
