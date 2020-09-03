import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 默认显示侧边导航栏
    isMenuShow: true
  },
  mutations: {
    // 设置侧边导航栏是否显示
    setMenuShow(state, show) {
      state.isMenuShow = show
    }
  },
  actions: {
  },
  modules: {
  }
})
