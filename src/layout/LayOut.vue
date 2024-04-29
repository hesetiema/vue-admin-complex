<script lang="ts" setup>
import HeaderView from './HeaderView.vue'
import AsideView from './AsideView.vue'
import { RouterView } from 'vue-router'
import { onMounted, onUnmounted, ref } from 'vue'
import { useCollapseStore } from '@/stores/collapse'

const containerRef = ref()

const handleWidthChange = (width: number) => {
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
const resizeObserver = new ResizeObserver((entries) => {
  for (const entry of entries) {
    let width = 0
    if (entry.contentBoxSize) {
      // Firefox implements `contentBoxSize` as a single content rect, rather than an array
      const contentBoxSize = Array.isArray(entry.contentBoxSize)
        ? entry.contentBoxSize[0]
        : entry.contentBoxSize

      width = contentBoxSize.inlineSize
    } else {
      width = entry.contentRect.width
    }
    if (width) {
      handleWidthChange(width)
    }
  }
})

onMounted(() => {
  if (containerRef.value) {
    const containerRect = window.getComputedStyle(containerRef.value)
    if (containerRect.width) {
      handleWidthChange(parseInt(containerRect.width))
    }
    resizeObserver.observe(containerRef.value)
  }
})
onUnmounted(() => {
  if (containerRef.value) {
    resizeObserver.unobserve(containerRef.value)
  }
})

const store = useCollapseStore()
</script>

<template>
  <div class="common-layout-container" id="common-layout-container-id" ref="containerRef">
    <el-container class="common-layout">
      <el-header>
        <HeaderView />
      </el-header>

      <el-scrollbar height="100%">
        <el-container>
          <el-aside :style="{ width: store.collapse ? '64px' : '164px' }">
            <AsideView />
          </el-aside>
          <el-main :style="{ 'margin-left': store.collapse ? '64px' : '164px' }">
            <RouterView></RouterView>
          </el-main>
        </el-container>
      </el-scrollbar>
    </el-container>
  </div>
</template>

<style scoped>
.common-layout-container {
  height: 100vh;
}

.common-layout {
  height: 100%;
  background-color: #f7f6fa;
}

.el-main {
  padding: 24px;
}

.el-header {
  padding: 0;
  position: sticky;
  top: 0;
  z-index: 50;
  background-color: #fff;
}

.el-aside {
  position: fixed;
  left: 0;
  top: 60px;
  bottom: 0;
}
</style>
