<template>
  <div class="slide-nav"><n-menu :options="menuOptions" v-model:value="selectedMenuKey" /></div>
</template>

<script lang="ts" setup>
import { type Component, h, ref } from 'vue'
import { RouterLink } from 'vue-router'

import { type MenuOption, NIcon, NMenu } from 'naive-ui'
import { AppsOutlined, GroupAddSharp } from '@vicons/material'

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}
function renderRoute(label: string, path: string) {
  return () =>
    h(
      RouterLink,
      {
        to: {
          path
        }
      },
      { default: () => label }
    )
}

const selectedMenuKey = ref('appList')
const menuOptions: MenuOption[] = [
  {
    label: renderRoute('应用管理', '/apps'),
    key: 'appList',
    icon: renderIcon(AppsOutlined)
  },
  {
    label: renderRoute('团队管理', '/about'),
    key: 'members',
    icon: renderIcon(GroupAddSharp)
  }
]
</script>

<style scoped lang="scss">
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
