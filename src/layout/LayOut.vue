<script setup>
import HeaderView from './HeaderView.vue'
import AsideView from './AsideView.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="common-layout-container">
    <el-container class="common-layout">
      <el-header>
        <HeaderView />
      </el-header>

      <el-container>
        <el-aside width="200px">
          <AsideView />
        </el-aside>
        <el-main>
          <RouterView></RouterView>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
.common-layout-container {
  height: 100vh;
}
.common-layout {
  height: 100%;
}
.el-header {
  padding: 0;
  position: sticky;
  top: 0;
  z-index: 50;
  background-color: #fff;
}
</style>
