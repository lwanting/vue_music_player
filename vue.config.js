
module.exports = {
  // 基本路径
  publicPath: './',
  // 隐藏打包后的源码
  productionSourceMap: false,
  devServer: {
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        pathRewrite: { '^/api': '' },
        changeOrigin: true
      }
    }
  },
  chainWebpack: config => {
    // 发布环境
    config.when(process.env.NODE_ENV === 'production', config => {
      config.entry('app').clear().add('./src/main-prod.js')
      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        vuex: 'Vuex',
        axios: 'axios',
        // 'vue-lazyload': 'VueLazyLoad',
        moment: 'moment'
      })
      config.plugin('html').tap(args => {
        args[0].isProd = true
        args[0].title = '千北音乐'
        return args
      })
    })
    // 开发环境
    config.when(process.env.NODE_ENV === 'development', config => {
      config.entry('app').clear().add('./src/main-dev.js')
      config.plugin('html').tap(args => {
        args[0].isProd = false
        return args
      })
    })
  }
}