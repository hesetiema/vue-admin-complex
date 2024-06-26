import './assets/base.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import App from './App.vue'
import router from './router'

const app = createApp(App)

const pinia = createPinia()

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

window.addEventListener('vite:preloadError', () => {
  window.location.reload() // for example, refresh the page
})

app.use(router)
app.use(ElementPlus)
app.use(pinia)
app.mount('#app')
