// 判断数组是否相同
function equal(a, b) {
  if (a.length !== b.length) {
    return false
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false
    }
  }
  return true
}
export default {
  // 存储当前播放歌曲信息
  setCurrentMusic(state, info) {
    // console.log(info)
    state.currentMusic = info
  },
  // 设置播放状态
  setPlayState(state, play) {
    state.playState = play
  },
  // 设置当前播放时长
  setCurrentTime(state, time) {
    state.currentTime = time
  },
  // 设置播放列表的显示与隐藏
  setPlayingListVisible(state, show) {
    state.isPlayingListShow = show
  },
  // 设置播放列表数据
  setPlaylist(state, playlist) {
    if (!equal(state.playlist, playlist)) {
      // console.log('update')
      state.playlist = playlist
      state.isPlayingListTipShow = true
      setTimeout(() => {
        state.isPlayingListTipShow = false
      }, 2000)
    }
  },
  // 设置播放历史
  setPlayHistory(state, playHistory) {
    state.playHistory = playHistory
  },
  // 设置播放模式
  setPlayMode(state, mode) {
    state.playMode = mode
  }
}
