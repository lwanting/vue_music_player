import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 导入全局样式
import './assets/style/base.scss'
// 导入element-ui
import './utils/element.js'
// 导入iconfont
import './assets/fonts/iconfont.css'
// 导入moment
import moment from 'moment'

Vue.config.productionTip = false

// 全局过滤器
// 处理歌单播放量
Vue.filter('formatCount', count => {
  if (count / 10000 > 10) {
    return parseInt(count / 10000) + '万'
  } else {
    return count
  }
})
// 处理歌曲时长
Vue.filter('formatDuration', time => {
  return moment(time).format('mm:ss')
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
