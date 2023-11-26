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
          ><n-button type="success" @click="showInviteDialog = true"> 添加成员 </n-button>
          <!-- 只有 creator 才可以解散 -->
          <n-button
            type="error"
            @click="dissolveTeamClick"
            v-if="creatorId == userStore.userInfo?._id"
          >
            解散团队
          </n-button></n-space
        >
      </div>
    </div>
    <!-- 成员列表 -->
    <div class="members">
      <p>成员列表 ({{ members.length }}) :</p>
      <div class="members-list">
        <div class="member-item" v-for="(item, index) in members" :key="index">
          <div class="tag">
            <n-tag :bordered="false" size="small" type="success" v-if="getItemRole(item)">
              {{ getItemRole(item) }}
            </n-tag>
            <n-tag
              :bordered="false"
              size="small"
              type="info"
              v-if="item._id == userStore.userInfo?._id"
            >
              自己
            </n-tag>
          </div>
          <div class="info">
            <p>
              {{ item.username }}
            </p>
            <p>{{ item.email }}</p>
            <!-- 【编辑权限 & 移除成员】操作，owner 那条不显示; 当前用户是manager或者owner才显示-->
            <div class="opt-icons" v-if="creatorId != item._id && myRole != ROLES.guest">
              <!-- 编辑权限 -->
              <n-popselect
                v-model:value="itemRole"
                :options="roleOptions"
                trigger="click"
                @update:value="changeItemRole"
              >
                <n-button quaternary circle type="info" @click="setItem(item)">
                  <template #icon>
                    <n-icon :size="20" :component="EditNoteRound" color="#18a058" />
                  </template>
                </n-button>
              </n-popselect>

              <!-- 移除成员 -->
              <n-button quaternary circle type="error" @click="removeMember(item)">
                <template #icon>
                  <n-icon :size="20" :component="DeleteSweepFilled" />
                </template>
              </n-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <n-modal v-model:show="showInviteDialog" preset="dialog" title="邀请成员" :show-icon="false">
    <div class="modal-wrapper">
      <n-select
        filterable
        placeholder="请输入用户名称或邮箱"
        :options="inviteUsers"
        :loading="searchInviteLoading"
        remote
        clearable
        v-model:value="inviteUserId"
        @search="changeInviteKeyword"
      />
      <n-radio-group v-model:value="inviteRole" name="radiogroup" size="small">
        <n-space>
          <n-radio :value="ROLES.manager">管理员</n-radio>
          <n-radio :value="ROLES.guest">访客</n-radio>
        </n-space>
      </n-radio-group>
    </div>
    <template #action>
      <n-space>
        <n-button type="default" @click="showInviteDialog = false"> 取消 </n-button
        ><n-button type="success" @click="confirmInvite"> 确定 </n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import { debounce } from 'lodash'
import {
  NInput,
  NButton,
  NIcon,
  NSpace,
  NTag,
  useMessage,
  useDialog,
  NPopselect,
  NModal,
  NSelect,
  NRadioGroup,
  NRadio
} from 'naive-ui'
import { EditNoteFilled, EditNoteRound, DeleteSweepFilled } from '@vicons/material'
import {
  getTeamByIdApi,
  updateTeamNameApi,
  dissolveTeamApi,
  removeMemberApi,
  changeRoleApi,
  inviteMemberApi
} from '@/api/module/team'
import { findUsersApi } from '@/api/module/user'
import { UserStore } from '@/store/module/user'
import { TeamStore } from '@/store/module/team'
import { ROLES } from '@/enum'

import { type Team } from '@/interface'
import { useRouter } from 'vue-router'
const message = useMessage()
const dialog = useDialog()
const router = useRouter()

const userStore = UserStore()

const myRole = computed(() => {
  const myId = userStore.userInfo?._id
  const me = members.value.filter((i) => i._id == myId)
  return me[0].role
})

const teamStore = TeamStore()

const props = defineProps<{
  teamId: string
}>()

const teamName = ref('')
const creatorId = ref('')
const members = ref<Team.Member[]>([])
const roleOptions = [
  {
    label: '管理员',
    value: ROLES.manager
  },
  {
    label: '访客',
    value: ROLES.guest
  }
]

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

// 修改团队名称
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

// 修改用户角色
const itemRole = ref('')
const itemId = ref('')
const selectMember = ref<Team.Member>()
const setItem = (item: Team.Member) => {
  itemRole.value = item.role
  itemId.value = item._id
  selectMember.value = item
}
const changeItemRole = async (v: string) => {
  if (v == selectMember.value?.role) return
  const res = await changeRoleApi(props.teamId, itemId.value, itemRole.value)
  if (res.data) {
    message.success('权限修改成功')
    await getTeam()
  }
}

// 移除成员
const removeMember = async (item: Team.Member) => {
  const content =
    item._id == userStore.userInfo?._id
      ? `确定要离开【${teamName.value}】吗？`
      : `确定要移除【${item.username}】吗？`
  dialog.warning({
    title: '警告',
    content: content,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      const res = await removeMemberApi(props.teamId, item._id)
      if (res && res.data) {
        message.success('移除成功')
        await getTeam()
      }
    }
  })
}

// 用户权限
const getItemRole = (item: Team.Member) => {
  return item.role === ROLES.owner ? '创建者' : item.role === ROLES.manager ? '管理员' : ''
}

// 邀请用户
const showInviteDialog = ref(false)
const searchInviteLoading = ref(false)
const inviteUsers = ref<{ label: string; value: string }[]>([])
const inviteUserId = ref(null)
const inviteRole = ref('')
const changeInviteKeyword = debounce(async (val: string) => {
  if (val) {
    searchInviteLoading.value = true
    const res = await findUsersApi(val)
    if (res.data) {
      inviteUsers.value = res.data.map((u) => {
        return {
          label: `${u.username} - ${u.email}`,
          value: u._id
        }
      })
    }
    searchInviteLoading.value = false
  } else {
    searchInviteLoading.value = false
    inviteUsers.value = []
  }
}, 500)
const confirmInvite = async () => {
  if (!inviteUserId.value || !inviteRole.value) return message.error('请选择完整信息')
  const res = await inviteMemberApi(props.teamId, inviteUserId.value, inviteRole.value)
  if (res && res.data) {
    message.success('邀请加入成功')
    await getTeam()
    showInviteDialog.value = false
  }
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
          width: 140px;
          .n-tag {
            margin-right: 10px;
          }
        }
        .info {
          @include flex(row, flex-start, center);
          p {
            width: 120px;
          }
          .opt-icons {
            margin-left: 28px;
            button {
              margin-right: 6px;
            }
          }
        }

        &:last-child {
          border-bottom: none;
        }
      }
    }
  }
}

.modal-wrapper {
  // width: 330px;
  margin: 30px 0;
  @include flex(column, flex-start, flex-start);
  .n-select {
    // width: 62%;
    margin-bottom: 20px;
  }
}
</style>
