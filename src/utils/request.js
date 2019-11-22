import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { Loading, Message } from 'element-ui' // 引用element-ui的加载和消息提示组件
import {getToken} from '@/utils/auth'

const service = axios.create({
  // 设置超时时间
  timeout: 30000,
  // 基础url，会在请求url中自动添加前置链接
  baseURL: "http://localhost:8080"
})

// 在全局请求和响应拦截器中添加请求状态
let loading = null

/**
 * 请求拦截器
 * 用于处理请求前添加loading、判断是否已保存token，并在每次请求头部添加token
 */
service.interceptors.request.use(
  config => {
    loading = Loading.service({ text: '拼命加载中' })
    const token = store.getters.token
    if (token) {
      config.headers.Authorization = getToken()// 请求头部添加token
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
/**
 * 响应拦截器
 * 用于处理loading状态关闭、请求成功回调、响应错误处理
 */
service.interceptors.response.use(
  response => {
    if (loading) {
      loading.close()
    }
    const code = response.status
    // 请求成功返回response.data
    if ((code >= 200 && code < 300) || code === 304) {
      return Promise.resolve(response.data)
    } else {
      return Promise.reject(response)
    }
  },
  error => {
    if (loading) {
      loading.close()
    }
    alert(error)
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 返回401 清除token信息并跳转到登陆页面
          store.commit('DEL_TOKEN')
          router.replace({
            path: '/login',
            query: {
              redirect: router.currentRoute.fullPath
            }
          })
          break
        case 404:
          Message.error('网络请求不存在')
          break
        default:
          Message.error(error.response.data.message)
      }
    } else {
      // 请求超时或者网络有问题
      if (error.message.includes('timeout')) {
        Message.error('请求超时！请检查网络是否正常')
      } else {
        Message.error('请求失败，请检查网络是否已连接')
      }
    }
    return Promise.reject(error)
  }
)

export default service
// get，post请求方法
// {
//   post(url, data) {
//     return service({
//       method: 'post',
//       url,
//       data: Qs.stringify(data),
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
//       }
//     })
//   },
//   get(url, params) {
//     return service({
//       method: 'get',
//       url,
//       params
//     })
//   }
// }




