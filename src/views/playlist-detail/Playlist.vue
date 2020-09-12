<template>
  <div class="playlist" ref="playlist">
    <!-- 歌单封面及介绍 -->
    <div class="header-wrap">
      <div class="cover">
        <img v-lazy="playlist.coverImgUrl" alt />
      </div>
      <div class="detail">
        <h4 class="name">{{playlist.name}}</h4>
        <div class="creator-wrap">
          <img v-lazy="playlist.creator.avatarUrl" alt />
          <span class="creator">{{playlist.creator.nickname}}</span>
          <span class="create-time">{{playlist.createTime | date}} 创建</span>
        </div>
        <p class="tag">标签：{{tag}}</p>
        <p class="desc">{{playlist.description}}</p>
      </div>
    </div>
    <!-- tab栏 -->
    <el-tabs v-model="activeTab">
      <el-tab-pane label="歌曲列表" name="list">
        <!-- 歌曲列表表格 -->
        <el-table :data="songList" style="width: 100%" class="songTable">
          <!-- 序号 -->
          <el-table-column type="index" width="60">
            <template
              v-slot="scope"
            >{{scope.$index+1 &lt; 10 ? '0'+(scope.$index+1) : scope.$index+1}}</template>
          </el-table-column>
          <!-- 封面 -->
          <el-table-column width="100">
            <template v-slot="scope">
              <div class="poster">
                <img v-lazy="scope.row.al.picUrl" alt />
                <div class="play-box" @click="playMusic(scope.row.id)">
                  <span class="iconfont icon-play"></span>
                </div>
              </div>
            </template>
          </el-table-column>
          <!-- 标题 -->
          <el-table-column prop="name" label="音乐标题" width="350"></el-table-column>
          <!-- 歌手 -->
          <el-table-column label="歌手" width="300">
            <template v-slot="scope">{{scope.row.ar | formatSinger}}</template>
          </el-table-column>
          <!-- 专辑 -->
          <el-table-column prop="al.name" label="专辑" width="300"></el-table-column>
          <!-- 时长 -->
          <el-table-column label="时长">
            <template v-slot="scope">{{scope.row.dt | formatDuration}}</template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane :label="`评论(${total})`" name="commend">
        <!-- 精彩评论 -->
        <div class="hotComments" v-if="hotComments.length">
          <h3>精彩评论</h3>
          <div class="comment" v-for="(item, index) in hotComments" :key="index">
            <div class="avatar">
              <img v-lazy="item.user.avatarUrl" alt />
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
        <!-- 最新评论 -->
        <div class="comments">
          <h3>最新评论</h3>
          <div class="comment" v-for="(item, index) in comments" :key="index">
            <div class="avatar">
              <img v-lazy="item.user.avatarUrl" alt />
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
        <!-- 分页区域 -->
        <div class="pagination">
          <el-pagination
            layout="prev, pager, next"
            :total="total"
            :page-size="30"
            :current-page="page"
            @current-change="pageChange"
          ></el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getPlaylistDetail, getPlaylistComment } from '../../api/playlist'
import { getMusicInfo } from '../../api/music'
import moment from 'moment'
import { mapMutations, mapActions } from '../../store/helper/music'
// import { getMusicUrl } from '../../api/discovery'
export default {
  data() {
    return {
      // 歌单列表
      playlist: {
        // 歌单封面
        coverImgUrl: '',
        // 创建时间
        createTime: '',
        // 歌单名
        name: '',
        // 创建信息
        creator: {
          // 头像
          avatarUrl: '',
          // 名字
          nickname: ''
        },
        // 歌单标签
        tags: [],
        // 歌单介绍
        description: '',
        trackIds: []
      },
      // tab栏
      activeTab: 'list',
      // 歌曲列表数据
      songList: [],
      // 精彩评论
      hotComments: [],
      // 最新评论
      comments: [],
      // 评论总数
      total: 0,
      // 当前页码
      page: 1,
      // 偏移量
      offset: 0
    }
  },
  created() {
    this.playlistDetail()
    this.playlistComment()
  },
  methods: {
    // 获取歌单详情数据
    async playlistDetail() {
      const { data: res } = await getPlaylistDetail(this.id)
      this.playlist = res.playlist
      this.songList = res.playlist.tracks
      this.playMusicSongs()
      // console.log(this.playlist)
    },
    // 根据trackIds获取歌单全部歌曲
    async playMusicSongs() {
      // console.log(this.playlist.trackIds)
      const ids = this.playlist.trackIds.map(song => song.id).join(',')
      const { data: res } = await getMusicInfo(ids)
      this.songList = res.songs
    },
    // 获取歌单评论
    async playlistComment() {
      const { data: res } = await getPlaylistComment({
        id: this.id,
        limit: 30,
        offset: this.offset
      })
      if (!this.offset) {
        this.hotComments = res.hotComments
      } else {
        this.hotComments.length = 0
      }
      this.comments = res.comments
      this.total = res.total
      // console.log(this.comments)
    },
    // 页码改变，计算偏移量
    pageChange(page) {
      this.page = page
      this.offset = (page - 1) * 30
      // 根据偏移量获取评论
      this.playlistComment()
      // 返回顶部
      this.$refs.playlist.scrollIntoView({ behavior: 'smooth' })
    },
    // 根据id获取歌曲信息,设置播放列表
    async playMusic(id) {
      this.currnetMusicInfo(id)
      this.setPlaylist(this.standarizeSongs)
    },
    ...mapMutations(['setPlaylist']),
    ...mapActions(['currnetMusicInfo'])
  },
  computed: {
    // 获取id
    id() {
      return this.$route.query.id
    },
    // 获取标签
    tag() {
      return this.playlist.tags.join('/')
    },
    // 处理歌曲数据(标准化)
    standarizeSongs() {
      const songs = this.songList.map(song => {
        const { id, name, ar, dt, mv } = song
        return {
          id,
          name,
          artists: ar,
          duration: dt,
          mvid: mv
        }
      })
      return songs
    }
  },
  filters: {
    // 格式化歌单创建时间
    date(time) {
      return moment(time).format('YYYY-MM-DD')
    },
    // 格式化歌曲时长
    duration(time) {
      return moment(time).format('mm:ss')
    },
    // 评论时间
    commentDate(time) {
      return moment(time).format('YYYY-MM-DD hh:mm:ss')
    }
  }
}
</script>

<style lang="scss" scoped>
.playlist {
  margin: 30px 30px 0 30px;
  .header-wrap {
    display: flex;
    margin-bottom: 40px;
    .cover {
      width: 200px;
      height: 200px;
      margin-right: 20px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .detail {
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: space-between;
      .name {
        margin-top: 0;
        font-weight: 350;
        color: #333;
        font-size: 17px;
      }
      .creator-wrap {
        display: flex;
        align-items: center;
        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-right: 10px;
        }
        .creator {
          margin-right: 10px;
          font-size: 15px;
        }
        .create-time {
          margin-right: 10px;
          font-size: 13px;
        }
      }
      .tag {
        margin-bottom: 0;
        font-size: 15px;
        color: #4a4a4a;
      }
      .desc {
        display: -webkit-box;
        font-size: 15px;
        color: #4a4a4a;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }
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
      font-size: 13px;
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
    h3 {
      margin: 15px 0;
      font-size: 18px;
      color: #333;
    }
    // 评论
    .hotComments,
    .comments {
      margin-bottom: 30px;
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
}
</style>
