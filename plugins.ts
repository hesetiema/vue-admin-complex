import type { PluginOption } from 'vite'
import fs from 'fs'

export default function vitePluginUpdateVersion(): PluginOption {
  let config: any, lastBuildTime: string

  return {
    name: 'vite-plugin-update-version',

    enforce: 'post',

    apply: 'build',

    configResolved(resolvedConfig) {
      config = resolvedConfig
    },

    buildEnd() {
      lastBuildTime = new Date().toLocaleString()
      fs.writeFileSync('public/version.json', JSON.stringify({ lastBuildTime }, null, 2))
    },

    transformIndexHtml(html) {
      if (config.command === 'build') {
        return [
          {
            tag: 'meta',
            attrs: {
              name: 'lastBuildTime',
              content: lastBuildTime
            },
            injectTo: 'head'
          }
        ]
      }
      return html
    }
  }
}
