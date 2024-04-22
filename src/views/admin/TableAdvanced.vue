<script lang="ts" setup>
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { ref } from 'vue'
import type { TabsPaneContext } from 'element-plus'
import TableAdvancedCommon from './TableAdvancedCommon.vue'

// 更改分页文字
zhCn.el.pagination.total = '共 {total} 条'
zhCn.el.pagination.goto = '跳至'
zhCn.el.pagination.pagesize = '条/页'
zhCn.el.pagination.pageClassifier = '页'

const activeName = ref('first')

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
</script>
<template>
  <div class="main-container">
    <div class="intro">
      <div>高级列表的主要功能有：</div>
      <ul>
        <li>分页</li>
        <li>加载中动画</li>
        <li>空数据渲染</li>
        <li>虚拟化列表</li>
        <li>单元格编辑</li>
      </ul>
    </div>
    <ElConfigProvider :locale="zhCn">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="分页+加载中动画+空数据渲染" name="first">
          <TableAdvancedCommon />
        </el-tab-pane>
        <el-tab-pane label="虚拟化列表" name="second">虚拟化列表</el-tab-pane>
        <el-tab-pane label="单元格编辑" name="third">单元格编辑</el-tab-pane>
      </el-tabs>
    </ElConfigProvider>
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

.el-empty {
  --el-empty-padding: 12px 0;
  --el-empty-image-width: 100px;
  --el-empty-bottom-margin-top: 0px;
  --el-empty-description-margin-top: 12px;
}
</style>
