// 发布环境下需要的插件
const prodPlugins = []
if (process.env.NODE_ENV === 'production') {
  // 发布环境下删除项目中的所有的 console 代码
  prodPlugins.push('transform-remove-console')
}
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
    // 发布环境下的插件
    ...prodPlugins
  ]
}
