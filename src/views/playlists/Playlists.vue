<template>
  <div class="playlists" ref="playlists">
    <!-- 顶部精品歌单卡片 -->
    <div class="top-card">
      <div class="cover">
        <img v-lazy="highQuality.coverImgUrl" alt />
      </div>
      <div class="detail">
        <div class="tag">精品歌单</div>
        <p class="title">{{highQuality.name}}</p>
        <p class="info">{{highQuality.description}}</p>
      </div>
      <img v-lazy="highQuality.coverImgUrl" alt class="background" />
    </div>
    <!-- tab栏歌单分类 -->
    <div class="category-tab">
      <ul class="category">
        <li
          class="item"
          :class="{active: isActive==item}"
          v-for="(item, index) in tabs"
          :key="index"
          @click="toggle(index, item)"
        >{{item}}</li>
      </ul>
    </div>
    <!-- 歌单内容区域 -->
    <div class="category-content">
      <div class="item" v-for="(item, index) in topList" :key="index" @click="toPlaylist(item.id)">
        <div class="poster">
          <div class="detail-box">
            <span class="detail">播放量：{{item.playCount | formatCount}}</span>
          </div>
          <img v-lazy="item.coverImgUrl" alt />
          <div class="play-box">
            <span class="iconfont icon-play"></span>
          </div>
        </div>
        <p class="name">{{item.name}}</p>
      </div>
    </div>
    <!-- 分页区域 -->
    <div class="pagination">
      <el-pagination
        layout="prev, pager, next"
        :total="total"
        :page-size="50"
        :current-page="page"
        @current-change="pageChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { getHighQuality, getTopList } from '../../api/playlists'
export default {
  created() {
    // 精品歌单
    this.setHighQuality()
    // 精选歌单
    this.setTopList()
    this.isActive = this.$store.state.playlistTab
  },
  data() {
    return {
      // 精品歌单
      highQuality: [],
      // 热门分类
      tabs: [
        '全部',
        '欧美',
        '华语',
        '流行',
        '说唱',
        '摇滚',
        '民谣',
        '电子',
        '轻音乐',
        '影视原声',
        'ACG',
        '怀旧',
        '治愈',
        '旅行'
      ],
      // 当前选择分类
      isActive: '全部',
      // 精选歌单
      topList: [],
      // 歌单总数
      total: 0,
      // 当前页数
      page: 1,
      // 偏移量
      offset: 0
    }
  },
  methods: {
    // 切换tab
    toggle(id, cate) {
      this.isActive = cate
      // 重新获取精品歌单和精选歌单
      this.setHighQuality()
      this.setTopList()
      // 返回第一页
      this.page = 1
    },
    // 获取精品歌单
    async setHighQuality() {
      const { data: res } = await getHighQuality(1, this.isActive)
      // console.log(res)
      this.highQuality = res.playlists[0]
    },
    // 获取精选歌单
    async setTopList() {
      const { data: res } = await getTopList({
        cat: this.isActive,
        offset: this.offset
      })
      // console.log(res)
      this.topList = res.playlists
      this.total = res.total
    },
    // 页面改变, 计算偏移量
    pageChange(page) {
      this.page = page
      this.offset = (page - 1) * 50
      // 根据偏移量重新获取歌单
      this.setTopList()
      // 返回顶部
      this.$refs.playlists.scrollIntoView({ behavior: 'smooth' })
    },
    // 跳转到歌单详情页面
    toPlaylist(id) {
      this.$router.push(`/playlist?id=${id}`)
    }
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit('savePlaylistTab', this.isActive)
    next()
  }
}
</script>

<style lang="scss" scoped>
.playlists {
  margin: 30px 120px 0 120px;
  // 顶部精品歌单卡片
  .top-card {
    display: flex;
    position: relative;
    height: 200px;
    padding: 20px;
    overflow: hidden;
    cursor: pointer;
    .cover {
      margin-right: 10px;
      img {
        width: 160px;
        height: 160px;
        vertical-align: middle;
      }
    }
    .detail {
      flex: 1;
      .tag {
        width: 100px;
        height: 30px;
        border: 1px solid #dfac67;
        border-radius: 5px;
        text-align: center;
        line-height: 30px;
        font-size: 15px;
        color: #dfac67;
      }
      .title {
        margin-bottom: 5px;
        color: #fff;
      }
      .info {
        font-size: 12px;
        color: rgb(255, 255, 255, 0.5);
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 5;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    // 背景图片
    .background {
      position: absolute;
      right: 0;
      bottom: 0;
      z-index: -999;
      filter: blur(20px);
    }
  }
  // 歌单分类tab栏
  .category-tab {
    position: relative;
    height: 30px;
    margin-top: 30px;
    .category {
      position: absolute;
      top: 0;
      right: 0;
      .item {
        margin: 5px 10px;
        float: left;
        font-size: 14px;
        color: gray;
        cursor: pointer;
      }
      .active {
        color: #d74d45;
      }
    }
  }
  // 歌单内容
  .category-content {
    display: flex;
    flex-wrap: wrap;
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
  // 分页区域
  .pagination {
    display: flex;
    justify-content: center;
    margin-bottom: 30px;
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
