<template>
  <div class="slide-nav">
    <n-menu
      :default-expanded-keys="['teams']"
      :options="menuOptions"
      v-model:value="selectedMenuKey"
      @update:value="changeMenu"
    />
  </div>
</template>

<script lang="ts" setup>
import { type Component, h, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import { type MenuOption, NIcon, NMenu } from 'naive-ui'
import { GroupAddSharp } from '@vicons/material'

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
    label: '团队管理',
    key: 'teams',
    icon: renderIcon(GroupAddSharp),
    children: [
      {
        label: 'mpass-dev',
        key: '6128b3b2e7abe6001ede5b95'
      }
    ]
  }
]
function changeMenu(key: string) {
  router.push(`/team/${key}`)
}
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
