<template>
  <div class="header-nav">
    <span class="sys-name" @click="goMain"
      ><n-gradient-text :size="20" type="success"> App.Publisher </n-gradient-text></span
    >
    <div class="nav-opt">
      <div class="user-info">
        <n-badge processing dot :show="unReadMessageCount > 0">
          <n-icon
            color="#000"
            :size="24"
            :component="NotificationsNoneOutlined"
            @click="showMessage = true"
          />
        </n-badge>
        <n-drawer v-model:show="showMessage" :width="502" placement="right">
          <n-drawer-content title="消息通知" closable>
            <MessageList />
          </n-drawer-content>
        </n-drawer>
        <n-dropdown
          trigger="hover"
          :show-arrow="true"
          :options="userOptions"
          @select="selectUserOption"
        >
          <div class="user-block">
            <n-avatar round size="medium" :style="{ backgroundColor: '#36ad6a' }">
              {{ avatarName }}
            </n-avatar>
            <span class="user-name">{{ userInfo?.username }}</span>
          </div>
        </n-dropdown>
        <n-drawer v-model:show="showSettings" :width="502" placement="right">
          <n-drawer-content title="个人设置" closable>
            <UserSettings @close-settings="closeSettings" />
          </n-drawer-content>
        </n-drawer>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import { NDropdown, NIcon, NAvatar, NDrawer, NDrawerContent, NGradientText, NBadge } from 'naive-ui'
import { NotificationsNoneOutlined } from '@vicons/material'

import { UserStore } from '@/store/module/user'

import MessageList from './MessageList.vue'
import UserSettings from './UserSettings.vue'

const router = useRouter()
const userStore = UserStore()

const goMain = () => {
  router.push('/')
}

const userInfo = computed(() => {
  return userStore.userInfo
})
const unReadMessageCount = computed(() => {
  return userStore.unreadMessageCount
})
const avatarName = computed(() => {
  return userStore.userInfo?.username.charAt(0).toLocaleUpperCase()
})
const userOptions = [
  {
    label: '个人设置',
    key: 'settings'
  },
  {
    label: '退出登录',
    key: 'logout'
  }
]
const selectUserOption = (key: string) => {
  if (key == 'settings') {
    return (showSettings.value = true)
  }
  if (key == 'logout') {
    userStore.logout()
    router.replace('/auth')
  }
}
// 消息
const showMessage = ref(false)
const showSettings = ref(false)
const closeSettings = () => {
  showSettings.value = false
}
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
    @include flex(row, flex-end, center);
    padding: 0 30px;

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
