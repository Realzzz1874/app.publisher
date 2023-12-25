<template>
  <div class="form">
    <n-form ref="formRef" :model="forgetForm" :rules="rules" size="large">
      <n-form-item path="email" label="新密码将发送到您的邮箱">
        <n-input v-model:value="forgetForm.email" placeholder="请输入邮箱">
          <template #suffix> <n-icon :component="Mail" /> </template
        ></n-input>
      </n-form-item>
    </n-form>
    <n-button class="panel-button" size="large" type="primary" @click="submit"> 确认 </n-button>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

import { NForm, NFormItem, NInput, NIcon, NButton } from 'naive-ui'
import { Mail } from '@vicons/ionicons5'

const forgetForm = reactive({
  email: ''
})

const rules = {
  email: {
    required: true,
    message: '请输入邮箱',
    trigger: 'blur'
  }
}

function submit() {
  console.log('forgetForm', JSON.parse(JSON.stringify(forgetForm)))
}
</script>

<style scoped lang="scss">
.form {
  .panel-button {
    width: 328px;
    margin-top: 20px;
  }
}
</style>
