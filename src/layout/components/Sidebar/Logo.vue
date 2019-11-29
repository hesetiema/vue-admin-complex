<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to='/home'>
        <img v-if='logo' :src='logo' class="sidebar-logo">
        <h1 v-else class="sidebar-title">{{title}}</h1>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/home">
        <img v-if='logo' :src="logo" class="sidebar-logo">
        <h1 class="sidebar-title">{{title}}</h1>
      </router-link>
    </transition>
  </div>
</template>

<script>
export default {
  name:'SidebarLogo',
  props:{
    collapse:{
      type:Boolean,
      required:true
    },
  },
  data(){
    return{
      title:'Vue Cli Crash',
      logo:'https://wpimg.wallstcn.com/69a1c46c-eb1c-4b46-8bd4-e9e686ef5251.png'
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebar-logo-container{
  position: relative;
  width:100%;
  height:3.5rem;
  background-color: #2b2f3a;
  text-align:center;
  overflow: hidden;

  .sidebar-logo-link{
    width:100%;
    height:100%;

    .sidebar-logo{
      width:2rem;
      height:2rem;
      vertical-align: middle;
      margin-right: .8rem;
    }

    .sidebar-title{
      display: inline-block;
      margin:0;
      line-height:3.5rem;
      font-size: 1rem;
      font-weight: 600;
      color: #fff;
      vertical-align: middle;
    }
  }
}
.sidebarLogoFade-enter-active,.sidebarLogoFade-leave-active{
  transition: opacity 1.5s;
}
.sidebarLogoFade-enter,.sidebarLogoFade-leave-to{
  opacity: 0;
}


</style>