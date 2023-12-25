<template>
  <div class="user-settings">
    <n-tabs type="line" animated>
      <n-tab-pane name="userInfo" tab="个人资料">
        <div class="user-info-block">
          <div class="user-info-item">
            <span>邮箱:</span>
            <n-input type="text" :readonly="true" v-model:value="userInfo.email" />
          </div>
          <div class="user-info-item">
            <span>用户名:</span>
            <n-input type="text" v-model:value="userInfo.username" placeholder="请输入用户名" />
          </div>
        </div>
        <div class="btn-group">
          <n-space size="medium"
            ><n-button type="success" @click="updateUsername"> 确 认 </n-button>
            <n-button @click="closeSettings"> 取 消 </n-button></n-space
          >
        </div>
      </n-tab-pane>
      <n-tab-pane name="password" tab="修改密码">
        <div class="password-block">
          <div class="password-item">
            <span>当前密码:</span>
            <n-input
              type="password"
              show-password-on="click"
              placeholder="请输入当前密码"
              :maxlength="8"
              v-model:value="oldPassword"
            />
          </div>
          <div class="password-item">
            <span>新密码:</span>
            <n-input
              type="password"
              show-password-on="click"
              placeholder="请输入新密码"
              :maxlength="8"
              v-model:value="newPassword"
            />
          </div>
          <div class="password-item">
            <span>确认密码:</span>
            <n-input
              type="password"
              show-password-on="click"
              placeholder="请再次输入新密码"
              :maxlength="8"
              v-model:value="confirmPassword"
            />
          </div>
        </div>
        <div class="btn-group">
          <n-space size="medium"
            ><n-button type="success" @click="changePassword"> 确 认 </n-button>
            <n-button @click="closeSettings"> 取 消 </n-button></n-space
          >
        </div>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script lang="ts" setup>
import { NTabs, NTabPane, NInput, NSpace, NButton, useMessage } from 'naive-ui'
import { UserStore } from '@/store/module/user'
import { ref } from 'vue'
import { changePasswordApi, changeUsernameApi } from '@/api/module/user'
import { validateUsernameInput } from '@/utils/validate'
const emit = defineEmits(['close-settings'])
const userStore = UserStore()
const message = useMessage()
const userInfo = userStore.userInfo ?? {
  username: '',
  email: '',
  _id: ''
}

const updateUsername = async () => {
  if (!validateUsernameInput(userInfo.username)) {
    return message.error('用户名应为 1-10 位的数字和字母组成')
  }
  const res = await changeUsernameApi(userInfo.username)
  if (res.data) {
    message.success('修改成功')
    // 更新 userStore
    await userStore.setUser(userInfo)
    closeSettings()
  } else {
    message.error('修改失败')
  }
}

const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const changePassword = async () => {
  if (!oldPassword.value || !newPassword.value || !confirmPassword.value) {
    return message.error('请输入完整内容')
  }
  if (newPassword.value !== confirmPassword.value) {
    return message.error('两次密码不一致')
  }
  const res = await changePasswordApi({
    oldPassword: oldPassword.value,
    newPassword: newPassword.value
  })
  if (res.data) {
    message.success('修改成功')
    closeSettings()
  } else {
    message.error('修改失败')
  }
}

const closeSettings = () => {
  emit('close-settings')
}
</script>

<style scoped lang="scss">
.password-block,
.user-info-block {
  margin-top: 20px;
  width: 300px;
  .password-item,
  .user-info-item {
    @include flex(row, flex-start, center);
    margin-bottom: 20px;
    span {
      width: 120px;
    }
  }
}

.btn-group {
  width: 200px;
  margin: 40px auto;
}
</style>
