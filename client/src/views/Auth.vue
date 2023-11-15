<template>
  <div class="login-page">
    <div class="login-left">
      <p class="app-title">App.Publisher</p>
      <n-divider />
      <p class="second-title">Github</p>
      <p class="second-title">About</p>
      <p class="second-title">Help</p>
    </div>
    <div class="login-right">
      <div class="panel">
        <p class="panel-title">
          <span>{{ panelTitle }}</span>
        </p>
        <div class="panel-form">
          <LoginForm v-if="showType == 'login'"></LoginForm>
          <RegisterForm v-if="showType == 'register'"></RegisterForm>
          <ForgetForm v-if="showType == 'forget'"></ForgetForm>
        </div>
        <div class="panel-footer">
          <span v-if="showType != 'login'" @click="() => (showType = 'login')">去登录</span>
          <n-divider vertical v-if="showType == 'forget'" />
          <span v-if="showType != 'register'" @click="() => (showType = 'register')">去注册</span>
          <n-divider vertical v-if="showType != 'forget'" />
          <span v-if="showType != 'forget'" @click="() => (showType = 'forget')">忘记密码</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

import { NDivider } from 'naive-ui'

import LoginForm from '../components/auth/LoginForm.vue'
import RegisterForm from '../components/auth/RegisterForm.vue'
import ForgetForm from '../components/auth/ForgetForm.vue'
import { UserStore } from '@/store/module/user'

const userStore = UserStore()
const router = useRouter()
// 如果存在 token，则直接跳转首页
if (userStore.token) {
  router.replace('/')
}

interface TypedObject {
  [key: string]: string
}
const showType = ref('login')
const panelTitleObj: TypedObject = {
  login: '登录',
  register: '注册',
  forget: '找回密码'
}
const panelTitle = computed(() => {
  return panelTitleObj[showType.value]
})
</script>
<style scoped lang="scss">
.login-page {
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  overflow: hidden;
  background-image: url('../assets/bg-small.png');
  background-size: 100% 100%;
  ::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    opacity: 0.8;
  }
}
.login-left {
  width: 40%;
  height: 100%;
  background: $color_main;
  opacity: 0.8;
  display: flex;
  max-width: 600px;
  min-width: 200px;
  padding: 20px 40px;
  @include flex(column, center, center);
  @media screen and (max-width: 768px) {
    display: none;
    position: relative;
  }
  p {
    color: $color_font_white;
    font-size: 1em;
    &:hover {
      font-weight: bold;
      cursor: pointer;
    }
  }
  .app-title {
    font-size: 1.6em;
    font-weight: bold;
  }
}
.login-right {
  width: 100%;
  height: 100%;
  overflow: hidden;
  @include flex(column, center, center);
  .panel {
    @include wh(408px, 528px);
    overflow: hidden;
    background-color: #fff;
    position: absolute;
    border-radius: 8px;
    .panel-title {
      @include wh(100%, 72px);
      @include flex(row, flex-start, center);
      border-bottom: 1px solid $color_divider;
      span {
        font-size: 20px;
        line-height: 24px;
        color: $color_font_black;
        margin-left: 40px;
      }
    }
    .panel-form {
      @include wh(100%, 380px);
      padding: 20px 40px;
    }

    .panel-footer {
      @include flex(row, center, center);
      span {
        font-size: 12px;
        color: $color_font_black;
        cursor: pointer;
      }
    }
  }
}
</style>
