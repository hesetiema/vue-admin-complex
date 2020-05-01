<template>
  <div style="padding:30px">
    <el-alert title="Menu1" type="success" :closable="false" style="padding:30px;">
      <router-view />
    </el-alert>
  </div>
</template>

<script>
export default {};
</script>
<style lang="scss" scoped>
/deep/.el-alert__content {
  width: 740px;
}
</style>