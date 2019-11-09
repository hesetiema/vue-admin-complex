<template>
  <div class="login-container">
    <form class="login-items">
      <img alt="Vue logo" src="../../assets/logo.png">
      <h2>{{ msg }}</h2>
      <div class="login-items_account">
        <span class="username-icon"></span>
        <input type="text" v-model="username" placeholder="Username" autocomplete="on">
      </div>
      <p class="notice">Please enter the correct user name</p>
      <div class="login-items_password">
        <span class="password-icon"></span>
        <input type="password" v-model="password" placeholder="Password" autocomplete="on">
        <span class="password-icon_see" @click="showPwd"></span>
      </div>
      <p class="notice">The password can not be less than 6 digits</p>
      <button class="login-items_submit" @click="handleLogin">Login</button>
      <el-button type="primary">忘记密码</el-button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  methods:{
    showPwd(){

    },
    handleLogin(){

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.login-container{
  box-sizing:border-box;
  max-width:100vw;
  height:100vh;
  color:white;
  background:#2d3a4b;
  display:flex;
  flex-direction: column;
  justify-content: center;
  align-items:center;
}
.login-items{
  width:45rem;
  height:40rem;
  display:flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.login-items>.notice{
  color:red;
  visibility:hidden;
}
.login-items_account,.login-items_password{
  width:20rem;
  height:1.5rem;
  padding:1rem 0;
  display:flex;
  justify-content:flex-start;
  border:1px solid rgba(255,255,255,0.9);
  border-radius:.5rem;
  background: rgba(255,255,255,0.5);
}
.login-items_account>.username-icon{
  flex:1;
  background: no-repeat center / contain url("../../assets/account.png");
}
.login-items_account>input{
  flex:6;
  padding-right: 1rem;
  border:0;
  background: transparent;
  outline: none;
}
.login-items_password>.password-icon{
  flex:1;
  background: no-repeat center / contain url("../../assets/password.png");
}
.login-items_password>input{
  flex:5;
  padding-right: 1rem;
  border: 0;
  background: transparent;
  outline: none;
}
.login-items_password>.password-icon_see{
  flex:1;
  background: no-repeat center / contain url("../../assets/browse.png");
  cursor: pointer;
  background-color:none;
}
.login-items_submit{
  width:20rem;
  height:3rem;
  border-radius: 1rem;
  cursor: pointer;
  border:none;
  background: lightblue;
  outline:none;
  margin-bottom: 3rem;
}
</style>
