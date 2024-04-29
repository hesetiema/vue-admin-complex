<script setup lang="ts">
import HeaderView from './HeaderView.vue'
import AsideView from './AsideView.vue'
import { RouterView } from 'vue-router'
import { onMounted, onUnmounted, ref } from 'vue'

const containerRef = ref()
const resizeObserver = new ResizeObserver((entries) => {
  for (const entry of entries) {
    let width
    if (entry.contentBoxSize) {
      // Firefox implements `contentBoxSize` as a single content rect, rather than an array
      const contentBoxSize = Array.isArray(entry.contentBoxSize)
        ? entry.contentBoxSize[0]
        : entry.contentBoxSize

      width = contentBoxSize.inlineSize
    } else {
      width = entry.contentRect.width
    }

    /**
     * 0 < width <= 760 隐藏侧边栏
     * 760 < width <= 990 折叠侧边栏
     * width > 990 展开侧边栏
     */
    if (width > 0 && width <= 760) {
      window.dispatchEvent(
        new CustomEvent('collapse-aside-menu', {
          detail: 'hide'
        })
      )
    } else if (width > 760 && width <= 990) {
      window.dispatchEvent(
        new CustomEvent('collapse-aside-menu', {
          detail: 'collapse'
        })
      )
    } else {
      window.dispatchEvent(
        new CustomEvent('collapse-aside-menu', {
          detail: 'expand'
        })
      )
    }
  }
})

onMounted(() => {
  if (containerRef.value) {
    resizeObserver.observe(containerRef.value)
  }
})
onUnmounted(() => {
  if (containerRef.value) {
    resizeObserver.unobserve(containerRef.value)
  }
})
</script>

<template>
  <div class="common-layout-container" ref="containerRef">
    <el-container class="common-layout">
      <el-header>
        <HeaderView />
      </el-header>

      <el-container>
        <el-aside>
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

.el-main {
  padding: 24px;
  background-color: #f7f6fa;
}

.el-header {
  padding: 0;
  position: sticky;
  top: 0;
  z-index: 50;
  background-color: #fff;
}

.el-aside {
  width: fit-content;
}
</style>
