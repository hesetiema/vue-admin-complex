<script setup lang="ts">
import { reactive, markRaw, ref, onMounted, onUnmounted } from 'vue'
import { Histogram, Menu as IconMenu, ElementPlus, Setting } from '@element-plus/icons-vue'
import type { ComponentPublicInstance } from 'vue'
import { useRoute } from 'vue-router'
import { useCollapseStore } from '@/stores/collapse'

interface IItemBase {
  title: string
  key: string
}

interface ISubMenuItem extends Partial<IItemBase> {
  groupTitle?: string
  children?: IItemBase[]
  icon?: ComponentPublicInstance
}

interface IMenuItem extends IItemBase {
  icon?: ComponentPublicInstance
  children?: ISubMenuItem[]
  disabled?: boolean
}

const rawComponent = (myComponent) => markRaw(myComponent)
const defaultItems: IMenuItem[] = [
  {
    title: 'DashBoard',
    icon: rawComponent(Histogram),
    key: 'index'
  },
  {
    title: '组件',
    icon: rawComponent(ElementPlus),
    key: 'component',
    children: [
      {
        groupTitle: '列表',
        children: [
          { title: '普通列表', key: 'base-table' },
          {
            title: '高级列表',
            key: 'advanced-table'
          }
        ]
      },
      {
        groupTitle: '表单',
        children: [
          { title: '普通表单', key: 'base-form' },
          {
            title: '高级表单',
            key: 'advanced-form'
          }
        ]
      },
      {
        title: '文件上传',
        key: 'file-upload'
      },
      {
        title: '文本省略',
        key: 'text-ellipsis'
      },
      {
        title: '图片裁剪',
        key: 'img-crop'
      }
    ]
  },
  {
    title: '常用功能',
    icon: rawComponent(IconMenu),
    key: '2',
    children: [
      {
        title: '水印',
        key: 'watermark'
      },
      {
        title: '音乐播放器',
        key: 'player'
      }
    ]
  },
  {
    title: '其他功能',
    icon: rawComponent(Setting),
    key: 'other-func'
  }
]
const menuItems = reactive(defaultItems)

const route = useRoute()
const isCollapse = ref(true)
const store = useCollapseStore()

const toggleCollapse = (flag?: boolean) => {
  if (typeof flag === 'boolean') {
    isCollapse.value = flag
    store.switch(flag)
  } else {
    const newVal = !isCollapse.value
    isCollapse.value = newVal
    store.switch(newVal)
  }
}

const handleEvent = (event) => {
  if (['collapse', 'expand'].includes(event.detail)) {
    const isCollapseEvent = event.detail === 'collapse'
    toggleCollapse(isCollapseEvent)
  }
}

onMounted(() => {
  window.addEventListener('collapse-aside-menu', handleEvent)
})

onUnmounted(() => {
  window.addEventListener('collapse-aside-menu', handleEvent)
})
</script>

<template>
  <div class="aside-container">
    <el-scrollbar
      class="aside-menu-container"
      :wrap-style="{ width: store.collapse ? '64px' : 'auto' }"
      height="100%"
    >
      <el-menu
        :default-active="route.name?.toString()"
        :collapse="isCollapse"
        router
        class="aside-menu-vertical"
        :collapse-transition="false"
      >
        <template v-for="menu in menuItems" :key="menu.key">
          <el-sub-menu
            :index="menu.key"
            :disabled="menu.disabled"
            v-if="menu?.children?.length"
            :teleported="true"
          >
            <template #title>
              <el-icon v-if="menu?.icon">
                <component :is="menu?.icon" />
              </el-icon>
              <span>{{ menu.title }}</span>
            </template>

            <template v-for="submenu in menu.children" :key="submenu?.key || submenu?.groupTitle">
              <el-menu-item-group :title="submenu?.groupTitle" v-if="submenu?.groupTitle">
                <template v-if="submenu?.children?.length">
                  <template v-for="child in submenu.children" :key="child?.key">
                    <el-menu-item :index="child.key">{{ child.title }}</el-menu-item>
                  </template>
                </template>
                <el-menu-item :index="submenu.key" v-else>{{ submenu.title }}</el-menu-item>
              </el-menu-item-group>

              <el-sub-menu :index="submenu?.key" v-else-if="submenu?.children?.length">
                <template #title>{{ submenu?.title }}</template>

                <template v-for="child in submenu.children" :key="child?.key">
                  <el-menu-item :index="child.key">{{ child.title }}</el-menu-item>
                </template>
              </el-sub-menu>

              <el-menu-item :index="submenu?.key" v-else>
                <el-icon v-if="submenu?.icon">
                  <component :is="submenu?.icon" />
                </el-icon>
                <span>{{ submenu?.title }}</span>
              </el-menu-item>
            </template>
          </el-sub-menu>
          <el-menu-item :index="menu.key" :disabled="menu.disabled" v-else>
            <el-icon v-if="menu?.icon">
              <component :is="menu?.icon" />
            </el-icon>
            <span>{{ menu.title }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </el-scrollbar>
    <div class="aside-collapse" @click="() => toggleCollapse()">
      <svg
        data-v-912602da=""
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        aria-hidden="true"
        role="img"
        class="ml-4 mb-1 w-[16px] h-[16px] inline-block align-middle cursor-pointer duration-[100ms] text-primary"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        :style="{ transform: isCollapse ? 'none' : `rotateY(180deg)`, outline: 'none' }"
      >
        <path
          fill="currentColor"
          d="M21 18v2H3v-2h18ZM6.95 3.55v9.9L2 8.5l4.95-4.95ZM21 11v2h-9v-2h9Zm0-7v2h-9V4h9Z"
        ></path>
      </svg>
    </div>
  </div>
</template>

<style scoped>
.aside-container {
  position: relative;
  padding-bottom: 40px;
  background-color: #fff;
  height: 100%;
}

.aside-menu-container {
  border-right: 1px solid var(--el-menu-border-color);
}

.el-menu {
  border-right: none;
}

.aside-collapse {
  cursor: pointer;
  position: absolute;
  bottom: 0px;
  left: 0;
  width: 100%;
  height: 40px;
  line-height: 40px;
  display: grid;
  place-items: center;
  box-shadow: 0 0 6px -3px var(--el-color-primary);
  border-right: 1px solid var(--el-menu-border-color);
}
</style>
