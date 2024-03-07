<script setup lang="ts">
import { reactive } from 'vue'
import { Document, Menu as IconMenu, Location, Setting } from '@element-plus/icons-vue'

interface ISubMenuItem {
  groupTitle?: string
  children?: IMenuItem[]
  title?: string
  key?: string
}

interface IMenuItem {
  title: string
  key: string
  icon?: () => any
  children?: ISubMenuItem[]
  disabled?: boolean
}

const menuItems: IMenuItem[] = reactive([
  {
    title: '组件',
    icon: Location,
    key: '1',
    children: [
      {
        groupTitle: '列表',
        children: [
          { title: '普通列表', key: '1-1' },
          {
            title: '虚拟列表',
            key: '1-2'
          }
        ]
      },
      {
        groupTitle: '表单',
        children: [
          { title: '普通表单', key: '1-3' },
          {
            title: '嵌套表单',
            key: '1-4'
          }
        ]
      },
      {
        title: '文件上传',
        key: '1-5'
      },
      {
        title: '文本省略',
        key: '1-6'
      },
      {
        title: '图片裁剪',
        key: '1-7'
      }
    ]
  },
  {
    title: '常用功能',
    icon: IconMenu,
    key: '2',
    children: [
      {
        title: '水印',
        key: '2-1'
      },
      {
        title: '音乐播放器',
        key: '2-2'
      }
    ]
  },
  {
    title: '导航三',
    icon: Document,
    key: '3',
    disabled: true
  },
  {
    title: '导航四',
    icon: Setting,
    key: '4'
  }
])

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>

<template>
  <div class="aside-container">
    <el-menu
      default-active="2"
      class="el-menu-vertical-aside"
      @open="handleOpen"
      @close="handleClose"
    >
      <template v-for="menu in menuItems" :key="menu.key">
        <el-sub-menu :index="menu.key" :disabled="menu.disabled" v-if="menu?.children?.length">
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
  </div>
</template>

<style scoped>
.aside-container {
  height: 100%;
}

.el-menu-vertical-aside {
  height: 100%;
}
</style>
