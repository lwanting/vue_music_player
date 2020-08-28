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

Vue.config.productionTip = false

// 全局过滤器
Vue.filter('formatCount', count => {
  if (count / 10000 > 10) {
    return parseInt(count / 10000) + '万'
  } else {
    return count
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
