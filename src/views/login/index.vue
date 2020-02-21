<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      autocomplete="on"
      label-position="left"
    >
      <div class="title-container">
        <img alt="Vue logo" src="../../assets/logo.png" />
        <h2>Wecome to your login form</h2>
      </div>

      <el-form-item prop="username">
        <el-input
          ref="username"
          class="form-items_input"
          v-model="loginForm.username"
          placeholder="Username"
          prefix-icon="el-icon-user"
          autocomplete="on"
        />
      </el-form-item>

      <el-tooltip
        v-model="capsTooltip"
        effect="light"
        content="Caps lock is On"
        placement="right"
        manual
      >
        <el-form-item prop="password">
          <el-input
            ref="password"
            class="form-items_input"
            v-model="loginForm.password"
            placeholder="Password"
            autocomplete="on"
            prefix-icon="el-icon-lock"
            show-password
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="submitForm('loginForm')"
          />
        </el-form-item>
      </el-tooltip>

      <div class="form-items_tips">
        <a href="toLogin" class="forget-password">忘记密码？</a>|
        <a
          href="#"
          @click.prevent="resetForm('loginForm')"
          class="reset-password"
          >重置密码</a
        >
      </div>

      <el-button
        class="form-items_submit"
        type="primary"
        :loading="loading"
        @click.native.prevent="submitForm('loginForm')"
        >Login</el-button
      >

    </el-form>
  </div>
</template>

<script>
import { validUsername } from "@/utils/validate";

export default {
  name: "Login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error("Please enter the correct user name"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("The password can not be less than 6 digits"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "admin",
        password: "123456"
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername }
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword }
        ]
      },
      passwordType: "password",
      capsTooltip: false,
      loading: false,
      redirect: undefined,
      otherQuery: {}
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query;
        if (query) {
          this.redirect = query.redirect;
          this.otherQuery = this.getOtherQuery(query);
        }
      },
      immediate: true
    }
  },
  mounted() {
    if (this.loginForm.username === "") {
      this.$refs.username.focus();
    } else if (this.loginForm.password === "") {
      this.$refs.password.focus();
    }
  },
  methods: {
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (
          (shiftKey && key >= "a" && key <= "z") ||
          (!shiftKey && key >= "A" && key <= "Z")
        ) {
          this.capsTooltip = true;
        } else {
          this.capsTooltip = false;
        }
      }
      if (key === "CapsLock" && this.capsTooltip === true) {
        this.capsTooltip = false;
      }
    },
    submitForm() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store.dispatch("user/login", this.loginForm)
            .then(() => {
              alert("ok");
              this.$router.push({
                path: this.redirect || '/',
                query: this.otherQuery
              });
              this.loading = false;
            })
            .catch(err => {
              this.loading = false;
              alert(err + " something wrong!");
            });
        } else {
          alert("error submit!!");
          return false;
        }
      });
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== "redirect") {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
    },
    resetForm() {
      this.$refs.loginForm.resetFields();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
$font-color: white;
$bgd-color: #2d3a4b;
$input-bgd_color: #4f5c6d;
$border-color: rgba(255, 255, 255, 0.9);

.login-container {
  min-height: 100vh;
  width: 100vw;
  overflow: hidden;
  color: $font-color;
  background: $bgd-color;

  .login-form {
    box-sizing: border-box;
    width: 40rem;
    height: 40rem;
    margin: 2rem auto 0;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  .title-container {
    margin-bottom: 2.5rem;
  }
  /deep/ .form-items_input {
    width: 20rem;
    margin: 0.5rem;

    input {
      &::placeholder {
        color: grey;
        font-size: 0.75rem;
      }
      border: none;
      color: $font-color;
      background-color: $input-bgd_color;
      height: 3rem;
    }
  }
  /deep/ .el-form-item__error {
    width: 21rem;
    display: flex;
    justify-content: center;
  }
  .form-items_tips {
    height: 1.5rem;
    margin: 1rem 0;
    a {
      color: $font-color;
    }
  }
  .form-items_submit {
    width: 20rem;
    border-radius: 0.5rem;
  }
}
</style>
