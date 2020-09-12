import Vue from 'vue'
import Vuex from 'vuex'
import musicModule from './modules/music'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 默认显示侧边导航栏
    isMenuShow: true,
    // 搜索页tab栏
    searchType: '1',
    // 默认不显示搜索面板
    isSearchPanelShow: false,
    // 歌单页tab栏
    playlistTab: '全部'
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
    },
    // 保存歌单页当前tab栏
    savePlaylistTab(state, tab) {
      state.playlistTab = tab
    }
  },
  actions: {
  },
  modules: {
    music: musicModule
  }
})
