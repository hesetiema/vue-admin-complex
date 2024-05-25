import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import HomeView from '@/views/HomeView.vue'

import { VITE_BASE_PATH } from '@/constant/index'

import { ElNotification } from 'element-plus'

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
        meta: {
          title: '普通表单'
        },
        redirect: '/admin/base-form/index',
        children: [
          {
            path: 'index',
            name: 'base-form-index',
            component: () => import('@/views/admin/FormBase.vue')
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
            path: 'modal',
            name: 'modal',
            component: () => import('@/views/admin/FormAdvancedModal.vue'),
            meta: {
              title: '弹出层表单'
            }
          },
          {
            path: 'search',
            name: 'search',
            component: () => import('@/views/admin/FormAdvancedSearch.vue'),
            meta: {
              title: '搜索表单'
            }
          },
          {
            path: 'step',
            name: 'step',
            component: () => import('@/views/admin/FormAdvancedModal.vue'),
            meta: {
              title: '分步表单'
            }
          },
          {
            path: 'dynamic',
            name: 'dynamic',
            component: () => import('@/views/admin/FormAdvancedModal.vue'),
            meta: {
              title: '动态增减嵌套表单'
            }
          }
        ]
      },
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

const checkUpdate = async () => {
  return fetch(`${VITE_BASE_PATH}/version.json?t=${Date.now()}`)
    .then((response) => {
      if (!response.ok) throw new Error(`Failed to fetch version.json`)

      try {
        const serverJson = response.json()
        return serverJson
      } catch (error) {
        throw new Error(`Failed to parse version.json`)
      }
    })
    .then((res) => {
      const htmlLastBuildTime = (document.querySelector('meta[name=lastBuildTime]') as any)?.content
      if (res?.lastBuildTime && res?.lastBuildTime !== htmlLastBuildTime) {
        ElNotification({
          title: '系统更新',
          message: `检测到当前系统版本已更新，即将刷新页面！`
        })
        window.location.reload()
      }
    })
}

router.beforeEach((to, from, next) => {
  if (process.env.NODE_ENV === 'production') {
    checkUpdate().then(() => {
      next()
    })
  } else {
    next()
  }
})

export default router
