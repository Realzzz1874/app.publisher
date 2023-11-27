<template>
  <div class="message-list">
    <n-tabs type="line" animated pane-style="height: 100%;" pane-wrapper-style="height: 100%;">
      <n-tab-pane name="unread" :tab="'未读(' + unreadMessageList.length + ')'">
        <div class="unread-list">
          <n-scrollbar style="max-height: 100%"
            ><div class="unread-item" v-for="(message, index) in unreadMessageList" :key="index">
              <span class="time">{{ convertDateFormat(`${message.sendAt}`) }}</span>
              <p class="content">{{ message.content }}</p>
            </div></n-scrollbar
          >
        </div>
      </n-tab-pane>
      <n-tab-pane name="read" :tab="'已读(' + readMessageCount + ')'">
        <div class="read-list">
          <n-scrollbar style="max-height: 100%">
            <div class="read-item" v-for="(message, index) in readMessageList" :key="index">
              <span class="time">{{ convertDateFormat(`${message.sendAt}`) }}</span>
              <p class="content">{{ message.content }}</p>
            </div>
          </n-scrollbar>
          <div class="pager" v-if="readMessageCount > pageSize">
            <n-pagination
              size="small"
              v-model:page="messagePager"
              :item-count="readMessageCount"
              :page-size="pageSize"
              @update:page="changePage"
            />
          </div>
        </div>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { NTabs, NTabPane, NScrollbar, NPagination, useMessage } from 'naive-ui'
import { format } from 'date-fns-tz'
import { getUnreadMessagesApi, getReadMessagesApi, readMessagesApi } from '@/api/module/message'
import type { Message } from '@/interface'
const message = useMessage()

const mockData = [
  {
    category: 'member',
    content: 'lisi3 已解散【dddd】',
    receiverId: '655f34eb9894b8a8551f74df',
    sendAt: '2023-11-27T01:36:14.205Z',
    senderId: '65546c74661b53e7963f7b80',
    status: 'unread',
    __v: 0,
    _id: '6563f28e80edc4e9247250fc'
  },
  {
    category: 'member',
    content: 'lisi3 已解散【dddd】',
    receiverId: '655f34eb9894b8a8551f74df',
    sendAt: '2023-11-27T01:36:14.205Z',
    senderId: '65546c74661b53e7963f7b80',
    status: 'unread',
    __v: 0,
    _id: '6563f28e80edc4e9247250fc'
  },
  {
    category: 'member',
    content: 'lisi3 已解散【dddd】',
    receiverId: '655f34eb9894b8a8551f74df',
    sendAt: '2023-11-27T01:36:14.205Z',
    senderId: '65546c74661b53e7963f7b80',
    status: 'unread',
    __v: 0,
    _id: '6563f28e80edc4e9247250fc'
  },
  {
    category: 'member',
    content: 'lisi3 已解散【dddd】',
    receiverId: '655f34eb9894b8a8551f74df',
    sendAt: '2023-11-27T01:36:14.205Z',
    senderId: '65546c74661b53e7963f7b80',
    status: 'unread',
    __v: 0,
    _id: '6563f28e80edc4e9247250fc'
  },
  {
    category: 'member',
    content: 'lisi3 已解散【dddd】',
    receiverId: '655f34eb9894b8a8551f74df',
    sendAt: '2023-11-27T01:36:14.205Z',
    senderId: '65546c74661b53e7963f7b80',
    status: 'unread',
    __v: 0,
    _id: '6563f28e80edc4e9247250fc'
  },
  {
    category: 'member',
    content: 'lisi3 已解散【dddd】',
    receiverId: '655f34eb9894b8a8551f74df',
    sendAt: '2023-11-27T01:36:14.205Z',
    senderId: '65546c74661b53e7963f7b80',
    status: 'unread',
    __v: 0,
    _id: '6563f28e80edc4e9247250fc'
  },
  {
    category: 'member',
    content: 'lisi3 已解散【dddd】',
    receiverId: '655f34eb9894b8a8551f74df',
    sendAt: '2023-11-27T01:36:14.205Z',
    senderId: '65546c74661b53e7963f7b80',
    status: 'unread',
    __v: 0,
    _id: '6563f28e80edc4e9247250fc'
  },
  {
    category: 'member',
    content: 'lisi3 已解散【dddd】',
    receiverId: '655f34eb9894b8a8551f74df',
    sendAt: '2023-11-27T01:36:14.205Z',
    senderId: '65546c74661b53e7963f7b80',
    status: 'unread',
    __v: 0,
    _id: '6563f28e80edc4e9247250fc'
  },
  {
    category: 'member',
    content: 'lisi3 已解散【dddd】',
    receiverId: '655f34eb9894b8a8551f74df',
    sendAt: '2023-11-27T01:36:14.205Z',
    senderId: '65546c74661b53e7963f7b80',
    status: 'unread',
    __v: 0,
    _id: '6563f28e80edc4e9247250fc'
  },
  {
    category: 'member',
    content: 'lisi3 已解散【dddd】',
    receiverId: '655f34eb9894b8a8551f74df',
    sendAt: '2023-11-27T01:36:14.205Z',
    senderId: '65546c74661b53e7963f7b80',
    status: 'unread',
    __v: 0,
    _id: '6563f28e80edc4e9247250fc'
  },
  {
    category: 'member',
    content: 'lisi3 已解散【dddd】',
    receiverId: '655f34eb9894b8a8551f74df',
    sendAt: '2023-11-27T01:36:14.205Z',
    senderId: '65546c74661b53e7963f7b80',
    status: 'unread',
    __v: 0,
    _id: '6563f28e80edc4e9247250fc'
  },
  {
    category: 'member',
    content: 'lisi3 已解散【dddd】',
    receiverId: '655f34eb9894b8a8551f74df',
    sendAt: '2023-11-27T01:36:14.205Z',
    senderId: '65546c74661b53e7963f7b80',
    status: 'unread',
    __v: 0,
    _id: '6563f28e80edc4e9247250fc'
  },
  {
    category: 'member',
    content: 'lisi3 已解散【dddd】',
    receiverId: '655f34eb9894b8a8551f74df',
    sendAt: '2023-11-27T01:36:14.205Z',
    senderId: '65546c74661b53e7963f7b80',
    status: 'unread',
    __v: 0,
    _id: '6563f28e80edc4e9247250fc'
  },
  {
    category: 'member',
    content: 'lisi3 已解散【dddd】',
    receiverId: '655f34eb9894b8a8551f74df',
    sendAt: '2023-11-27T01:36:14.205Z',
    senderId: '65546c74661b53e7963f7b80',
    status: 'unread',
    __v: 0,
    _id: '6563f28e80edc4e9247250fc'
  },
  {
    category: 'member',
    content: 'lisi3 已解散【dddd】',
    receiverId: '655f34eb9894b8a8551f74df',
    sendAt: '2023-11-27T01:36:14.205Z',
    senderId: '65546c74661b53e7963f7b80',
    status: 'unread',
    __v: 0,
    _id: '6563f28e80edc4e9247250fc'
  },
  {
    category: 'member',
    content: 'lisi3 已解散【dddd】',
    receiverId: '655f34eb9894b8a8551f74df',
    sendAt: '2023-11-27T01:36:14.205Z',
    senderId: '65546c74661b53e7963f7b80',
    status: 'unread',
    __v: 0,
    _id: '6563f28e80edc4e9247250fc'
  },
  {
    category: 'member',
    content: 'lisi3 已解散【dddd】',
    receiverId: '655f34eb9894b8a8551f74df',
    sendAt: '2023-11-27T01:36:14.205Z',
    senderId: '65546c74661b53e7963f7b80',
    status: 'unread',
    __v: 0,
    _id: '6563f28e80edc4e9247250fc'
  },
  {
    category: 'member',
    content: 'lisi3 已解散【dddd】',
    receiverId: '655f34eb9894b8a8551f74df',
    sendAt: '2023-11-27T01:36:14.205Z',
    senderId: '65546c74661b53e7963f7b80',
    status: 'unread',
    __v: 0,
    _id: '6563f28e80edc4e9247250fc'
  },
  {
    category: 'member',
    content: 'lisi3 已解散【dddd】',
    receiverId: '655f34eb9894b8a8551f74df',
    sendAt: '2023-11-27T01:36:14.205Z',
    senderId: '65546c74661b53e7963f7b80',
    status: 'unread',
    __v: 0,
    _id: '6563f28e80edc4e9247250fc'
  },
  {
    category: 'member',
    content: 'lisi3 已解散【dddd】',
    receiverId: '655f34eb9894b8a8551f74df',
    sendAt: '2023-11-27T01:36:14.205Z',
    senderId: '65546c74661b53e7963f7b80',
    status: 'unread',
    __v: 0,
    _id: '6563f28e80edc4e9247250fc'
  }
]

onMounted(async () => {
  await getUnreadMessage()
  await getReadMessage()
})

onUnmounted(async () => {
  if (unreadMessageList.value.length) {
    await read()
  }
})

// 获取未读消息
const unreadMessageList = ref<Message.MessageItem[]>([])
const getUnreadMessage = async () => {
  const res = await getUnreadMessagesApi()
  unreadMessageList.value = res.data && res.data.length ? res.data : []
}

// 获取已读消息
const readMessageList = ref<Message.MessageItem[]>([])
const readMessageCount = ref(0)
const messagePager = ref(1)
const pageSize = ref(20)
const getReadMessage = async () => {
  const res = await getReadMessagesApi(messagePager.value, pageSize.value)
  if (res.data) {
    readMessageCount.value = res.data.total
    readMessageList.value = res.data.list || []
  }
}
const changePage = async (page: number) => {
  messagePager.value = page
  await getReadMessage()
}

// 将消息标记为已读
const read = async () => {
  const messageIds = unreadMessageList.value.map((m) => m._id)
  const res = await readMessagesApi(messageIds)
  if (res && res.data) {
    // message.success('操作成功')
    await getUnreadMessage()
    await getReadMessage()
  }
}

// 格式化时间
const convertDateFormat = (originalDate: string): string => {
  const targetTimeZone = 'Asia/Shanghai'
  const date = new Date(originalDate)
  return format(date, 'yyyy-MM-dd HH:mm:ss', { timeZone: targetTimeZone })
}
</script>

<style scoped lang="scss">
.message-list {
  height: 100%;
  .n-tabs {
    height: 100%;
  }
}
.unread-list,
.read-list {
  padding-bottom: 40px;
  height: 100%;
  position: relative;
  .unread-item,
  .read-item {
    @include flex(row, flex-start, center);
    margin-top: 10px;
    .time {
      color: $color_font_second;
      font-size: 10px;
      width: 136px;
    }
    .content {
      color: $color_font_black;
      font-size: 12px;
    }
  }

  .pager {
    @include flex(row, flex-end, center);
  }
}
</style>
