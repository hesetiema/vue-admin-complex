<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'

const formRef = ref<FormInstance>()
const initFormData = {
  user: '',
  region: '',
  date: ''
}

const formInline = reactive(initFormData)

const onReset = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

const onSubmit = () => {
  console.log('submit!')
}
</script>

<template>
  <el-form ref="formRef" :inline="true" :model="formInline" class="demo-form-inline">
    <el-form-item label="Approved by" prop="user">
      <el-input v-model="formInline.user" placeholder="Approved by" clearable />
    </el-form-item>
    <el-form-item label="Activity zone" prop="region">
      <el-select v-model="formInline.region" placeholder="Activity zone" clearable>
        <el-option label="Zone one" value="shanghai" />
        <el-option label="Zone two" value="beijing" />
      </el-select>
    </el-form-item>
    <el-form-item label="Activity time" prop="date">
      <el-date-picker v-model="formInline.date" type="date" placeholder="Pick a date" clearable />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onReset">重置</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">查询</el-button>
    </el-form-item>
  </el-form>
</template>

<style>
.demo-form-inline .el-input {
  --el-input-width: 220px;
}

.demo-form-inline .el-select {
  --el-select-width: 220px;
}
</style>
