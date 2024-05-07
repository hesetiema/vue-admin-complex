<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const matchedParentArr = computed(() => {
  const showArr = route.matched.filter((v) => !!v?.meta?.title)
  return showArr
})
</script>

<template>
  <el-breadcrumb separator="/" v-show="matchedParentArr.length > 1">
    <template v-for="item in matchedParentArr" :key="item.path">
      <el-breadcrumb-item v-if="item.meta.hideBreadCrumb">
        {{ item.meta.title ?? '' }}
      </el-breadcrumb-item>
      <el-breadcrumb-item v-else :to="{ path: item.path }">
        {{ item.meta.title ?? '' }}
      </el-breadcrumb-item>
    </template>
  </el-breadcrumb>
</template>

<style scoped>
.el-breadcrumb {
  margin-bottom: 24px;
}
</style>
