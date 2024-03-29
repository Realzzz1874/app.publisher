<template>
  <div class="app-detail">
    <div class="app-info">
      <div class="left">
        <div class="left-top">
          <n-avatar :size="60" :src="appInfo.icon" :fallback-src="appIconError" />
          <div class="app-name-tag">
            <span class="app-name">{{ appInfo.appName }}</span>
            <div class="tags">
              <n-space>
                <n-tag type="success" size="small">
                  <template #icon>
                    <n-icon :component="appInfo.platform == 'ios' ? AppleFilled : AndroidFilled" />
                  </template>
                  适用于{{ appInfo.platform }}
                </n-tag>
                <n-tag size="small">
                  <template #icon> <n-icon :component="AdminPanelSettingsOutlined" /> </template
                  >企业版
                </n-tag>
              </n-space>
            </div>
          </div>
        </div>
        <div class="left-bottom">
          <n-space>
            <n-button type="primary" size="small">
              <template #icon>
                <n-icon :size="18" :component="CloudUploadOutlined" />
              </template>
              上传新版本
            </n-button>
            <n-button type="info" size="small"> 预览 </n-button>
            <n-button type="error" size="small"> 删除 </n-button>
          </n-space>
        </div>
      </div>
      <div class="right">
        <n-space vertical
          ><div class="right-item">
            <span class="label">Bundle ID:</span>
            <n-ellipsis style="max-width: 400px"
              ><span class="item-val">{{ appInfo.packageName }}</span></n-ellipsis
            >
          </div>
          <div class="right-item">
            <span class="label">下载地址:</span>
            <div class="item-val">
              <n-ellipsis style="max-width: 400px"
                ><span>{{ appInfo.downloadUrl }}</span></n-ellipsis
              >
              <n-icon
                style="margin-left: 4px; cursor: pointer"
                :size="16"
                :component="ContentCopyRound"
                @click="copy"
              />
            </div>
          </div>
          <div class="right-item">
            <n-space>
              <n-tag type="success" size="small"> 今日下载：30 </n-tag>
              <n-tag type="info" size="small"> 总下载：100 </n-tag></n-space
            >
          </div>
        </n-space>
      </div>
    </div>
    <div class="app-wrapper">
      <n-tabs type="line" animated>
        <n-tab-pane name="version" tab="版本信息">
          <div class="wrapper-list">
            <n-data-table
              v-model:checked-row-keys="selectedVersion"
              @update:checked-row-keys="selectedVersionChange"
              :columns="versionColumns()"
              :data="versionList"
            />
          </div>
        </n-tab-pane>
        <n-tab-pane name="appSetting" tab="应用设置">
          <div class="wrapper-list">
            <div class="setting-item">
              <span class="label">应用短链接:</span>
              <div class="setting-val">
                <span class="prefix">{{ baseLocation }}</span>
                <div class="input-block">
                  <n-input
                    v-model:value="appInfo.shortUrl"
                    type="text"
                    placeholder=""
                    :allow-input="inputTrim"
                  />
                </div>
              </div>
            </div>
            <div class="setting-item">
              <span class="label">安装方式:</span>
              <div class="setting-val">
                <n-radio-group v-model:value="appInfo.installType" name="radiogroup">
                  <n-space>
                    <n-radio :value="1">公开</n-radio>
                    <n-radio :value="0">密码安装</n-radio>
                  </n-space>
                </n-radio-group>
              </div>
            </div>
            <div class="setting-item">
              <span class="label">新版本内测发布方式:</span>
              <div class="setting-val">
                <n-radio-group v-model:value="appInfo.autoPublish" name="radiogroup">
                  <n-space>
                    <n-radio :value="0">手动发布</n-radio>
                    <n-radio :value="1">上传新版本后立即自动发布</n-radio>
                  </n-space>
                </n-radio-group>
              </div>
            </div>
            <div class="setting-item save-btn">
              <n-button type="primary"> 立即生效 </n-button>
            </div>
          </div>
        </n-tab-pane>
      </n-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import useClipboard from 'vue-clipboard3'
import { ContentCopyRound } from '@vicons/material'
import {
  NTabs,
  NTabPane,
  NAvatar,
  NTag,
  NIcon,
  NSpace,
  NButton,
  NEllipsis,
  NInput,
  NRadio,
  NRadioGroup,
  NDataTable,
  useMessage,
  type DataTableColumns
} from 'naive-ui'
import {
  AppleFilled,
  AndroidFilled,
  AdminPanelSettingsOutlined,
  CloudUploadOutlined
} from '@vicons/material'

const message = useMessage()
const { toClipboard } = useClipboard()

const props = defineProps<{
  teamId: string
  appId: string
}>()

const baseLocation = 'http://localhost:5173/'
const appIconError = 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg'
const appInfo = reactive({
  platform: 'ios',
  appName: '猎豹移动银行',
  packageName: 'com.mobile.ynetbank',
  releaseVersionCode: '1092',
  icon: 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg',
  downloadUrl: 'https://store.lbapp.cn:11443/mpaas-dev-ios',
  shortUrl: 'mp-ios',
  id: 'test-id',
  installType: 1,
  autoPublish: 1
})
const inputTrim = (value: string) => !value.startsWith(' ') && !value.endsWith(' ')

const selectedVersion = ref([1])
type VersionRowData = {
  key: number
  id: string
  version: string
  updateTime: number
  size: string
  downloadCount: number
  updateLog: string
}
const versionColumns = (): DataTableColumns<VersionRowData> => {
  return [
    {
      type: 'selection',
      multiple: false
    },
    {
      title: '版本',
      key: 'version'
    },
    {
      title: '更新时间',
      key: 'updateTime'
    },
    {
      title: '文件大小',
      key: 'size'
    },
    {
      title: '下载次数',
      key: 'downloadCount'
    },
    {
      title: '更新日志',
      key: 'updateLog',
      ellipsis: {
        tooltip: true
      }
    }
  ]
}

const versionList = reactive([
  {
    key: 1,
    id: '1001',
    version: '1.0.0.1',
    updateTime: '2023-02-11',
    size: '20.1M',
    downloadCount: 101,
    updateLog: 'test'
  },
  {
    key: 2,
    id: '1001',
    version: '1.0.0.1',
    updateTime: '2023-02-11',
    size: '20.1M',
    downloadCount: 101,
    updateLog: '修复很多bug，完善很多需求，做了很多设计'
  }
])

function selectedVersionChange(keys: Array<string | number>) {
  console.log('keys', keys)
  selectedVersion.value = keys as number[]
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
.app-detail {
  padding: 10px 20px;
  height: 100%;
  .app-info {
    height: 140px;
    background-color: $color_bg_white;
    @include flex(row, space-between, center);
    padding: 0 10px;
    .left,
    .right {
      height: 140px;
      width: 50%;
    }
    .left {
      .left-top {
        width: 100%;
        height: 100px;
        @include flex(row, flex-start, center);

        .app-name-tag {
          height: 70px;
          margin-left: 20px;
          @include flex(column, space-between, flex-start);
          .app-name {
            font-size: 18px;
            font-weight: 500;
            color: $color_font_black;
          }
        }
      }
    }
    .right {
      padding: 20px 0;
      @include flex(column, space-around, flex-start);
      .right-item {
        color: $color_font_black;
        @include flex(row, flex-start, center);
        .label {
          display: block;
          // width: 100px;
          text-align: left;
        }
        .item-val {
          color: $color_font_second;
          margin-left: 10px;
          @include flex(row, flex-start, center);
        }
      }
    }
  }
  .app-wrapper {
    margin-top: 10px;
    .wrapper-list {
      background-color: $color_bg_white;
      height: calc(100vh - 290px);
      overflow-y: scroll;
      padding: 10px;
      .setting-item {
        @include flex(row, flex-start, center);
        margin: 10px 0 30px 20px;

        .setting-val {
          @include flex(row, flex-start, center);
          margin-left: 14px;
          ::v-deep(.n-input__border) {
            border: none;
            border-bottom: 1px solid $color_border;
          }
        }
      }
    }
  }
}
</style>
