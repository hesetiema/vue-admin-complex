<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'

interface DomainItem {
  key: number
  value: string
}

interface CardForm {
  domains: DomainItem[]
  email: string
  key: number
}

const formRefs = ref<FormInstance[]>([])
const nestedForms = reactive<CardForm[]>([
  {
    key: 0,
    domains: [
      {
        key: 1,
        value: ''
      }
    ],
    email: ''
  }
])

const setItemRef = (el) => {
  formRefs.value.push(el)
}

const removeDomain = (formKey: number, item: DomainItem) => {
  const currentDomains = nestedForms.find((v) => v.key === formKey)?.domains
  if (currentDomains) {
    const index = currentDomains.indexOf(item)
    if (index !== -1) {
      currentDomains.splice(index, 1)
    }
  }
}

const addDomain = (formKey: number) => {
  const currentDomains = nestedForms.find((v) => v.key === formKey)?.domains
  if (currentDomains) {
    currentDomains.push({
      key: Date.now(),
      value: ''
    })
  }
}

const submitForm = async () => {
  for await (const formEl of formRefs.value) {
    formEl.validate((valid) => {
      if (valid) {
        console.log('form', JSON.stringify(nestedForms))
      }
    })
  }
}

const removeForm = (formKey: number) => {
  const currentFormIndex = nestedForms.findIndex((v) => v.key === formKey)
  if (currentFormIndex !== -1) {
    nestedForms.splice(currentFormIndex, 1)
  }
}

const addForm = () => {
  nestedForms.push({
    key: Date.now(),
    domains: [
      {
        key: Date.now(),
        value: ''
      }
    ],
    email: ''
  })
}
</script>

<template>
  <template v-for="cardForm in nestedForms" :key="cardForm.key">
    <el-form :ref="setItemRef" class="card-form" :model="cardForm" label-width="auto">
      <el-form-item
        prop="email"
        label="Email"
        :rules="[
          {
            required: true,
            message: 'Please input email address',
            trigger: 'blur'
          },
          {
            type: 'email',
            message: 'Please input correct email address',
            trigger: ['blur', 'change']
          }
        ]"
      >
        <el-input v-model="cardForm.email" />
      </el-form-item>
      <el-form-item
        v-for="(domain, index) in cardForm.domains"
        :key="domain.key"
        :label="'Domain' + index"
        :prop="'domains.' + index + '.value'"
        :rules="{
          required: true,
          message: 'domain can not be null',
          trigger: 'blur'
        }"
      >
        <el-input v-model="domain.value" />
        <el-button class="mt-2" @click.prevent="removeDomain(cardForm.key, domain)">
          Delete
        </el-button>
      </el-form-item>
      <div class="flex-center">
        <el-button @click="addDomain(cardForm.key)">New domain</el-button>
        <el-button @click="removeForm(cardForm.key)">减少表单</el-button>
      </div>
    </el-form>
  </template>
  <div class="operations">
    <el-button @click="addForm()">添加表单</el-button>
    <el-button type="primary" @click="submitForm()">Submit</el-button>
  </div>
</template>

<style scoped>
.card-form {
  border: 1px solid pink;
  padding: 20px;
  max-width: 600px;
  margin-bottom: 12px;
}
.flex-center {
  display: flex;
  align-items: center;
}
.operations {
  margin-top: 12px;
  display: flex;
  align-items: center;
}
</style>
