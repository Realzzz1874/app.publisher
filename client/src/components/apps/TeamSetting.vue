<template>
  <div class="team-setting">
    <div class="name-wrapper">
      <div class="left">
        <span class="label">团队名称:</span>
        <template v-if="editable">
          <div class="name-input">
            <n-input v-model:value="teamName" type="text" placeholder="请输入团队名称" />
          </div>
          <n-space>
            <n-button strong secondary type="primary" @click="saveName"> 保存 </n-button>
            <n-button strong secondary type="tertiary" @click="editable = false"> 取消 </n-button>
          </n-space>
        </template>

        <div class="team-name" v-else>
          <span>{{ teamName }}</span>
          <n-button quaternary circle type="info" @click="editable = true">
            <template #icon>
              <n-icon :size="20" :component="EditNoteFilled" color="#18a058" />
            </template>
          </n-button>
        </div>
      </div>
      <div class="right">
        <n-space size="small"
          ><n-button type="success"> 邀请成员 </n-button>
          <n-button type="error" @click="dissolveTeamClick"> 解散团队 </n-button></n-space
        >
      </div>
    </div>
    <!-- 成员列表 -->
    <div class="members">
      <p>成员列表 ({{ members.length }}) :</p>
      <div class="members-list">
        <div class="member-item" v-for="(item, index) in members" :key="index">
          <div class="tag">
            <n-tag :bordered="false" size="small" type="success" v-if="item._id == creatorId">
              创建者
            </n-tag>
          </div>
          <n-space>
            <p>
              {{ item.username }}
            </p>
            <span>{{ item.email }}</span></n-space
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { NInput, NButton, NIcon, NSpace, NTag, useMessage, useDialog } from 'naive-ui'
import { EditNoteFilled } from '@vicons/material'
import { getTeamByIdApi, updateTeamNameApi, dissolveTeamApi } from '@/api/module/team'
import { UserStore } from '@/store/module/user'
import { TeamStore } from '@/store/module/team'

import { type Team } from '@/interface'
import { useRouter } from 'vue-router'
const message = useMessage()
const dialog = useDialog()
const router = useRouter()

const userStore = UserStore()
const teamStore = TeamStore()

const props = defineProps<{
  teamId: string
}>()
const teamName = ref('')
const creatorId = ref('')
const members = ref<Team.Member[]>([])

onMounted(async () => {
  await getTeam()
})

watch(
  () => props.teamId,
  async () => {
    await getTeam()
  }
)

const getTeam = async () => {
  const res = await getTeamByIdApi(props.teamId)
  if (res.data) {
    const d = res.data
    teamName.value = d.name
    creatorId.value = d.creatorId
    members.value = d.members
  }
}

const editable = ref(false)
const saveName = async () => {
  if (teamName.value) {
    const res = await updateTeamNameApi({ teamId: props.teamId, name: teamName.value })
    if (res.data) {
      editable.value = false
      // 重新获取左侧团队列表
      await userStore.getMyInfo()
    }
  }
}

// 解散团队
const dissolveTeamClick = async () => {
  dialog.warning({
    title: '警告',
    content: '确定解散该团队吗？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      const res = await dissolveTeamApi(props.teamId)
      if (res.data) {
        message.success('已解散')
        teamStore.setSelectedTeamId('')
        // 重新获取左侧团队列表
        await userStore.getMyInfo()
        router.push('/team')
      }
    }
  })
}
</script>

<style scoped lang="scss">
.team-setting {
  // padding: 8px 10px;
  height: 100%;

  .name-wrapper {
    @include flex(row, space-between, center);
    line-height: 30px;
    background-color: $color_bg_white;
    padding-left: 10px;
    height: 60px;
    .left {
      @include flex(row, flex-start, center);
      .label {
        margin-right: 8px;
      }
      .name-input {
        width: 200px;
        margin-right: 8px;
      }
      .team-name {
        @include flex(row, flex-start, center);
        font-size: 16px;
        color: $color_font_black;
        span {
          margin-right: 8px;
        }
      }
    }
    .right {
      @include flex(row, flex-end, center);
      margin-right: 10px;
    }
  }

  .members {
    margin-top: 20px;
    height: calc(100vh - 224px);
    background-color: $color_bg_white;
    // border-radius: 8px;
    padding: 10px;
    overflow-y: scroll;

    .members-list {
      margin-top: 10px;
      padding-bottom: 40px;
      .member-item {
        @include flex(row, flex-start, center);
        height: 48px;
        border-bottom: 1px solid $color_divider;
        .tag {
          width: 100px;
        }
        p {
          width: 120px;
        }
        span {
          color: $color_font_second;
          width: 120px;
        }
        &:last-child {
          border-bottom: none;
        }
      }
    }
  }
}
</style>
