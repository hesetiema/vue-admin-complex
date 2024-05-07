<script lang="ts" setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="main-container">
    <div class="intro">
      <div>高级表单涉及的主要组件有：</div>
      <ul>
        <li>单行输入框</li>
        <li>下拉选择框</li>
        <li>日期时间选择框</li>
        <li>切换、多选、单选、多行文本</li>
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
