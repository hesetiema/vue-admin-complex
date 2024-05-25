import type { PluginOption } from 'vite'

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
      lastBuildTime = new Date().toISOString()
    },

    generateBundle(_, bundle = {}) {
      // inject version json file
      const content = {
        lastBuildTime
      }
      const jsonContent = JSON.stringify(content, null, 2)

      bundle.version = {
        type: 'asset',
        name: undefined,
        source: jsonContent,
        fileName: `version.json`,
        needsCodeReference: false
      }
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
