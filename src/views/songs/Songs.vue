<template>
  <div class="songs">
    <!-- tab栏歌曲地区分类 -->
    <div class="region-tab">
      <ul class="region">
        <li
          class="item"
          :class="{active: isActive==item.type}"
          v-for="(item, index) in tabs"
          :key="index"
          @click="toggle(item.type)"
        >{{item.title}}</li>
      </ul>
    </div>
    <!-- 歌曲列表表格 -->
    <el-table :data="songList" style="width: 81%" class="songTable">
      <!-- 序号 -->
      <el-table-column type="index" width="60">
        <template v-slot="scope">{{scope.$index+1 &lt; 10 ? '0'+(scope.$index+1) : scope.$index+1}}</template>
      </el-table-column>
      <!-- 封面 -->
      <el-table-column width="100">
        <template v-slot="scope">
          <div class="poster">
            <img :src="scope.row.album.picUrl" alt />
            <div class="play-box" @click="playMusic(scope.row.id)">
              <span class="iconfont icon-play"></span>
            </div>
          </div>
        </template>
      </el-table-column>
      <!-- 标题 -->
      <el-table-column prop="name" label="音乐标题" width="300"></el-table-column>
      <!-- 歌手 -->
      <el-table-column label="歌手" width="270">
        <template v-slot="scope">{{getName(scope.row.artists)}}</template>
      </el-table-column>
      <!-- 专辑 -->
      <el-table-column prop="album.name" label="专辑" width="200"></el-table-column>
      <!-- 时长 -->
      <el-table-column label="时长" width="100">
        <template v-slot="scope">{{scope.row.duration | formatDuration}}</template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getTopSong } from '../../api/songs'
import { getMusicUrl } from '../../api/discovery'
export default {
  data() {
    return {
      // tab栏歌曲地区
      tabs: [
        {
          title: '全部',
          type: 0
        },
        {
          title: '华语',
          type: 7
        },
        {
          title: '欧美',
          type: 96
        },
        {
          title: '日本',
          type: 8
        },
        {
          title: '韩国',
          type: 16
        }
      ],
      // 当前tab项
      isActive: 0,
      // 音乐列表
      songList: []
    }
  },
  created () {
    this.topSong()
  },
  methods: {
    // 根据type获取最新音乐
    async topSong() {
      const { data: res } = await getTopSong(this.isActive)
      this.songList = res.data
      // console.log(res)
    },
    getName(arr) {
      const name = []
      arr.forEach(item => name.push(item.name))
      return name.join('/')
    },
    // 切换tab
    toggle(type) {
      this.isActive = type
      // 重新获取音乐
      this.topSong()
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
.songs {
  .region-tab {
    position: relative;
    height: 30px;
    margin: 30px 0;
    .region {
      position: absolute;
      top: 0;
      right: 120px;
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
  .el-table {
    margin-left: 50%;
    font-size: 13px;
    transform: translateX(-50%);
    ::v-deep th,
    ::v-deep td {
      padding: 6px 0;
      border: none;
    }
    ::v-deep.el-table_1_column_1 {
      color: #c0bebe;
      text-align: center;
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
}
</style>
