<script lang="ts" setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="main-container">
    <div class="intro">
      <div>高级表单涉及的主要组件有：</div>
      <ul>
        <li>弹出层表单</li>
        <li>搜索表单</li>
        <li>分步表单</li>
        <li>动态增减嵌套表单与依赖联动</li>
      </ul>
    </div>
    <RouterView></RouterView>
  </div>
</template>

<style scoped>
.main-container {
  background-color: #fff;
  padding: 24px;
}
.intro {
  margin-bottom: 24px;
}
</style>
