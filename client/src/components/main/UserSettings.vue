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
            <n-input type="text" v-model:value="userInfo.name" placeholder="请输入用户名" />
          </div>
        </div>
        <div class="btn-group">
          <n-space size="medium"
            ><n-button type="success"> 确 认 </n-button>
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
            />
          </div>
          <div class="password-item">
            <span>新密码:</span>
            <n-input
              type="password"
              show-password-on="click"
              placeholder="请输入新密码"
              :maxlength="8"
            />
          </div>
          <div class="password-item">
            <span>确认密码:</span>
            <n-input
              type="password"
              show-password-on="click"
              placeholder="请再次输入新密码"
              :maxlength="8"
            />
          </div>
        </div>
        <div class="btn-group">
          <n-space size="medium"
            ><n-button type="success"> 确 认 </n-button>
            <n-button @click="closeSettings"> 取 消 </n-button></n-space
          >
        </div>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script lang="ts" setup>
import { NTabs, NTabPane, NInput, NSpace, NButton } from 'naive-ui'
import { reactive } from 'vue'
const emit = defineEmits(['close-settings'])
defineProps<{
  userId: string
}>()

const userInfo = reactive({
  name: '',
  email: 'zhang@test.com'
})

function closeSettings() {
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
