<template>
  <div class="main-page">
    <HeaderNav></HeaderNav>
    <div class="content-block">
      <SlideNav></SlideNav>
      <div class="main-block">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import HeaderNav from '@/components/main/HeaderNav.vue'
import SlideNav from '@/components/main/SideNav.vue'
import { UserStore } from '@/store/module/user'

const userStore = UserStore()
onMounted(async () => {
  await userStore.getMyInfo()
  await userStore.getUnreadMessageCount()
})
</script>

<style scoped lang="scss">
.main-page {
  position: absolute;
  @include wh(100%, 100%);
  background-color: $color_bg_grey;
  .content-block {
    width: 100%;
    height: calc(100% - 60px);
    @include flex(row, center, center);
  }
  .main-block {
    height: 100%;
    width: calc(100% - 192px);
    overflow: scroll;
    overflow-y: scroll;
  }
}
</style>
