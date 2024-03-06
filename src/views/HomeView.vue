<script lang="ts" setup>
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <header>
    <div class="wrapper">
      <div class="logo-container">
        <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="32" height="32" />
        <span class="title">Vue Admin Complex</span>
      </div>
      <nav>
        <RouterLink to="/home/about">关于</RouterLink>
        <RouterLink to="/home/faq">FAQ</RouterLink>
      </nav>
    </div>
  </header>
  <RouterView></RouterView>
</template>

<style scoped>
.wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 48px;
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

nav {
  font-size: 1rem;
  display: flex;
  align-items: center;
  column-gap: 2rem;
}
</style>
