<template>
  <div class="slide-nav">
    <n-scrollbar style="max-height: 100%">
      <n-menu
        :default-expanded-keys="['teams']"
        :options="menuOptions"
        v-model:value="selectedMenuKey"
        @update:value="changeMenu"
      />
    </n-scrollbar>

    <n-modal v-model:show="showAddTeam" preset="dialog" title="创建团队" :show-icon="false">
      <div class="modal-wrapper">
        <n-input
          v-model:value="teamName"
          type="text"
          placeholder="请输入团队名称"
          maxlength="10"
          show-count
        />
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
import { type Component, h, ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

import {
  type MenuOption,
  NIcon,
  NMenu,
  NModal,
  NButton,
  NSpace,
  NInput,
  NScrollbar
} from 'naive-ui'
import { GroupAddSharp, GroupFilled } from '@vicons/material'

import { TeamStore } from '@/store/module/team'
import { UserStore } from '@/store/module/user'
import { createTeamApi } from '@/api/module/team'

const teamStore = TeamStore()
const userStore = UserStore()

const router = useRouter()

const myTeams = computed(() => {
  return userStore.teams?.map((t) => {
    return {
      label: t.name,
      key: t._id
    }
  })
})

const menuOptions = computed<MenuOption[]>(() => {
  return [
    {
      label: '创建团队',
      key: 'addTeam',
      icon: renderIcon(GroupAddSharp)
    },
    {
      label: '团队管理',
      key: 'teams',
      icon: renderIcon(GroupFilled),
      children: myTeams.value
    }
  ]
})

onMounted(() => {
  let myTeamsId: string[] = myTeams?.value ? myTeams.value.map((t) => t.key) : []
  selectedMenuKey.value = teamStore.selectedTeamId
  if (selectedMenuKey.value && myTeamsId.includes(selectedMenuKey.value)) {
    router.push(`/team/${selectedMenuKey.value}`)
  }
})

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const selectedMenuKey = ref('')

const showAddTeam = ref(false)
const teamName = ref('')
const addTeam = async () => {
  if (!teamName.value) return
  const res = await createTeamApi({ name: teamName.value })
  if (res.data) {
    // 重新获取左侧团队列表
    await userStore.getMyInfo()
    selectedMenuKey.value = res.data
    teamStore.setSelectedTeamId(res.data)
    teamName.value = ''
    showAddTeam.value = false
    router.push(`/team/${res.data}`)
  }
}
const changeMenu = (key: string) => {
  if (key == 'addTeam') {
    // 创建团队
    showAddTeam.value = true
  } else {
    selectedMenuKey.value = key
    teamStore.setSelectedTeamId(key)
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
    padding-bottom: 40px;
  }
}
</style>
