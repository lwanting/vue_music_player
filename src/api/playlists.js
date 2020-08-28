import request from '../utils/request'

// 获取精品歌单
export const getHighQuality = (limit, cat) => request.get(`/top/playlist/highquality?limit=${limit}&cat=${cat}`)

// 获取精选歌单
export const getTopList = params => request.get('/top/playlist', { params })
