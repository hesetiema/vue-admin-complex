import axios from 'axios'
import router from 'vue-router'
import { Message} from 'element-ui' // 引用element-ui的消息提示组件
import {getToken} from '@/utils/auth.js'

const service = axios.create({
  timeout: 10000,
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
    if(err.response){
      if (err.response.status === 401) {
        router.push('/login')
      }
      Message({
        type:"error",
        message: err.response.data || err.response.status || err.response.headers
      })
    }else if (err.request) {
      Message({
        type:"error",
        message: err.request
      })
    } else {
      Message({
        type:"error",
        message: err.message
      })
    }
    return Promise.reject(err)
  }
)

export default service
