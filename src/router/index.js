import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
export const constantRoutes=[
  {
    path: '/',
    redirect: '/login',
    hidden:true
  },
  {
    path: '/login',
    name: 'login',
    hidden:true,
    component: () => import('@/views/login')
  },
  {
    path: '/home',
    name: 'home',
    hidden:true,
    meta: {
      requireAuth: true
    },
    component: () => import('@/views/home')
  },
  {
    path: '/404',
    name: '404',
    hidden:true,
    component: () => import('@/views/404')
  },
  {
    path: '/user/info',
    name: 'user-information',
    hidden:true,
    component: () => import('@/views/404')
  },
]

const router = new Router({
  routes: constantRoutes
});


export default router
