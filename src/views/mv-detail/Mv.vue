<template>
  <div class="mv">
    <div class="left">
      <h3 class="title">mv详情</h3>
      <div class="player">
        <video :src="url" controls></video>
      </div>
      <div class="author-info">
        <div class="avatar">
          <img :src="artist.picUrl" alt />
        </div>
        <span class="singer">{{artist.name}}</span>
      </div>
      <div class="mv-info">
        <h3 class="name">{{mvInfo.name}}</h3>
        <div class="desc-wrap">
          <span class="time">发布：{{mvInfo.publishTime}}</span>
          <span class="count">播放：{{mvInfo.playCount | formatCount}}次</span>
          <div class="desc" v-if="mvInfo.desc">简介：{{mvInfo.desc}}</div>
        </div>
      </div>
      <!-- 评论区域 -->
      <div class="comment-wrap" ref="comment">
        <!-- 精彩评论 -->
        <div class="hotComments" v-if="hotComments.length">
          <h3>精彩评论</h3>
          <div class="comment" v-for="(item, index) in hotComments" :key="index">
            <div class="avatar">
              <img :src="item.user.avatarUrl" alt />
            </div>
            <div class="detail">
              <div class="content-wrap">
                <span class="name">{{item.user.nickname}}：</span>
                <span class="content">{{item.content}}</span>
              </div>
              <div class="bottom">
                <span class="time">{{item.tiem | formatCommentDate}}</span>
                <div class="like">
                  <span class="iconfont icon-like">{{item.likedCount}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 最新评论 -->
        <div class="comments">
          <h3>最新评论</h3>
          <div class="comment" v-for="(item, index) in comments" :key="index">
            <div class="avatar">
              <img :src="item.user.avatarUrl" alt />
            </div>
            <div class="detail">
              <div class="content-wrap">
                <span class="name">{{item.user.nickname}}：</span>
                <span class="content">{{item.content}}</span>
              </div>
              <!-- 回复 -->
              <div class="replied" v-if="item.beReplied.length">
                <span class="name">{{item.beReplied[0].user.nickname}}：</span>
                <span class="content">{{item.beReplied[0].content}}</span>
              </div>
              <div class="bottom">
                <span class="time">{{item.tiem | formatCommentDate}}</span>
                <div class="like">
                  <span class="iconfont icon-like">{{item.likedCount}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 分页区域 -->
      <div class="pagination">
        <el-pagination
          layout="prev, pager, next"
          :total="total"
          :page-size="20"
          :current-page="page"
          @current-change="pageChange"
        ></el-pagination>
      </div>
    </div>
    <div class="right">
      <h3 class="title">相关推荐</h3>
      <!-- 相关mv推荐 -->
      <div class="similar">
        <div
          class="simi-mv"
          v-for="(item, index) in simiMvList"
          :key="index"
          @click="toMv(item.id)"
        >
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
          <div class="detail-wrap">
            <p class="name">{{item.name}}</p>
            <p class="singer">{{item.artistName}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getMvData,
  getMvUrl,
  getMvComment,
  getArtistInfo,
  getSimiMv
} from '../../api/mv'
export default {
  data() {
    return {
      mvInfo: {
        // 歌单id
        id: 0,
        // 歌手id
        artistId: 0,
        // 简介
        desc: '',
        // mv名
        name: '',
        // 播放次数
        playCount: 0,
        // 发布时间
        publishTime: ''
      },
      // 歌手信息
      artist: {
        name: '',
        picUrl: ''
      },
      // mv的url
      url: '',
      // 精彩评论
      hotComments: [],
      // 最新评论
      comments: [],
      // 评论数
      total: 0,
      // 当前页码
      page: 1,
      // 偏移量
      offset: 0,
      // 相关mv
      simiMvList: []
    }
  },
  created() {
    // 隐藏侧边导航栏
    this.$store.commit('setMenuShow', false)
    // this.mvData()
    // this.mvUrl()
    // this.mvComment()
    // this.simiMv()
    // 获取数据
    this.setMvDate()
  },
  computed: {
    id() {
      return this.$route.query.id
    }
  },
  methods: {
    async setMvDate() {
      // 获取mv详情
      const { data: mvinfo } = await getMvData(this.id)
      this.mvInfo = mvinfo.data
      // 获取歌手信息
      const { data: singer } = await getArtistInfo(this.mvInfo.artistId)
      this.artist = singer.artist
      // 获取mv的url
      const { data: mv } = await getMvUrl(this.id)
      this.url = mv.data.url
      // 获取相关mv
      const { data: simiMv } = await getSimiMv(this.id)
      this.simiMvList = simiMv.mvs
      // 获取mv评论
      this.mvComment()
    },
    // 获取mv评论
    async mvComment() {
      const { data: res } = await getMvComment({
        id: this.id,
        limit: 20,
        offset: this.offset
      })
      if (!this.offset) {
        this.hotComments = res.hotComments
      } else {
        this.hotComments.length = 0
      }
      this.comments = res.comments
      this.total = res.total
      // console.log(res)
    },
    // 页码改变，计算偏移量
    pageChange(page) {
      this.offset = (page - 1) * 20
      this.mvComment()
      this.$refs.comment.scrollIntoView({ behavior: 'smooth' })
    },
    // 跳转到mv详情页
    toMv(id) {
      this.$router.push(`/mv?id=${id}`)
    }
  },
  watch: {
    // id改变重新获取数据
    '$route.query.id'() {
      this.setMvDate()
    }
  },
  beforeDestroy() {
    // 显示侧边导航栏
    this.$store.commit('setMenuShow', true)
  }
}
</script>

<style lang="scss" scoped>
.mv {
  display: flex;
  margin: 0 240px;
  .title {
    color: #333;
  }
  .left {
    width: 64%;
    .player {
      width: 100%;
      height: 380px;
      margin-bottom: 20px;
      background-color: #000;
      video {
        width: 100%;
        height: 100%;
        outline: none;
        border-radius: 5px;
      }
    }
    .author-info {
      display: flex;
      align-items: center;
      .avatar {
        width: 60px;
        height: 60px;
        margin-right: 10px;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .singer {
        color: #444;
      }
    }
    .mv-info {
      .name {
        margin-bottom: 10px;
        font-size: 25px;
        color: #444;
      }
      .desc-wrap {
        margin-bottom: 40px;
        font-size: 13px;
        color: #bebebe;
        .time {
          margin-right: 30px;
        }
        .desc {
          margin-top: 15px;
          color: #333;
        }
      }
    }
    // 评论
    .comment-wrap {
      .hotComments,
      .comments {
        margin-bottom: 40px;
        .comment {
          display: flex;
          margin-top: 20px;
          .avatar {
            margin-right: 10px;
            img {
              width: 50px;
              height: 50px;
              border-radius: 50%;
            }
          }
          .detail {
            width: 100%;
            padding-bottom: 20px;
            border-bottom: 1px solid #f2f2f1;
            font-size: 13px;
            .content-wrap {
              margin: 5px 0 7px 0;
              .name {
                color: #517eaf;
              }
            }
            .replied {
              padding: 10px;
              background-color: #e6e5e6;
              border-radius: 5px;
              .name {
                color: #517eaf;
              }
            }
            .bottom {
              display: flex;
              justify-content: space-between;
              align-items: center;
              color: #bebebe;
              .like {
                .icon-like {
                  font-size: 15px;
                }
              }
            }
          }
        }
      }
    }
    // 分页区域
    .pagination {
      display: flex;
      justify-content: center;
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
  .right {
    flex: 1;
    padding-left: 30px;
    .similar {
      .simi-mv {
        display: flex;
        align-items: center;
        margin: 10px 0;
        cursor: pointer;
        &:hover {
          background-color: #ebebeb;
        }
        .cover {
          position: relative;
          width: 150px;
          margin-right: 10px;
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
        .detail-wrap {
          flex: 1;
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
