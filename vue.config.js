const path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports= {
  publicPath: "/",
  outputDir: "dist", //生成的生产环境构建文件的目录
  assetsDir: "static", //放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录
  lintOnSave: process.env.NODE_ENV !== "production", //开发环境下通过 eslint-loader 在每次保存时 lint 代码
  productionSourceMap: false, //不需要生产环境的 source map 以加速生产环境构建
  chainWebpack: config => {
    config.module //默认解析svg规则排除icons目录
      .rule("svg")
      .exclude.add(resolve("src/icons"))
      .end();

    config.module //解析icons规则中的svg使用插件svg-sprite-loader
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]"
      })
      .end();
  }
};
