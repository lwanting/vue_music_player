import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 默认显示侧边导航栏
    isMenuShow: true,
    // 搜索tab栏
    searchType: '1'
  },
  mutations: {
    // 设置侧边导航栏是否显示
    setMenuShow(state, show) {
      state.isMenuShow = show
    },
    // 存储搜索页当前tab栏
    saveSearchTab(state, type) {
      state.searchType = type
    }
  },
  actions: {
  },
  modules: {
  }
})
