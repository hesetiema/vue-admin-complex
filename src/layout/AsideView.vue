<script setup lang="ts">
import { reactive, markRaw, computed } from 'vue'
import { Histogram, Menu as IconMenu, ElementPlus, Setting } from '@element-plus/icons-vue'
import type { ComponentPublicInstance } from 'vue'
import { useRoute } from 'vue-router'
import { useCollapseStore } from '@/stores/collapse'

interface IItemBase {
  title: string
  key: string
  children?: IItemBase[]
  index?: string
}

interface ISubMenuItem extends Partial<IItemBase> {
  groupTitle?: string
  children?: IItemBase[]
  icon?: ComponentPublicInstance
}

interface IMenuItem extends Omit<IItemBase, 'children'> {
  icon?: ComponentPublicInstance
  children?: ISubMenuItem[]
  disabled?: boolean
}

const rawComponent = (myComponent) => markRaw(myComponent)
const defaultItems: IMenuItem[] = [
  {
    title: 'DashBoard',
    icon: rawComponent(Histogram),
    key: 'index',
    index: '/admin'
  },
  {
    title: '组件',
    icon: rawComponent(ElementPlus),
    key: 'component',
    children: [
      {
        groupTitle: '列表',
        children: [
          { title: '普通列表', key: 'base-table', index: '/admin/base-table' },
          {
            title: '高级列表',
            key: 'advanced-table',
            index: '/admin/advanced-table'
          }
        ]
      },
      {
        groupTitle: '表单',
        children: [
          { title: '普通表单', key: 'base-form', index: '/admin/base-form' },
          {
            title: '高级表单',
            key: 'advanced-form',
            children: [
              {
                title: '弹出层表单',
                key: 'modal',
                index: '/admin/advanced-form/modal'
              },
              {
                title: '搜索表单',
                key: 'search',
                index: '/admin/advanced-form/search'
              },
              {
                title: '分步表单',
                key: 'step',
                index: '/admin/advanced-form/step'
              },
              {
                title: '嵌套表单',
                key: 'nest',
                index: '/admin/advanced-form/nest'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    title: '常用功能',
    icon: rawComponent(IconMenu),
    key: '2',
    children: [
      {
        title: '文件上传',
        key: 'file-upload',
        index: '/admin/file-upload'
      },
      {
        title: '图片裁剪',
        key: 'img-crop',
        index: '/admin/img-crop'
      },
      {
        title: '水印',
        key: 'watermark',
        index: '/admin/watermark'
      },
      {
        title: '音乐播放器',
        key: 'player',
        index: '/admin/player'
      }
    ]
  },
  {
    title: '其他功能',
    icon: rawComponent(Setting),
    key: 'other-func',
    index: '/admin/other-func'
  }
]
const menuItems = reactive(defaultItems)

const flattenTree = (root) => {
  const flattened = []
  const stack = [root]
  while (stack.length > 0) {
    const node = stack.pop()
    if (!Array.isArray(node)) {
      flattened.push(node)
    }
    for (let i = node.length - 1; i >= 0; i--) {
      if (node[i]?.index) {
        stack.push(node[i])
      }
      if (node[i]?.children?.length) {
        stack.push(node[i]?.children)
      }
    }
  }
  return flattened
}

const route = useRoute()
const activeIndex = computed(() => {
  const current = route.path
  const flattenMenus = flattenTree(defaultItems)
  const flattenMenuPaths = flattenMenus.map((v) => v.index)

  let matchedPath = current
  if (!flattenMenuPaths.includes(current)) {
    const matched = [...route.matched]
    while (matched.length > 0) {
      const node = matched.pop()
      if (flattenMenuPaths.includes(node.path)) {
        matchedPath = node.path
        break
      }
    }
  }
  return matchedPath
})

const store = useCollapseStore()
const showCollapse = computed(() => store.status === 'collapse')
const isCollapse = computed(() => store.status === 'collapse' && store.collapse)

const toggleCollapse = () => {
  store.setStatus('collapse')
  store.switch()
}
</script>

<template>
  <div class="aside-container" :style="{ paddingBottom: showCollapse ? '40px' : '0px' }">
    <el-scrollbar
      class="aside-menu-container"
      :wrap-style="{ width: showCollapse ? (isCollapse ? '64px' : 'auto') : 'auto' }"
      height="100%"
    >
      <el-menu
        :default-active="activeIndex"
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
                    <template v-if="child?.children?.length">
                      <el-sub-menu :index="child.key">
                        <template #title>{{ child.title }}</template>
                        <template v-for="grandChild in child.children" :key="grandChild?.key">
                          <el-menu-item :index="grandChild.index">{{
                            grandChild.title
                          }}</el-menu-item>
                        </template>
                      </el-sub-menu>
                    </template>
                    <el-menu-item v-else :index="child?.index">{{ child.title }}</el-menu-item>
                  </template>
                </template>
                <el-menu-item :index="submenu.index" v-else>{{ submenu.title }}</el-menu-item>
              </el-menu-item-group>

              <el-sub-menu :index="submenu.key" v-else-if="submenu?.children?.length">
                <template #title>{{ submenu?.title }}</template>

                <template v-for="child in submenu.children" :key="child?.key">
                  <template v-if="child?.children?.length">
                    <el-sub-menu :index="child.key">
                      <template #title>{{ child.title }}</template>
                      <template v-for="grandChild in child.children" :key="grandChild?.key">
                        <el-menu-item :index="grandChild.index">{{
                          grandChild.title
                        }}</el-menu-item>
                      </template>
                    </el-sub-menu>
                  </template>
                  <el-menu-item v-else :index="child.index">{{ child.title }}</el-menu-item>
                </template>
              </el-sub-menu>

              <el-menu-item :index="submenu?.index" v-else>
                <el-icon v-if="submenu?.icon">
                  <component :is="submenu?.icon" />
                </el-icon>
                <span>{{ submenu?.title }}</span>
              </el-menu-item>
            </template>
          </el-sub-menu>
          <el-menu-item :index="menu.index" :disabled="menu.disabled" v-else>
            <el-icon v-if="menu?.icon">
              <component :is="menu?.icon" />
            </el-icon>
            <span>{{ menu.title }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </el-scrollbar>
    <div class="aside-collapse" @click="toggleCollapse" v-show="showCollapse">
      <el-icon v-if="isCollapse"><Expand /></el-icon>
      <el-icon v-else><Fold /></el-icon>
    </div>
  </div>
</template>

<style scoped>
.aside-container {
  position: relative;
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
