import axios from 'axios'
import router from 'vue-router'
import { Message} from 'element-ui' // 引用element-ui的消息提示组件
import {getToken} from '@/utils/auth.js'

const service = axios.create({
  timeout: 30000,
  baseURL: 'http://localhost:3000/dev-api'
})


service.interceptors.request.use(
  config => {
    if (getToken()) {
      config.headers.Authorization = 'Bearer ' + getToken()
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  res => {
    return res
  },
  err => {
    if (err.response.data.message) {
      Message({
        type: "error",
        message: err.response.data.message,
        duration: 5 * 1000
      })
    }
  
    if (err.response.status === 401) {
      router.push('/login')
    }
    return Promise.reject(err)
  }
)

export default service
