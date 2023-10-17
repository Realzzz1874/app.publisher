<template>
  <div class="header-nav">
    <span class="sys-name" @click="goMain"
      ><n-gradient-text :size="20" type="success"> App.Publisher </n-gradient-text></span
    >
    <div class="nav-opt">
      <div class="team-change">
        <n-dropdown trigger="click" :show-arrow="true" :options="teamOptions" @select="selectTeam">
          <div class="current-team">
            <span class="team-name">{{ teamName }}</span>
            <n-icon :size="24" :component="KeyboardArrowLeftRound" />
          </div>
        </n-dropdown>
      </div>
      <div class="user-info">
        <n-icon :size="24" :component="NotificationsNoneOutlined" @click="showMessage = true" />
        <n-drawer v-model:show="showMessage" :width="502" placement="right">
          <n-drawer-content title="消息通知" closable>
            <MessageList :userId="userInfo.id" />
          </n-drawer-content>
        </n-drawer>
        <n-dropdown
          trigger="hover"
          :show-arrow="true"
          :options="userOptions"
          @select="selectUserOption"
        >
          <div class="user-block">
            <n-avatar round size="medium">
              <!-- {{ userInfo.name }} -->
              <n-icon :size="34" :component="PersonFilled" />
            </n-avatar>
            <span class="user-name">{{ userInfo.name }}</span>
          </div>
        </n-dropdown>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import { NDropdown, NIcon, NAvatar, NDrawer, NDrawerContent, NGradientText } from 'naive-ui'
import { KeyboardArrowLeftRound, NotificationsNoneOutlined, PersonFilled } from '@vicons/material'

import MessageList from './MessageList.vue'

const router = useRouter()
function goMain() {
  router.push('/apps')
}

// 个人信息
const userInfo = reactive({
  name: '张三',
  id: 'as'
})
const userOptions = reactive([
  {
    label: '个人设置',
    key: 'settings'
  },
  {
    label: '退出登录',
    key: 'logout'
  }
])
function selectUserOption(key: string) {
  console.log('key', key)
}

// 选择团队
const currentTeam = reactive({
  name: 'mpaas-dev',
  role: 'owner',
  _id: '6128b3b2e7abe6001ede5b95'
})
const teamName = computed(() => {
  return currentTeam.name
})
const teamOptions = reactive([
  {
    label: 'mpaas-dev',
    key: '6128b3b2e7abe6001ede5b95'
  }
])
function selectTeam(key: string | number) {
  console.log('key', key)
}

// 消息
const showMessage = ref(false)
</script>

<style scoped lang="scss">
.header-nav {
  @include wh(100%, 60px);
  @include flex(row, flex-start, center);
  background-color: $color_bg_white;
  border-bottom: 2px solid $color_divider;
  .sys-name {
    @include wh(192px, 60px);
    @include flex(row, center, center);
    box-sizing: border-box;
    border-bottom: 4px solid $color_main;
    cursor: pointer;
  }
  .nav-opt {
    flex-grow: 1;
    height: 60px;
    @include flex(row, space-between, center);
    padding: 0 30px;

    .current-team {
      @include flex(row, flex-start, center);
      cursor: pointer;
      .n-icon {
        transform: rotate(-90deg);
        margin-top: 2px;
      }
    }

    .user-info {
      @include flex(row, flex-end, center);
      .n-icon {
        cursor: pointer;
      }
      .user-block {
        @include flex(row, flex-end, center);
        margin-left: 20px;
        cursor: pointer;
        .user-name {
          margin-left: 6px;
        }
      }
    }
  }
}
</style>
