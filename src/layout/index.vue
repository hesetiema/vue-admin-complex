<template>
  <el-container class="app-wrapper" :class="classObj">
    <el-aside class="sidebar-container">
      <div class="sidebar-logo-container">
        <transition name="sidebarLogoFade">
          <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
            <img v-if="logo" :src="logo" class="sidebar-logo" />
            <h1 v-else class="sidebar-title">{{ title }}</h1>
          </router-link>
          <router-link v-else key="expand" class="sidebar-logo-link" to="/">
            <h1 class="sidebar-title">{{ title }}</h1>
          </router-link>
        </transition>
      </div>
      <!-- wrapClass指代外部容器样式名 -->
      <el-scrollbar wrap-class="scrollbar-wrapper">
        <el-menu
          router
          :default-active="$route.path"
          :unique-opened="false"
          :background-color="variables.menuBg"
          :text-color="variables.menuText"
          :active-text-color="variables.menuActiveText"
          :collapse="collapse"
          :collapse-transition="false"
          mode="vertical"
        >
          <sidebar-item
            v-for="route in permission_routes"
            :key="route.path"
            :item="route"
            :base-path="route.path"
          />
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <el-container class="main-container" :class="{'hide-sidebar':collapse}">
      <el-header class="header">
        <hamburger @toggleClick="toggle" class="hamburger-container" :is-active="!collapse"></hamburger>
        <breadcrumb class="breadcrumb-container"></breadcrumb>
        <el-dropdown class="avatar-container" trigger="hover">
          <div class="avatar-wrapper">
            <img :src="avatar" class="user-avatar" alt="avatar" />
            <i class="el-icon-caret-bottom" />
          </div>
          <el-dropdown-menu slot="dropdown" class="user-dropdown">
            <router-link to="/">
              <el-dropdown-item>Home</el-dropdown-item>
            </router-link>
            <a target="_blank" href="https://github.com/hesetiema">
              <el-dropdown-item>Github</el-dropdown-item>
            </a>
            <a target="_blank" href="https://hesetiema.github.io/myblogs/">
              <el-dropdown-item>Docs</el-dropdown-item>
            </a>
            <el-dropdown-item divided @click.native="logout">
              <span>Log Out</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>

      <el-main class="main">
        <transition name="fade-transform" mode="out-in">
          <router-view></router-view>
        </transition>
      </el-main>
    </el-container>

  </el-container>
</template>

<script>
import SidebarItem from "./components/SidebarItem.vue";
import Hamburger from "@/components/Hamburger";
import Breadcrumb from "@/components/Breadcrumb";
import { routes } from "@/router";
import variables from "@/styles/variables.scss";
import { getInfo, logout } from "@/api/user";
import { getToken, removeToken } from "@/utils/auth.js";

export default {
  name: "Layout",
  components: {
    SidebarItem,
    Hamburger,
    Breadcrumb
  },
  data() {
    return {
      collapse: false,
      logo:
        "https://wpimg.wallstcn.com/69a1c46c-eb1c-4b46-8bd4-e9e686ef5251.png",
      title: "vue cli crash",
      permission_routes: routes,
      withoutAnimation: false,
      fixedHeader: true,
      avatar: ""
    };
  },
  created() {
    this.getAvatar();
  },
  methods: {
    toggle() {
      this.collapse = !this.collapse;
    },
    getAvatar() {
      getInfo()
        .then(res => {
          const { data } = res;
          if (!data) {
            alert("Verification failed, please Login again.");
          }
          this.avatar = data.avatar;
        })
        .catch(err => {
          alert(err + " something wrong!");
        });
    },
    async logout() {
      const token = getToken();
      await logout(token)
        .then(() => {
          removeToken();
        })
        .catch(err => alert(err + " something wrong!"));
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    }
  },
  computed: {
    variables() {
      return variables;
    },
    classObj() {
      return {
        hideSidebar: this.collapse,
        openSidebar: !this.collapse,
        withoutAnimation: this.withoutAnimation
      };
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";

.sidebar-logo-container {
  width: 100%;
  height: 3rem;
  background-color: cadetblue;
}
.sidebar-logo-link {
  height: 100%;
  width: 100%;
}
.sidebar-logo {
  width: 2rem;
  height: 2rem;
  margin: 0.5rem 1rem;
  vertical-align: middle;
}

.sidebar-title {
  line-height: 3rem;
  font-weight: normal;
  margin: 0;
  text-align: center;
}

.main-container {
  min-height: 100%;
  transition: margin-left 0.28s;
  margin-left: 10rem;
  width: calc(100% - 10rem);
  position: relative;

  .header {
    height: 3rem !important;
    padding: 0;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  }
}
.main-container .hide-sidebar {
  margin-left: 3.5rem;
  width: calc(100% - 3.5rem);
}
.hamburger-container {
  float: left;
  line-height: 3rem;
  height: 100%;
  cursor: pointer;
  transition: background 0.3s;
  -webkit-tap-highlight-color: transparent;
  &:hover {
    background: rgba(0, 0, 0, 0.025);
  }
}

.breadcrumb-container {
  float: left;
}
.avatar-container {
  float: right;
  margin-right: 2rem;
  .avatar-wrapper {
    margin-top: 0.25rem;
    position: relative;
    .user-avatar {
      cursor: pointer;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 0.5rem;
    }
    .el-icon-caret-bottom {
      cursor: pointer;
      position: absolute;
      right: -1.25rem;
      top: 1.5rem;
      font-size: 0.75rem;
    }
  }
}
.main {
  padding: 0;
}
</style>



