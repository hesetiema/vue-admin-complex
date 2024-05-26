<script lang="ts" setup>
import { ref, reactive } from 'vue'

const active = ref(0)
const formLabelWidth = '140px'
const formOne = reactive({
  name: '',
  region: ''
})
const formTwo = reactive({
  name: '',
  region: ''
})
const formThree = reactive({
  name: '',
  region: ''
})

const next = () => {
  if (active.value++ > 2) active.value = 0
}
const previous = () => {
  if (active.value > 0) {
    active.value--
  }
}
const submit = () => {
  alert(`提交表单值为：Step One ${JSON.stringify(formOne)};
  Step Two ${JSON.stringify(formTwo)};
  Step Three ${JSON.stringify(formThree)}`)
}
</script>

<template>
  <el-steps style="max-width: 600px" :active="active" finish-status="success">
    <el-step title="Step 1" />
    <el-step title="Step 2" />
    <el-step title="Step 3" />
  </el-steps>

  <div style="width: 400px">
    <el-form :model="formOne" v-show="active === 0">
      <el-form-item label="step one name" :label-width="formLabelWidth">
        <el-input v-model="formOne.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="step one zones" :label-width="formLabelWidth">
        <el-select v-model="formOne.region" placeholder="Please select a zone">
          <el-option label="Zone No.1" value="shanghai" />
          <el-option label="Zone No.2" value="beijing" />
        </el-select>
      </el-form-item>
    </el-form>

    <el-form :model="formTwo" v-show="active === 1">
      <el-form-item label="step two name" :label-width="formLabelWidth">
        <el-input v-model="formTwo.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="step two zones" :label-width="formLabelWidth">
        <el-select v-model="formTwo.region" placeholder="Please select a zone">
          <el-option label="Zone No.1" value="shanghai" />
          <el-option label="Zone No.2" value="beijing" />
        </el-select>
      </el-form-item>
    </el-form>

    <el-form :model="formThree" v-show="active === 2">
      <el-form-item label="step three name" :label-width="formLabelWidth">
        <el-input v-model="formThree.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="step three zones" :label-width="formLabelWidth">
        <el-select v-model="formThree.region" placeholder="Please select a zone">
          <el-option label="Zone No.1" value="shanghai" />
          <el-option label="Zone No.2" value="beijing" />
        </el-select>
      </el-form-item>
    </el-form>
  </div>

  <el-button style="margin-top: 12px" @click="previous" v-show="active > 0"
    >Previous step</el-button
  >
  <el-button style="margin-top: 12px" @click="next" v-show="active < 2">Next step</el-button>
  <el-button style="margin-top: 12px" @click="submit" v-show="active === 2">Submit</el-button>
</template>
