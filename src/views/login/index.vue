<template>
  <div class="login-page">
    <Login msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import Login from '@/components/Login'

export default {
  name: 'login',
  components: {
    Login
  }
}
</script>