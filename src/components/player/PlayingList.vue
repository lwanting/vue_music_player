<template>
  <div class="playing-list" v-show="isPlayingListShow" @click.stop="playingListShow">
    <el-tabs v-model="activeName">
      <el-tab-pane label="播放列表" name="first">
        <div class="header">
          <div class="total">总共{{playlist.length}}首</div>
          <div class="clear" @click="clearPlayingList">
            <span class="iconfont icon-delete"></span>
            <span class="text">清空</span>
          </div>
        </div>
        <el-table
          :data="playlist"
          style="width: 100%"
          v-if="playlist.length"
          @row-dblclick="playMusic"
        >
          <!-- 标题 -->
          <el-table-column prop="name" label="音乐标题" width="150">
            <template v-slot="scope">
              <span :class="{'isActive': currentMusic.id === scope.row.id}">{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <!-- 歌手 -->
          <el-table-column label="歌手" width="150">
            <template v-slot="scope">{{scope.row.artists | formatSinger}}</template>
          </el-table-column>
          <!-- 时长 -->
          <el-table-column label="时长" width="100">
            <template v-slot="scope">{{scope.row.duration | formatDuration}}</template>
          </el-table-column>
        </el-table>
        <div class="empty" v-else>你还没有添加任何歌曲</div>
      </el-tab-pane>
      <el-tab-pane label="历史记录" name="second">
        <div class="header">
          <div class="total">总共{{playHistory.length}}首</div>
          <div class="clear" @click="clearPlayHistory">
            <span class="iconfont icon-delete"></span>
            <span class="text">清空</span>
          </div>
        </div>
        <el-table
          :data="playHistory"
          style="width: 100%"
          v-if="playHistory.length"
          @row-dblclick="playMusic"
        >
          <!-- 标题 -->
          <el-table-column prop="name" label="音乐标题" width="150">
            <template v-slot="scope">
              <span :class="{'isActive': currentMusic.id === scope.row.id}">{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <!-- 歌手 -->
          <el-table-column label="歌手" width="150">
            <template v-slot="scope">{{scope.row.artists | formatSinger}}</template>
          </el-table-column>
          <!-- 时长 -->
          <el-table-column label="时长" width="100">
            <template v-slot="scope">{{scope.row.duration | formatDuration}}</template>
          </el-table-column>
        </el-table>
        <div class="empty" v-else>你还没有添加任何歌曲</div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from '../../store/helper/music'
export default {
  data() {
    return {
      activeName: 'first'
      // 播放历史数据列表
      // playHistoryDate: []
    }
  },
  methods: {
    // 保持歌曲列表显示
    playingListShow() {
      this.setPlayingListVisible(true)
    },
    // 播放歌曲
    playMusic(row) {
      this.currnetMusicInfo(row.id)
    },
    ...mapMutations(['setPlayingListVisible']),
    ...mapActions(['currnetMusicInfo', 'clearPlayingList', 'clearPlayHistory'])
  },
  computed: {
    ...mapState(['isPlayingListShow', 'playlist', 'currentMusic', 'playHistory'])
  }
}
</script>

<style lang="scss" scoped>
.playing-list {
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 64px;
  width: 420px;
  background-color: #fff;
  box-shadow: -5px 0 5px -2px rgb(0, 0, 0, 0.2);
  z-index: 999;
  overflow-y: auto;
  .el-tabs {
    display: flex;
    flex-direction: column;
    flex: 1;
    position: relative;
    margin: 5px 10px;
    cursor: default;
    ::v-deep.el-tabs__header {
      display: flex;
      justify-content: center;
      .el-tabs__nav-wrap {
        .el-tabs__item {
          color: #5a5a5a;
          font-size: 15px;
          &:hover {
            color: #111;
          }
        }
        .is-active {
          color: #000;
        }
        &::after {
          display: none;
        }
      }
      .el-tabs__active-bar {
        display: none;
      }
    }
    ::v-deep.el-tabs__content {
      flex: 1;
      display: flex;
      .el-tab-pane {
        flex: 1;
        display: flex;
        flex-direction: column;
      }
    }
  }
  .header {
    display: flex;
    justify-content: space-between;
    height: 30px;
    padding-right: 20px;
    font-size: 13px;
    color: #444;
    .clear {
      cursor: pointer;
      .icon-delete {
        margin-right: 3px;
      }
    }
  }
  .el-table {
    flex: 1;
    margin-top: 10px;
    font-size: 13px;
    color: #444;
    &::before {
      display: none;
    }
    ::v-deep thead {
      tr {
        color: #4e4e4e;
      }
    }
    ::v-deep th,
    ::v-deep td {
      padding: 5px 0;
      border: none;
    }
    ::v-deep .cell {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .isActive {
      color: #c62f2f;
    }
  }
  .empty {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #444;
  }
}
</style>
