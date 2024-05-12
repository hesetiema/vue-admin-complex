<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'

const initForm = {
  name: '',
  region: '',
  date: '',
  delivery: false,
  type: [],
  resource: '',
  desc: ''
}
const ruleFormRef = ref<FormInstance>()
const form = reactive(initForm)

const onSubmit = () => {
  alert(`提交表单值为：${JSON.stringify(form)}`)
}
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>

<template>
  <div class="main-container">
    <div class="intro">
      <div>普通表单涉及的主要组件有：</div>
      <ul>
        <li>单行输入框</li>
        <li>下拉选择框</li>
        <li>日期时间选择框</li>
        <li>切换、多选、单选、多行文本</li>
      </ul>
    </div>
    <el-form ref="ruleFormRef" :model="form" label-width="auto" style="max-width: 600px">
      <el-form-item label="Activity name" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="Activity zone" prop="region">
        <el-select v-model="form.region" placeholder="please select your zone">
          <el-option label="上海" value="shanghai" />
          <el-option label="北京" value="beijing" />
        </el-select>
      </el-form-item>
      <el-form-item label="Activity date" prop="date">
        <el-date-picker
          v-model="form.date"
          type="date"
          placeholder="Pick a date"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="Instant delivery" prop="delivery">
        <el-switch v-model="form.delivery" />
      </el-form-item>
      <el-form-item label="Activity type" prop="type">
        <el-checkbox-group v-model="form.type">
          <el-checkbox value="Online activities" name="type"> Online activities </el-checkbox>
          <el-checkbox value="Promotion activities" name="type"> Promotion activities </el-checkbox>
          <el-checkbox value="Offline activities" name="type"> Offline activities </el-checkbox>
          <el-checkbox value="Simple brand exposure" name="type">
            Simple brand exposure
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="Resources" prop="resource">
        <el-radio-group v-model="form.resource">
          <el-radio value="Sponsor">Sponsor</el-radio>
          <el-radio value="Venue">Venue</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Activity form" prop="desc">
        <el-input v-model="form.desc" type="textarea" />
      </el-form-item>
      <el-button type="primary" @click="onSubmit">提交</el-button>
      <el-button @click="resetForm(ruleFormRef)">重置</el-button>
    </el-form>
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
</style>
