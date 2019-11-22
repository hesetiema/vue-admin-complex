import router from './router'
import store from './store'
import { getToken } from '@/utils/auth'
import { Message } from 'element-ui'


router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requireAuth)) {
    const hasToken = getToken();
    const hasRoles = store.getters.roles && store.getters.roles.length > 0;
    if (hasToken) {
      if (to.path === '/login') {
        next({ path: '/home' })
      } else {
        if (hasRoles) { next() }
        else {
          try {
            const { roles } = await store.dispatch('user/getInfo');
            const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
            router.addRoutes(accessRoutes)
            next({ ...to, replace: true })
          } catch (error) {
            await store.dispatch('user/resetToken')
            Message.error(error || 'Has Error')
            next(`/login?redirect=${to.path}`)
          }
        }
      }
    } else {
      next(`/login?redirect=${to.path}`)
    }
  } else {
    next()
  }
})