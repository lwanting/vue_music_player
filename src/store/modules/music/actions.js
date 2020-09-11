import { getMusicInfo } from '../../../api/music'
import Storage from 'good-storage'

// 数据标准化
function standarizeData(data) {
  const {
    id,
    name,
    al: { picUrl },
    ar,
    dt,
    mv
  } = data
  return {
    id,
    name,
    picUrl,
    artists: ar,
    duration: dt,
    mvid: mv
  }
}
export default {
  // 当前播放歌曲信息
  async currnetMusicInfo(context, ID) {
    const { data: res } = await getMusicInfo(ID)
    // console.log(res)
    context.commit('setCurrentMusic', standarizeData(res.songs[0]))
    // 设置播放历史
    const playHistory = context.state.playHistory
    const index = playHistory.findIndex(item => item.id === ID)
    if (index !== -1) {
      playHistory.splice(index, 1)
    }
    playHistory.unshift(standarizeData(res.songs[0]))
    context.commit('setPlayHistory', playHistory)
    Storage.set('PLAY_HISTORY', playHistory)
  },
  // 清空播放列表
  clearPlayingList(context) {
    context.commit('setCurrentMusic', {})
    context.commit('setPlayState', false)
    context.commit('setCurrentTime', 0)
    context.commit('setPlaylist', [])
  },
  // 清空播放历史
  clearPlayHistory(context) {
    context.commit('setPlayHistory', [])
    Storage.set('PLAY_HISTORY', [])
  }
}
