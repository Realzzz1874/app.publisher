<template>
  <div class="slide-nav">
    <n-menu
      :default-expanded-keys="['teams']"
      :options="menuOptions"
      v-model:value="selectedMenuKey"
      @update:value="changeMenu"
    />
    <n-modal v-model:show="showAddTeam" preset="dialog" title="创建团队" :show-icon="false">
      <div class="modal-wrapper">
        <n-input v-model:value="teamName" type="text" placeholder="请输入团队名称" />
      </div>
      <template #action>
        <n-space>
          <n-button type="default" @click="showAddTeam = false"> 取消 </n-button
          ><n-button type="success" @click="addTeam"> 确定 </n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>

<script lang="ts" setup>
import { type Component, h, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import { type MenuOption, NIcon, NMenu, NModal, NButton, NSpace, NInput } from 'naive-ui'
import { GroupAddSharp, GroupFilled } from '@vicons/material'

const router = useRouter()

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

onMounted(() => {
  // 从缓存里取上次默认选中
  selectedMenuKey.value = '6128b3b2e7abe6001ede5b95'
  if (selectedMenuKey.value) {
    router.push(`/team/${selectedMenuKey.value}`)
  }
})

const selectedMenuKey = ref('')
const menuOptions: MenuOption[] = [
  {
    label: '创建团队',
    key: 'addTeam',
    icon: renderIcon(GroupAddSharp)
  },
  {
    label: '团队管理',
    key: 'teams',
    icon: renderIcon(GroupFilled),
    children: [
      {
        label: 'pass-dev',
        key: '6128b3b2e7abe6001ede5b95'
      }
    ]
  }
]

const showAddTeam = ref(false)
const teamName = ref('')
function addTeam() {
  // 1. 提交新增接口
  // 2. 提交成功后跳转到该团队页面
  teamName.value = ''
  showAddTeam.value = false
}
function changeMenu(key: string) {
  if (key == 'addTeam') {
    // 创建团队
    showAddTeam.value = true
  } else {
    router.push(`/team/${key}`)
  }
}
</script>

<style scoped lang="scss">
.modal-wrapper {
  width: 330px;
  margin: 30px 0;
}
.slide-nav {
  @include wh(192px, 100%);
  background-color: $color_bg_white;
  @include flex(column, flex-start, center);
  padding-top: 10px;
  border-right: 1px solid $color_divider;
  .n-menu {
    width: 100%;
  }
}
</style>
