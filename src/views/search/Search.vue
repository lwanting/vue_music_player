<template>
  <div class="search">
    <!-- 头部区域 -->
    <div class="header" ref="header">
      <span class="keywords">{{keywords}}</span>
      <span class="result-num">找到{{getTotal}}个结果</span>
    </div>
    <!-- tab栏 -->
    <el-tabs v-model="type">
      <el-tab-pane label="歌曲" name="1">
        <!-- 歌曲列表表格 -->
        <el-table :data="songList" style="width: 100%" class="songTable" @row-dblclick="playMusic">
          <!-- 序号 -->
          <el-table-column type="index" width="60">
            <template
              v-slot="scope"
            >{{scope.$index+1 &lt; 10 ? '0'+(scope.$index+1) : scope.$index+1}}</template>
          </el-table-column>
          <!-- 标题 -->
          <el-table-column prop="name" label="音乐标题" width="350"></el-table-column>
          <!-- 歌手 -->
          <el-table-column label="歌手" width="300">
            <template v-slot="scope">{{getName(scope.row.artists)}}</template>
          </el-table-column>
          <!-- 专辑 -->
          <el-table-column prop="album.name" label="专辑" width="250"></el-table-column>
          <!-- 时长 -->
          <el-table-column label="时长" width="100">
            <template v-slot="scope">{{scope.row.duration | formatDuration}}</template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="歌单" name="1000">
        <!-- 歌单内容区域 -->
        <div class="category-content">
          <div
            class="item"
            v-for="(item, index) in playlist"
            :key="index"
            @click="toPlaylist(item.id)"
          >
            <div class="poster">
              <div class="detail-box">
                <span class="detail">播放量：{{item.playCount | formatCount}}</span>
              </div>
              <img :src="item.coverImgUrl" alt />
              <div class="play-box">
                <span class="iconfont icon-play"></span>
              </div>
            </div>
            <p class="name">{{item.name}}</p>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="mv" name="1004">
        <!-- mv区域 -->
        <div class="list">
          <div class="item" v-for="(item, index) in mvlist" :key="index" @click="toMv(item.id)">
            <div class="cover">
              <img :src="item.cover" alt />
              <div class="play-box">
                <span class="iconfont icon-play"></span>
              </div>
              <div class="num-box">
                <span class="iconfont icon-play"></span>
                <span class="num">{{item.playCount | formatCount}}</span>
              </div>
            </div>
            <div class="detail">
              <p class="name">{{item.name}}</p>
              <p class="singer">{{item.artistName}}</p>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- 分页区域 -->
    <div class="pagination">
      <el-pagination
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        :current-page="page"
        @current-change="pageChange"
        v-show="getTotal"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { getSearch } from '../../api/search'
import { getMusicUrl } from '../../api/discovery'
export default {
  name: 'Search',
  data() {
    return {
      // 类型
      type: '1',
      // 歌曲列表
      songList: [],
      // 歌单列表
      playlist: [],
      // mv列表
      mvlist: [],
      // 总数
      total: 0,
      // 每页显示数量
      pageSize: 30,
      // 当前页码
      page: 1,
      // 偏移量
      offset: 0
    }
  },
  created() {
    // console.log('create')
    this.type = this.$store.state.searchType
    this.searchResult()
  },
  beforeUpdate () {
    // 更新前隐藏搜索面板
    this.$store.commit('setSearchPanelVisible', false)
  },
  methods: {
    // 获取搜索结果
    async searchResult() {
      const { data: res } = await getSearch({
        keywords: this.keywords,
        type: this.type,
        limit: this.pageSize,
        offset: this.offset
      })
      switch (this.type) {
        case '1':
          this.songList = res.result.songs
          this.total = res.result.songCount
          break
        case '1000':
          this.playlist = res.result.playlists
          this.total = res.result.playlistCount
          break
        case '1004':
          this.mvlist = res.result.mvs
          this.total = res.result.mvCount
          break
      }
      // console.log(res)
    },
    getName(arr) {
      const name = []
      arr.forEach(item => name.push(item.name))
      return name.join('/')
    },
    // 页面改变, 计算偏移量
    pageChange(page) {
      this.page = page
      this.offset = (page - 1) * this.pageSize
      // 根据偏移量重新获取歌单
      this.searchResult()
      // 返回顶部
      this.$refs.header.scrollIntoView({ behavior: 'smooth' })
    },
    // 跳转到歌单详情页
    toPlaylist(id) {
      this.$router.push(`/playlist?id=${id}`)
    },
    // 跳转到mv详情页
    toMv(id) {
      this.$router.push(`/mv?id=${id}`)
    },
    // 根据id获取歌曲url并传递给播放组件
    async playMusic(row) {
      const { data: res } = await getMusicUrl(row.id)
      this.$parent.musicUrl = res.data[0].url
    }
  },
  watch: {
    // 监听tab切换
    type() {
      this.searchResult()
      this.page = 1
    },
    // 监听关键字
    keywords() {
      // 关键字改变重置type
      this.type = '1'
      this.searchResult()
    }
  },
  computed: {
    // 获取关键字
    keywords() {
      return this.$route.query.keywords
    },
    getTotal() {
      return this.total === undefined ? 0 : this.total
    }
  },
  beforeRouteUpdate(to, from, next) {
    this.$store.commit('setSearchPanelVisible', false)
    next()
  },
  // 离开前存储当前tab
  beforeRouteLeave(to, from, next) {
    // console.log(this.type)
    this.$store.commit('saveSearchTab', this.type)
    next()
  }
}
</script>

<style lang="scss" scoped>
.search {
  margin: 20px 100px;
  // 头部区域
  .header {
    margin-bottom: 20px;
    .keywords {
      margin-right: 5px;
      font-size: 25px;
      font-weight: 600;
      color: #4a4a4a;
    }
    .result-num {
      font-size: 13px;
      color: #bebebe;
    }
  }
  // tab栏区域
  .el-tabs {
    ::v-deep.el-tabs__item {
      font-size: 16px;
      color: #6d6c6c;
    }
    ::v-deep.el-tabs__item:hover {
      color: #d33a31;
    }
    ::v-deep.is-active {
      color: #d33a31;
      font-weight: 700;
    }
    ::v-deep.el-tabs__active-bar {
      background-color: #d33a31;
    }
    ::v-deep.el-tabs__header {
      margin-bottom: 0;
    }
    .el-table {
      margin-bottom: 20px;
      font-size: 13px;
      &::before {
        width: 0;
      }
      ::v-deep th,
      ::v-deep td {
        padding: 6px 0;
        border: none;
      }
      ::v-deep.el-table_1_column_1 {
        color: #c0bebe;
      }
      .poster {
        position: relative;
        width: 60px;
        height: 60px;
        img {
          width: 100%;
          height: 100%;
          border-radius: 5px;
        }
        .play-box {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 25px;
          height: 25px;
          background-color: rgb(255, 255, 255, 0.6);
          border-radius: 50%;
          text-align: center;
          line-height: 24px;
          transform: translate(-50%, -50%);
          cursor: pointer;
          .icon-play {
            padding: 0 0 1px 1px;
            color: #d33a31;
            font-size: 11px;
          }
        }
      }
    }
    // 歌单内容
    .category-content {
      display: flex;
      flex-wrap: wrap;
      margin-top: 20px;
      .item {
        width: calc(20% - 10px);
        margin: 5px 5px 30px 5px;
        cursor: pointer;
        .poster {
          position: relative;
          overflow: hidden;
          .detail-box {
            position: absolute;
            left: 0;
            top: 0;
            padding: 5px;
            background-color: rgb(0, 0, 0, 0.4);
            font-size: 12px;
            color: #fff;
            transform: translateY(-100%);
            transition: all 0.5s;
          }
          img {
            width: 100%;
            height: 100%;
            border-radius: 5px;
            overflow: hidden;
          }
          .play-box {
            position: absolute;
            right: 5px;
            bottom: 10px;
            width: 36px;
            height: 36px;
            background-color: rgb(255, 255, 255, 0.7);
            border-radius: 50%;
            text-align: center;
            line-height: 36px;
            opacity: 0;
            transition: all 0.5s;
            .icon-play {
              color: #d33a31;
              font-size: 16px;
            }
          }
        }
        .name {
          display: block;
          margin: 2px;
          padding: 0;
          font-size: 13px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        &:hover {
          .detail-box {
            transform: translateY(0);
          }
          .play-box {
            opacity: 1;
          }
        }
      }
    }
    // mv列表
    .list {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 30px;
      .item {
        width: 25%;
        padding: 10px;
        cursor: pointer;
        .cover {
          position: relative;
          &:hover .play-box {
            opacity: 1;
          }
          img {
            width: 100%;
            height: 100%;
            border-radius: 6px;
            overflow: hidden;
          }
          .play-box {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 50px;
            height: 50px;
            background-color: rgb(255, 255, 255, 0.7);
            border-radius: 50%;
            text-align: center;
            line-height: 50px;
            opacity: 0;
            transform: translate(-50%, -50%);
            transition: all 0.5s;
            .icon-play {
              color: #d33a31;
              font-size: 25px;
            }
          }
          .num-box {
            position: absolute;
            top: 2px;
            right: 5px;
            color: #fff;
            font-size: 13px;
            .icon-play {
              font-size: 13px;
              margin-right: 5px;
            }
          }
        }
        .detail {
          font-size: 13px;
          .name {
            color: #333;
            margin-bottom: 0;
          }
          .singer {
            color: #bebebe;
            margin-top: 3px;
          }
        }
      }
    }
  }
  // 分页区域
  .pagination {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
    ::v-deep.el-pager li.active {
      color: #d33a31;
    }
    ::v-deep.el-pager li:hover {
      color: #d33a31;
    }
    ::v-deep.el-icon:hover {
      color: #d33a31;
    }
  }
}
</style>
