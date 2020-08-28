<template>
  <div class="discovery">
    <!-- 轮播图 -->
    <div class="banner">
      <el-carousel :interval="4000" type="card" class="banner-carousel">
        <el-carousel-item v-for="(item, index) in banners" :key="index">
          <img :src="item.imageUrl" alt />
        </el-carousel-item>
      </el-carousel>
    </div>
    <!-- 推荐歌单 -->
    <div class="recommend">
      <h3 class="title">推荐歌单</h3>
      <div class="list">
        <div class="item" v-for="(item, index) in commend" :key="index">
          <div class="poster">
            <div class="detail-box">
              <span class="detail">{{item.copywriter}}</span>
            </div>
            <img :src="item.picUrl" alt />
            <div class="play-box">
              <span class="iconfont icon-play"></span>
            </div>
          </div>
          <p class="name">{{item.name}}</p>
        </div>
      </div>
    </div>
    <!-- 最新音乐 -->
    <div class="new-songs">
      <h3 class="title">最新音乐</h3>
      <div class="list">
        <div class="item" v-for="(item, index) in songs" :key="index">
          <div class="order-box">
            <span class="order">{{ index+1 &lt; 10 ? '0'+(index+1) : index+1 }}</span>
          </div>
          <div class="poster" @click="playMusic(item.id)">
            <img :src="item.picUrl" alt />
            <div class="play-box">
              <span class="iconfont icon-play"></span>
            </div>
          </div>
          <div class="detail">
            <p class="song-name">{{item.name}}</p>
            <p
              class="singer"
            >{{ item.song.album.artists.length &gt; 1 ? singer(item.song.album.artists) : item.song.album.artists[0].name}}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 推荐mv -->
    <div class="mvs">
      <h3 class="title">推荐MV</h3>
      <div class="list">
        <div class="item" v-for="(item, index) in mvs" :key="index">
          <div class="cover">
            <img :src="item.picUrl" alt />
            <div class="play-box">
              <span class="iconfont icon-play"></span>
            </div>
            <div class="num-box">
              <span class="iconfont icon-play"></span>
              <span class="num">{{item.playCount}}</span>
            </div>
          </div>
          <div class="detail">
            <p class="name">{{item.name}}</p>
            <p class="singer">{{item.artistName}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getBanners, getCommend, getNewSongs, getMvs, getMusicUrl } from '../../api/discovery'
export default {
  data() {
    return {
      // 存储轮播图数据
      banners: [],
      // 存储推荐列表
      commend: [],
      // 存储音乐列表
      songs: [],
      // 存储推荐MV列表
      mvs: []
    }
  },
  created() {
    // 轮播图
    this.setBanners()
    this.setCommend()
    this.setNewSongs()
    this.setMvs()
  },
  methods: {
    // 获取轮播图
    async setBanners() {
      const { data: res } = await getBanners()
      this.banners = res.banners
      // console.log(this.banners)
    },
    // 获取推荐歌单
    async setCommend() {
      const { data: res } = await getCommend({
        limit: 10
      })
      this.commend = res.result
      // console.log(res)
    },
    // 获取最新音乐
    async setNewSongs() {
      const { data: res } = await getNewSongs()
      this.songs = res.result
      // console.log(this.songs)
    },
    // 一首歌对应多个歌手
    singer(artists) {
      const arr = artists.map(item => item.name)
      return arr.join('/')
    },
    // 获取推荐MV
    async setMvs() {
      const { data: res } = await getMvs()
      this.mvs = res.result
      // console.log(res)
    },
    // 根据id获取歌曲url并传递给播放组件
    async playMusic(id) {
      const { data: res } = await getMusicUrl(id)
      this.$parent.musicUrl = res.data[0].url
    }
  }
}
</script>

<style lang="scss" scoped>
.discovery {
  margin: 30px 120px 0 120px;
  .title {
    font-size: 20px;
    font-weight: 400;
    color: #333333;
  }
  // 轮播图
  .banner-carousel {
    ::v-deep .el-carousel__container {
      height: 220px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  // 推荐歌单
  .recommend {
    .list {
      display: flex;
      flex-wrap: wrap;
      .item {
        width: calc(20% - 10px);
        // height: 180px;
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
  }
  // 最新音乐
  .new-songs {
    margin-bottom: 40px;
    .list {
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      height: 440px;
      margin-left: 20px;
      .item {
        display: flex;
        width: 50%;
        height: 20%;
        cursor: pointer;
        .order-box {
          display: flex;
          align-items: center;
          width: 20px;
          margin-right: 5px;
          font-size: 12px;
          color: #333;
        }
        .poster {
          display: flex;
          position: relative;
          width: 70px;
          margin: 10px;
          img {
            width: 100%;
          }
          .play-box {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 30px;
            height: 30px;
            background-color: rgb(255, 255, 255, 0.7);
            border-radius: 50%;
            text-align: center;
            line-height: 30px;
            opacity: 0;
            transform: translate(-50%, -50%);
            transition: all 0.5s;
            .icon-play {
              color: #d33a31;
              font-size: 13px;
            }
          }
          &:hover .play-box {
            opacity: 1;
          }
        }
        .detail {
          display: flex;
          flex-direction: column;
          font-size: 13px;
          color: #333;
        }
      }
    }
  }
  // 推荐MV
  .mvs {
    .list {
      display: flex;
      margin-bottom: 30px;
      .item {
        width: 25%;
        margin: 10px;
        .cover {
          position: relative;
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
        &:hover .play-box {
          opacity: 1;
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
}
</style>
