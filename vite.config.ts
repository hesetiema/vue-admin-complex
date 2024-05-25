import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vitePluginUpdateVersion from './plugins'
import { VITE_BASE_PATH } from './src/constant/index'

// https://vitejs.dev/config/
export default defineConfig({
  base: VITE_BASE_PATH,
  plugins: [vue(), vueJsx(), vitePluginUpdateVersion()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
