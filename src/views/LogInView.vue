<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { User, Lock } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

const router = useRouter()

interface RuleForm {
  name: string
  password: string
}

const ruleFormRef = ref<FormInstance>()

const ruleForm = reactive<RuleForm>({
  name: '',
  password: ''
})

const rules = reactive<FormRules<RuleForm>>({
  name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      router.push('/admin')
    }
  })
}
</script>

<template>
  <div class="login-container">
    <div class="login-landing">
      <img alt="landing image" class="image" src="@/assets/landingPage.svg" />
    </div>
    <div class="login-ruleForm">
      <div class="form-title">帐号登录</div>
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        style="max-width: 600px"
        label-width="auto"
        status-icon
        class="form-content"
      >
        <el-form-item prop="name">
          <el-input v-model="ruleForm.name" :prefix-icon="User" placeholder="请输入用户名：admin" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="ruleForm.password"
            type="password"
            show-password
            :prefix-icon="Lock"
            placeholder="请输入密码：admin"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm(ruleFormRef)">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
  gap: 20px;
  padding: 40px;
}

.login-landing {
  flex: 1;
  max-width: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image {
  min-width: 420px;
  max-width: 500px;
  object-fit: contain;
}
.login-ruleForm {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 420px;
  height: auto;
  padding: 40px;
  margin: auto 0;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
.form-title {
  margin-bottom: 24px;
  color: #1e1c23;
  font-size: 24px;
}
.form-content {
  display: flex;
  flex-direction: column;
  row-gap: 20px;
  width: 100%;
}
</style>
