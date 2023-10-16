<template>
  <div class="form">
    <n-form ref="formRef" :model="registerForm" :rules="rules" size="large">
      <n-form-item path="username">
        <n-input v-model:value="registerForm.username" placeholder="请输入用户名">
          <template #suffix> <n-icon :component="PersonCircle" /> </template
        ></n-input>
      </n-form-item>
      <n-form-item path="email">
        <n-input v-model:value="registerForm.email" placeholder="请输入邮箱">
          <template #suffix> <n-icon :component="Mail" /> </template
        ></n-input>
      </n-form-item>
      <n-form-item path="password">
        <n-input
          type="password"
          v-model:value="registerForm.password"
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
    <n-button class="panel-button" size="large" type="primary" @click="register"> 注册 </n-button>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

import { NForm, NFormItem, NInput, NIcon, NButton } from 'naive-ui'
import { PersonCircle, GlassesOutline, Glasses, Mail } from '@vicons/ionicons5'

const registerForm = reactive({
  username: '',
  email: '',
  password: ''
})

const rules = {
  username: {
    required: true,
    message: '请输入用户名',
    trigger: 'blur'
  },
  email: {
    required: true,
    message: '请输入邮箱',
    trigger: 'blur'
  },
  password: {
    required: true,
    message: '请输入密码',
    trigger: 'blur'
  }
}

function register() {
  console.log('registerForm', JSON.parse(JSON.stringify(registerForm)))
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
