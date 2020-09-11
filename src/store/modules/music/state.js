import Storage from 'good-storage'
import { modelist } from '../../../utils/config'

export default {
  // 当前播放歌曲信息
  currentMusic: {},
  // 当前播放时长
  currentTime: 0,
  // 当前播放状态
  playState: false,
  // 播放列表显示与隐藏
  isPlayingListShow: false,
  // 播放列表更新提示的显示与隐藏
  isPlayingListTipShow: false,
  // 播放列表
  playlist: [],
  // 播放历史
  playHistory: Storage.get('PLAY_HISTORY', []),
  // 播放模式
  playMode: modelist[0]
}
