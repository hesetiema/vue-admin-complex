import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import HomeView from '@/views/HomeView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'app',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView,
    redirect: '/home/login',
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('@/views/LogInView.vue')
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
        path: 'faq',
        name: 'faq',
        component: () => import('@/views/FAQView.vue')
      }
    ]
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('@/layout/LayOut.vue'),
    redirect: '/admin/index',
    children: [
      {
        path: 'index',
        name: 'index',
        component: () => import('@/views/admin/DashBoard.vue'),
        meta: {
          hideBreadCrumb: true,
          title: 'DashBoard'
        }
      },
      {
        path: 'base-table',
        name: 'base-table',
        component: () => import('@/views/admin/TableBase.vue'),
        meta: {
          title: '普通列表'
        }
      },
      {
        path: 'advanced-table',
        name: 'advanced-table',
        component: () => import('@/views/admin/TableAdvanced.vue'),
        meta: {
          title: '高级列表'
        }
      },
      {
        path: 'base-form',
        name: 'base-form',
        component: () => import('@/views/admin/FormBase.vue'),
        meta: {
          title: '普通表单'
        },
        children: [
          {
            path: 'text-ellipse',
            name: 'text-ellipse',
            component: () => import('@/views/admin/TableBase.vue'),
            meta: {
              title: '文本省略'
            }
          }
        ]
      },
      {
        path: 'advanced-form',
        name: 'advanced-form',
        component: () => import('@/views/admin/FormAdvanced.vue'),
        meta: {
          title: '高级表单',
          hideBreadCrumb: true
        },
        children: [
          {
            path: 'file-upload',
            name: 'file-upload',
            component: () => import('@/views/admin/TableBase.vue'),
            meta: {
              title: '文件上传'
            }
          },
          {
            path: 'img-crop',
            name: 'img-crop',
            component: () => import('@/views/admin/TableBase.vue'),
            meta: {
              title: '图片裁剪'
            }
          }
        ]
      },
      {
        path: 'watermark',
        name: 'watermark',
        component: () => import('@/views/admin/TableBase.vue'),
        meta: {
          title: '水印'
        }
      },
      {
        path: 'player',
        name: 'player',
        component: () => import('@/views/admin/TableBase.vue'),
        meta: {
          title: '音乐播放器'
        }
      },
      {
        path: 'other-func',
        name: 'other-func',
        component: () => import('@/views/admin/TableBase.vue'),
        meta: {
          title: '其他功能'
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
