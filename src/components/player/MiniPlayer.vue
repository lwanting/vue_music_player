<template>
  <div class="mini-player">
    <!-- 歌曲信息区域 -->
    <div class="song-wrap" v-if="hasCurrentMusic">
      <!-- 歌曲封面 -->
      <div class="cover">
        <img v-lazy="currentMusic.picUrl" alt />
        <div class="zoom">
          <span class="iconfont"></span>
        </div>
      </div>
      <!-- 歌曲详细信息 -->
      <div class="detail">
        <div class="info">
          <span class="name">{{currentMusic.name}}</span>
          <span class="artists">- {{currentMusic.artists | formatSinger}}</span>
        </div>
        <div class="time">
          <span class="play-time">{{currentTime | formatDuration}} /</span>
          <span class="duration">{{currentMusic.duration | formatDuration}}</span>
        </div>
      </div>
    </div>
    <!-- 控制区域 -->
    <div class="control">
      <span class="iconfont icon-previous-song" @click="previous"></span>
      <span class="iconfont" :class="playIcon" @click="togglePlayState()"></span>
      <span class="iconfont icon-next-song" @click="next"></span>
    </div>
    <!-- 播放模式、音量、列表区域 -->
    <div class="mode">
      <!-- 播放模式 -->
      <el-popover placement="top" trigger="hover" :content="playMode.name">
        <span class="iconfont" :class="modeIcon" @click="togglePlayMode" slot="reference"></span>
      </el-popover>
      <!-- 播放列表 -->
      <el-popover placement="top" trigger="manual" content="已更新歌单" :value="isPlayingListTipShow">
        <!-- <p>已更新歌单</p> -->
        <span class="iconfont icon-song-list" @click.stop="togglePlayingListShow" slot="reference"></span>
      </el-popover>
      <!-- 音量 -->
      <div class="volume-wrap">
        <span class="iconfont" :class="volumeIcon" @click="toggleMute"></span>
        <div class="progress-wrap">
          <progress-bar showBtn :percent="volume" @percentChange="volumeChange" />
        </div>
      </div>
      <!-- 跳转github -->
      <span class="iconfont icon-github" @click="toGithub"></span>
    </div>
    <!-- 进度条区域 -->
    <div class="progress-bar-wrap" v-if="hasCurrentMusic">
      <progress-bar :percent="progressPercent" @percentChange="progressChange" />
    </div>
    <audio src @canplay="ready()" @timeupdate="timeUpdate" @ended="next" ref="audio"></audio>
  </div>
</template>

<script>
import ProgressBar from '../../base/ProgressBar'
import {
  mapState,
  mapMutations,
  mapGetters,
  mapActions
} from '../../store/helper/music'
import { getMusicUrl } from '../../api/music'
import { modelist } from '../../utils/config'
import Storage from 'good-storage'
export default {
  data() {
    return {
      // 歌曲是否准备就绪
      isReady: false,
      // 音量,默认值为0.5
      volume: Storage.get('VOLUME', 0.5)
    }
  },
  mounted() {
    // console.log(this.volume)
    this.audio.volume = this.volume
  },
  components: {
    ProgressBar
  },
  methods: {
    // 获取音乐url
    async setMusicUrl() {
      const { data: res } = await getMusicUrl(this.currentMusic.id)
      // 将歌曲url传给audio
      this.audio.src = res.data[0].url
    },
    // 歌曲加载完成
    ready() {
      this.isReady = true
    },
    // 播放时间改变
    timeUpdate(e) {
      this.setCurrentTime(e.target.currentTime * 1000)
    },
    // 播放歌曲
    play() {
      // console.log(this.isReady)
      if (this.isReady) {
        this.audio.play()
        this.setPlayState(true)
      }
    },
    // 暂停播放
    pause() {
      this.audio.pause()
    },
    // 上一首歌曲
    previous() {
      if (this.isReady) {
        this.currnetMusicInfo(this.prevMusic)
      }
    },
    // 下一首歌曲
    next() {
      if (this.isReady) {
        this.currnetMusicInfo(this.nextMusic)
      }
    },
    // 切换播放状态
    togglePlayState() {
      if (!this.hasCurrentMusic) {
        return
      }
      this.setPlayState(!this.playState)
    },
    // 切换静音与非静音状态
    toggleMute() {
      this.volume = this.volume ? 0 : Storage.get('VOLUME')
      this.audio.volume = this.volume
    },
    // 切换播放列表的显示与隐藏
    togglePlayingListShow() {
      this.setPlayingListVisible(!this.isPlayingListShow)
    },
    // 切换播放模式
    togglePlayMode() {
      for (let i = 0; i < modelist.length; i++) {
        if (modelist[i].type === this.playMode.type) {
          let index = i + 1
          if (index === modelist.length) {
            index = 0
          }
          this.setPlayMode(modelist[index])
          return false
        }
      }
    },
    // 重新设置当前播放时间
    progressChange(percent) {
      this.audio.currentTime = (percent * this.currentMusic.duration) / 1000
    },
    // 重新设置音量并保存
    volumeChange(percent) {
      if (percent < 0.03) {
        percent = 0
      }
      this.audio.volume = percent
      this.volume = percent
      Storage.set('VOLUME', percent)
    },
    // 跳转到github主页
    toGithub() {
      window.open('https://github.com/lwanting')
    },
    ...mapMutations([
      'setCurrentMusic',
      'setPlayState',
      'setCurrentTime',
      'setPlayingListVisible',
      'setPlayMode'
    ]),
    ...mapActions(['currnetMusicInfo'])
  },
  computed: {
    // 是否有歌曲播放，控制歌曲信息的显示与隐藏
    hasCurrentMusic() {
      return this.currentMusic.id !== undefined && this.currentMusic.id !== null
    },
    // 获取audio
    audio() {
      return this.$refs.audio
    },
    // 根据播放状态切换控制图标
    playIcon() {
      return this.playState ? 'icon-pause-button' : 'icon-play-button'
    },
    // 根据音量是否为0切换音量图标
    volumeIcon() {
      return this.volume ? 'icon-volume' : 'icon-mute'
    },
    // 根据播放模式切换图标
    modeIcon() {
      return this.playMode.icon
    },
    // 计算播放进度百分比
    progressPercent() {
      return this.currentTime / this.currentMusic.duration
    },
    ...mapState([
      'currentMusic',
      'currentTime',
      'playState',
      'isPlayingListShow',
      'isPlayingListTipShow',
      'playMode'
    ]),
    ...mapGetters(['prevMusic', 'nextMusic'])
  },
  watch: {
    // 监听当前播放歌曲
    currentMusic(newMusic, oldMusic) {
      // console.log('watch')
      // 单曲循环模式上一首下一首
      if (oldMusic && oldMusic.id === newMusic.id) {
        this.audio.currentTime = 0
        this.setCurrentTime(0)
        this.play()
        return false
      }
      this.isReady = false
      this.setMusicUrl()
      // 延迟1s确保音频加载完
      setTimeout(() => {
        // 播放
        this.play()
      }, 1000)
    },
    // 监听播放状态
    playState(play) {
      play ? this.play() : this.pause()
    }
  }
}
</script>

<style lang="scss" scoped>
.mini-player {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  padding: 0 25px;
  height: 100%;
  box-shadow: -5px 0 5px -2px rgb(0, 0, 0, 0.2);
  // 歌曲信息区域
  .song-wrap {
    flex: 4;
    display: flex;
    .cover {
      width: 50px;
      height: 50px;
      margin-right: 10px;
      border-radius: 6px;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .detail {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 3px 0;
      .info {
        color: #333;
        .name {
          font-size: 16px;
        }
        .artists {
          font-size: 12px;
        }
      }
      .time {
        color: #4b4b4b;
        font-size: 12px;
      }
    }
  }
  // 控制区域
  .control {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    color: #d33a31;
    span[class$='-song'] {
      font-size: 25px;
      cursor: pointer;
    }
    .icon-play-button {
      font-size: 60px;
      margin: 0 18px;
      cursor: pointer;
    }
    .icon-pause-button {
      font-size: 52px;
      margin: 0 22px;
      cursor: pointer;
    }
  }
  // 播放模式、音量、列表区域
  .mode {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex: 6;
    .iconfont {
      font-size: 23px;
      color: #333;
      cursor: pointer;
    }
    .icon-order-play,
    .icon-loop-play,
    .icon-random-play {
      margin-right: 30px;
      font-size: 21px;
      outline: none;
    }
    .icon-song-list {
      margin-right: 25px;
      outline: none;
    }
    .volume-wrap {
      display: flex;
      align-items: center;
      width: 150px;
      margin-right: 25px;
      .icon-volume {
        margin-right: 10px;
      }
      .progress-wrap {
        flex: 1;
      }
    }
  }
  // 进度条区域
  .progress-bar-wrap {
    position: absolute;
    top: -15px;
    left: 0;
    right: 0;
  }
  audio {
    display: none;
  }
}
</style>
