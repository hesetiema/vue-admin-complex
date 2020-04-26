<template>
  <el-alert title="menu1-1" type="warning" style="padding:30px;" :closable ="false">
    <todo-list></todo-list>
  </el-alert>
</template>

<script>
import TodoList from "@/components/TodoList";
export default {
  name: "menu1-1",
  components: {
    TodoList
  }
};
</script>

