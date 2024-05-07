<script lang="ts" setup>
import HeaderView from './HeaderView.vue'
import AsideView from './AsideView.vue'
import BreadCrumb from './BreadCrumb.vue'
import { RouterView } from 'vue-router'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useCollapseStore } from '@/stores/collapse'

const containerRef = ref()
const store = useCollapseStore()

const showDrawer = computed(() => store.status === 'drawer')
const isDrawerOpen = computed(() => store.drawer)
const isCollapse = computed(() => store.collapse)

const handleWidthChange = (width: number) => {
  /**
   * 0 < width <= 760 隐藏侧边栏
   * 760 < width <= 990 折叠侧边栏
   * width > 990 展开侧边栏
   */
  if (width > 0 && width <= 760) {
    store.setStatus('drawer')
    store.closeDrawer()
  } else if (width > 760 && width <= 990) {
    store.setStatus('collapse')
    store.switch(true)
  } else {
    store.setStatus('collapse')
    store.switch(false)
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
</script>

<template>
  <div class="common-layout-container" id="common-layout-container-id" ref="containerRef">
    <el-container class="common-layout">
      <el-header>
        <HeaderView />
      </el-header>

      <el-scrollbar height="100%">
        <el-container>
          <el-drawer
            v-if="showDrawer"
            v-model="isDrawerOpen"
            direction="ltr"
            size="164"
            :with-header="false"
            @open="store.openDrawer"
            @close="store.closeDrawer"
            class="aside-drawer"
          >
            <AsideView />
          </el-drawer>
          <el-aside v-else :style="{ width: isCollapse ? '64px' : '164px' }">
            <AsideView />
          </el-aside>
          <el-main
            :style="{
              'margin-left': showDrawer ? '0px' : isCollapse ? '64px' : '164px'
            }"
          >
            <BreadCrumb />
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

:deep(.el-drawer__body) {
  padding: 0;
}
</style>
