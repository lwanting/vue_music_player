<template>
  <!-- 点击除搜索面板外，隐藏搜索面板 -->
  <div class="container" @click="hideSearchPanel()">
    <!-- 头部区域 -->
    <div class="header">
      <top />
    </div>
    <!-- 主题区域 -->
    <div class="body">
      <!-- 侧边导航栏 -->
      <div class="nav" v-show="$store.state.isMenuShow">
        <el-menu
          :default-active="$route.path"
          class="el-menu-vertical"
          active-text-color="#dd6d60"
          router
        >
          <el-menu-item index="/">
            <i class="iconfont icon-find-music"></i>
            <span slot="title">发现音乐</span>
          </el-menu-item>
          <el-menu-item index="/playlists">
            <i class="iconfont icon-playlist"></i>
            <span slot="title">推荐歌单</span>
          </el-menu-item>
          <el-menu-item index="/songs">
            <i class="iconfont icon-new-music"></i>
            <span slot="title">最新音乐</span>
          </el-menu-item>
          <el-menu-item index="/mvs">
            <i class="iconfont icon-mv"></i>
            <span slot="title">最新MV</span>
          </el-menu-item>
        </el-menu>
      </div>
      <!-- 内容主体 -->
      <div class="main">
        <router-view />
        <playing-list />
      </div>
    </div>
    <!-- 底部播放模块 -->
    <div class="bottom">
      <mini-player />
    </div>
  </div>
</template>

<script>
import Top from './Top'
import MiniPlayer from '../player/MiniPlayer'
import PlayingList from '../player/PlayingList'
import { mapState, mapMutations } from '../../store/helper/music'
export default {
  data() {
    return {
      // 搜索面板显示与隐藏
      searchPanelVisi: false,
      ...mapState(['isPlayingListShow'])
    }
  },
  components: {
    Top,
    MiniPlayer,
    PlayingList
  },
  methods: {
    // input失去焦点隐藏搜索面板
    hideSearchPanel() {
      this.$store.commit('setSearchPanelVisible', false)
      this.setPlayingListVisible(false)
    },
    ...mapMutations(['setPlayingListVisible'])
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  .header {
    position: fixed;
    top: 0;
    // 搜索面板置顶
    z-index: 999;
  }
  .body {
    display: flex;
    width: 100%;
    height: 100%;
    padding-top: 54px;
    .nav {
      width: 250px;
      height: 100%;
      .el-menu-vertical {
        height: 100%;
        background-color: #ededed;
        color: #000;
        .el-menu-item {
          font-size: 15px;
        }
        i {
          margin-right: 6px;
        }
      }
    }
    .main {
      flex: 1;
      margin-bottom: 60px;
      overflow-y: scroll;
    }
  }
  .bottom {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 64px;
    background-color: #fff;
  }
}
</style>
