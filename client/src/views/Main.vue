<template>
  <div class="main-page">
    <HeaderNav></HeaderNav>
  </div>
</template>

<script lang="ts" setup>
import HeaderNav from '../components/apps/HeaderNav.vue'
</script>

<style scoped lang="scss">
.main-page {
  position: absolute;
  @include wh(100%, 100%);
  background-color: $color_bg_grey;
}
</style>
