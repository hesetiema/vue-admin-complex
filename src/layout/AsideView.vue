<script setup lang="ts">
import { reactive, markRaw } from 'vue'
import { Histogram, Menu as IconMenu, ElementPlus, Setting } from '@element-plus/icons-vue'
import type { ComponentPublicInstance } from 'vue'
import { useRoute } from 'vue-router'

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

const rawComponent = (myComponent) => markRaw(myComponent);
const menuItems: IMenuItem[] = reactive([
  {
    title: 'DashBoard',
    icon: rawComponent(Histogram),
    key: 'index',
  },
  {
    title: '组件',
    icon: rawComponent(ElementPlus),
    key: 'component',
    children: [
      {
        groupTitle: '列表',
        children: [
          { title: '普通列表', key: 'base-table', },
          {
            title: '高级列表',
            key: 'advanced-table',
          }
        ]
      },
      {
        groupTitle: '表单',
        children: [
          { title: '普通表单', key: 'base-form' },
          {
            title: '嵌套表单',
            key: 'nested-form'
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
])

const route = useRoute()

</script>

<template>
  <div class="aside-container">
    <el-menu :default-active="route.name" router unique-opened class="el-menu-vertical-aside">
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
