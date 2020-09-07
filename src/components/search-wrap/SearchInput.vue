<template>
  <div class="search">
    <!-- 搜索框 -->
    <el-input
      size="small"
      placeholder="搜索"
      v-model="query"
      @keyup.enter.native="onEnter()"
      @click.native.stop="showSearchPanel()"
    >
      <i slot="prefix" class="el-input__icon el-icon-search"></i>
    </el-input>
    <!-- 点击搜索面板，保持显示 -->
    <div class="search-panel" v-show="searchPanelVisi" @click.stop="showSearchPanel()">
      <!-- 历史搜索 -->
      <div class="history-search">
        <div class="history-header" v-show="history.length">
          <p class="title">历史搜索</p>
          <span class="iconfont icon-delete" @click="clearHistory()"></span>
        </div>
        <div class="tag-wrap">
          <div
            class="tag"
            v-for="(item, index) in history"
            :key="index"
            @click="toSearch(item)"
            v-show="history.length"
          >{{item}}</div>
        </div>
      </div>
      <!-- 热门搜索 -->
      <div class="hot-search">
        <p class="title">热门搜索</p>
        <div class="tag-wrap">
          <div
            class="tag"
            v-for="(item, index) in hots"
            :key="index"
            @click="toSearch(item.first)"
          >{{item.first}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getHotSearch } from '../../api/search'
export default {
  data() {
    return {
      // 查询关键词
      query: '',
      // 热门搜索列表
      hots: [],
      // 历史搜索列表
      history: []
    }
  },
  created() {
    this.hotSearch()
    // console.log(this.history)
  },
  mounted() {
    if (JSON.parse(localStorage.getItem('SEARCH_HISTORY_KEY')) !== null) {
      this.history = JSON.parse(localStorage.getItem('SEARCH_HISTORY_KEY'))
    }
    // console.log(this.history)
  },
  methods: {
    // 获取热门搜索列表
    async hotSearch() {
      const { data: res } = await getHotSearch()
      this.hots = res.result.hots
    },
    // 输入框按enter键搜索
    onEnter() {
      if (this.query) {
        this.toSearch(this.query)
      }
    },
    // 显示搜索面板
    showSearchPanel() {
      this.$store.commit('setSearchPanelVisible', true)
    },
    // 隐藏搜索面板
    hideSearchPanel() {
      this.$store.commit('setSearchPanelVisible', false)
    },
    setflag() {
      this.flag = false
    },
    // 跳转到搜索结果页
    toSearch(keywords) {
      // console.log(this.history)
      if (this.history !== null) {
        if (this.history.indexOf(keywords) === -1) {
          this.history.push(keywords)
          localStorage.setItem(
            'SEARCH_HISTORY_KEY',
            JSON.stringify(this.history)
          )
        }
      }
      // console.log()
      // 重置搜索type
      this.$store.commit('saveSearchTab', '1')
      // this.$store.commit('setSearchPanelVisible', false)
      this.$router.push(`/search?keywords=${keywords}`)
    },
    // 清除搜索记录
    clearHistory() {
      this.history = []
      console.log(typeof this.history)
    }
  },
  computed: {
    // 搜索面板的显示与隐藏
    searchPanelVisi() {
      return this.$store.state.isSearchPanelShow
    }
  }
}
</script>

<style lang="scss" scoped>
.search {
  .el-input {
    // outline: none;
  }
  .search-panel {
    position: fixed;
    top: 54px;
    right: 0;
    bottom: 60px;
    width: 400px;
    padding: 5px 20px;
    background-color: #fff;
    box-shadow: -5px 0 5px -2px rgb(0, 0, 0, 0.2);
    .title {
      font-size: 13px;
      margin-right: 20px;
    }
    .tag-wrap {
      display: flex;
      flex-wrap: wrap;
      .tag {
        margin: 5px;
        padding: 5px 20px;
        border: 1px solid #d9d9d9;
        font-size: 13px;
        cursor: pointer;
        &:hover {
          background-color: #f5f5f5;
        }
      }
    }
    .history-search {
      .history-header {
        display: flex;
        align-items: center;
        .icon-delete {
          cursor: pointer;
        }
      }
    }
  }
}
</style>
