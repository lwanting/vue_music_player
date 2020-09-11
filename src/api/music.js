import request from '../utils/request'

// 根据id获取歌曲详细信息(一次可获取多个)
export const getMusicInfo = ids => request.get(`/song/detail?ids=${ids}`)

// 获取音乐url
export const getMusicUrl = id => request.get(`/song/url?id=${id}`)
