<template>
  <el-row>
    <el-col
      :xs="{ span: 24 }"
      :sm="{ span: 12 }"
      :md="{ span: 12 }"
      :lg="{ span: 6 }"
      :xl="{ span: 6 }"
      style="margin-bottom:2rem;"
    >
      <todo-list />
    </el-col>
  </el-row>
</template>

<script>
import TodoList from '@/components/TodoList'
export default {
  name: "menu1-1",
  components:{
    TodoList
  }
};
</script>

