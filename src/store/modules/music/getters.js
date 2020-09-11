
export default {
  // 正在播放歌曲的index
  currentMusicIndex(state) {
    return state.playlist.findIndex(item => item.id === state.currentMusic.id)
  },
  // 单曲循环和随机播放模式
  loopAndRandom(state, getters) {
    let index = 0
    // 单曲循环模式
    if (state.playMode.type === 'loop') {
      index = getters.currentMusicIndex
    }
    // 随机播放模式
    if (state.playMode.type === 'random') {
      // 避免只有一首歌的情况下,一直循环
      if (state.playlist.length === 1) {
        return getters.currentMusicIndex
      }
      index = Math.round(Math.random() * (state.playlist.length - 1))
      if (index === getters.currentMusicIndex) {
        index = getters.loopAndRandom
      }
    }
    return index
  },
  // 获取上一首歌曲
  prevMusic(state, getters) {
    let index = getters.currentMusicIndex - 1
    if (state.playMode.type === 'order') {
      index = index < 0 ? state.playlist.length - 1 : index
    } else {
      index = getters.loopAndRandom
    }
    return state.playlist[index]
  },
  // 获取下一首歌曲
  nextMusic(state, getters) {
    let index = getters.currentMusicIndex + 1
    if (state.playMode.type === 'order') {
      index = index > state.playlist.length - 1 ? 0 : index
    } else {
      index = getters.loopAndRandom
    }
    return state.playlist[index]
  }
}
