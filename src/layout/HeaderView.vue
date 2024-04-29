<script setup lang="ts">
import DropDownList from './DropDownList.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const dropdownLists = [
  {
    title: '退出登录',
    onClick: () => {
      router.push('/')
    }
  }
]
</script>

<template>
  <div class="wrapper">
    <div class="logo-container">
      <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="32" height="32" />
      <span class="title">Vue Admin Complex</span>
    </div>
    <div class="right-container">
      <div class="tools"></div>
      <div class="user-info">
        <img alt="user avatar" class="avatar" src="@/assets/avatar.png" width="32" height="32" />
        <DropDownList title="admin user" :list="dropdownLists" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-inline: 40px;
  padding-block: 8px;
  border-bottom: 1px solid rgba(60, 60, 60, 0.12);
}

.logo-container {
  display: flex;
  align-items: center;
}

.logo {
  width: 32px;
  height: auto;
}

.title {
  font-size: 14px;
  font-weight: 600;
  margin-left: 12px;
}

.right-container {
  display: flex;
  align-items: center;
  column-gap: 10px;
}

.user-info {
  display: flex;
  align-items: center;
  column-gap: 10px;
}
</style>
