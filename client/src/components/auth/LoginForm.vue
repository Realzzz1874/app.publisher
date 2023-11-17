<template>
  <div class="form">
    <n-form ref="loginFormRef" :model="loginForm" :rules="rules" size="large">
      <n-form-item path="username">
        <n-input v-model:value="loginForm.username" placeholder="请输入用户名">
          <template #suffix> <n-icon :component="PersonCircle" /> </template
        ></n-input>
      </n-form-item>
      <n-form-item path="password">
        <n-input
          type="password"
          v-model:value="loginForm.password"
          show-password-on="click"
          placeholder="请输入密码"
          :maxlength="8"
        >
          <template #password-visible-icon>
            <n-icon :size="16" :component="GlassesOutline" />
          </template>
          <template #password-invisible-icon>
            <n-icon :size="16" :component="Glasses" />
          </template>
        </n-input>
      </n-form-item>
    </n-form>
    <n-button class="panel-button" size="large" type="primary" @click="login"> 登录 </n-button>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import { type FormInst, NForm, NFormItem, NInput, NIcon, NButton, useMessage } from 'naive-ui'
import { PersonCircle, GlassesOutline, Glasses } from '@vicons/ionicons5'

import { loginApi } from '../../api/module/auth'
import { UserStore } from '@/store/module/user'

const userStore = UserStore()
const router = useRouter()
const message = useMessage()

const loading = ref(false)
const loginFormRef = ref<FormInst | null>()
const loginForm = reactive({
  username: '',
  password: ''
})

const rules = {
  username: {
    required: true,
    message: '请输入用户名',
    trigger: 'blur'
  },
  password: {
    required: true,
    message: '请输入密码',
    trigger: 'blur'
  }
}

const login = async () => {
  if (loading.value) return
  loginFormRef.value
    ?.validate(async (errors) => {
      if (!errors) {
        loading.value = true
        const res = await loginApi(loginForm)
        if (res?.data) {
          userStore.setToken(res.data.token)
          userStore.setTeams(res.data.teams)
          userStore.setUser(res.data.user)
          message.success('登录成功')
          setTimeout(() => {
            router.replace('/')
          }, 1500)
        }
        loading.value = false
      }
    })
    .catch(() => {})
}
</script>

<style scoped lang="scss">
.form {
  .n-form-item {
    margin-top: -10px;
  }
  .panel-button {
    width: 328px;
    margin-top: 20px;
  }
}
</style>
