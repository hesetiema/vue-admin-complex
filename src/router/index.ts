import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import HomeView from '@/views/HomeView.vue'

const routes: RouteRecordRaw[] = [
  {

    path: "/",
    name: "root",
    redirect: '/home'
  },
  {
    path: '/home',
    name: "home",
    component: HomeView,
    redirect: '/home/login',
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('@/views/LogInView.vue'),
      },
      {
        path: 'about',
        name: 'about',
        // route level code-splitting
        // this generates a separate chunk (About.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('@/views/AboutView.vue')
      },
      {
        path: "faq",
        name: "faq",
        component: () => import("@/views/FAQView.vue"),
      },
    ]
  },
  {
    path: "/admin",
    name: "admin",
    component: () => import("@/layout/LayOut.vue"),
    redirect: "/admin/index",
    children: [
      {
        path: "index",
        name: "index",
        component: () => import("@/views/admin/DashBoard.vue"),
      },
      {
        path: "base-table",
        name: "base-table",
        component: () => import("@/views/admin/TableBase.vue"),
      },
      {
        path: "advanced-table",
        name: "advanced-table",
        component: () => import("@/views/admin/TableBase.vue"),
      },
      {
        path: "base-form",
        name: "base-form",
        component: () => import("@/views/admin/TableBase.vue"),
      },
      {
        path: "nested-form",
        name: "nested-form",
        component: () => import("@/views/admin/TableBase.vue"),
      },
      {
        path: "file-upload",
        name: "file-upload",
        component: () => import("@/views/admin/TableBase.vue"),
      },
      {
        path: "text-ellipsis",
        name: "text-ellipsis",
        component: () => import("@/views/admin/TableBase.vue"),
      },
      {
        path: "img-crop",
        name: "img-crop",
        component: () => import("@/views/admin/TableBase.vue"),
      },
      {
        path: "watermark",
        name: "watermark",
        component: () => import("@/views/admin/TableBase.vue"),
      },
      {
        path: "player",
        name: "player",
        component: () => import("@/views/admin/TableBase.vue"),
      },
      {
        path: "other-func",
        name: "other-func",
        component: () => import("@/views/admin/TableBase.vue"),
      },
    ]
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
