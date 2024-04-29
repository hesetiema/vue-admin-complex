<script lang="ts" setup>
import { ArrowDown } from '@element-plus/icons-vue'
import { ref } from 'vue'

interface dropdownItem {
  title: string
  disabled?: boolean
  divided?: boolean
  link?: string
  onClick?: () => void
}

const props = defineProps<{
  title?: string
  list?: dropdownItem[]
}>()

const dropdownTitle = props?.title ?? '用户'
const dropdownItems = ref(props.list)
</script>

<template>
  <el-dropdown>
    <span class="el-dropdown-link">
      {{ dropdownTitle }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <template v-for="item in dropdownItems" :key="item.title">
          <el-dropdown-item :disabled="item.disabled" @click="item.onClick">
            {{ item.title }}
          </el-dropdown-item>
        </template>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style scoped>
.el-dropdown {
  &:focus-visible {
    outline: none;
  }
}
.el-dropdown-link {
  outline: none;
  &:focus-visible {
    outline: none;
  }
}
</style>
