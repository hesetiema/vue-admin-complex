<script setup lang="ts">
import DropDownList from './DropDownList.vue'
import { useRouter } from 'vue-router'
import { useCollapseStore } from '@/stores/collapse'
import { computed } from 'vue'

const store = useCollapseStore()
const router = useRouter()

const showDrawer = computed(() => store.status === 'drawer')

const switchDrawer = () => {
  if (store.drawer) {
    store.closeDrawer()
  } else {
    store.openDrawer()
  }
}

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
      <svg
        viewBox="64 64 896 896"
        focusable="false"
        data-icon="menu"
        width="1em"
        height="1em"
        fill="currentColor"
        aria-hidden="true"
        v-show="showDrawer"
        class="drawer-icon"
        @click="switchDrawer"
      >
        <path
          d="M904 160H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zm0 624H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zm0-312H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8z"
        ></path>
      </svg>
      <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="32" height="32" />
      <span class="title" v-show="!showDrawer">Vue Admin Complex</span>
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
  padding-inline: 24px;
  padding-block: 8px;
  border-bottom: 1px solid rgba(60, 60, 60, 0.12);
}

.drawer-icon {
  margin-right: 16px;
  cursor: pointer;
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
