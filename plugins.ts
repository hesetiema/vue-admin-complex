import type { PluginOption } from 'vite'
import fs from 'fs'
import path from 'path'

export default function vitePluginUpdateVersion(): PluginOption {
  let config: any, lastBuildTime: string

  return {
    name: 'vite-plugin-update-version',

    enforce: 'post',

    apply: 'build',

    configResolved(resolvedConfig) {
      config = resolvedConfig
    },

    buildStart() {
      lastBuildTime = new Date().toLocaleString()
      const filePath = config.publicDir + path.sep + 'version.json'
      fs.writeFileSync(filePath, JSON.stringify({ lastBuildTime }, null, 2))
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
