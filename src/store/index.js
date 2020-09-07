import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 默认显示侧边导航栏
    isMenuShow: true,
    // 搜索tab栏
    searchType: '1',
    // 默认不显示搜索面板
    isSearchPanelShow: false
    // 搜索关键字
    // keywords: ''
  },
  mutations: {
    // 设置侧边导航栏是否显示
    setMenuVisible(state, show) {
      state.isMenuShow = show
    },
    // 存储搜索页当前tab栏
    saveSearchTab(state, type) {
      state.searchType = type
    },
    // 设置搜索面板是否显示
    setSearchPanelVisible(state, show) {
      // console.log(show)
      state.isSearchPanelShow = show
    }
    // 存储搜索关键字
    // saveKeywords(state, key) {
    //   state.keywords = key
    // }
  },
  actions: {
  },
  modules: {
  }
})
