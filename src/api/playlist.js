import request from '../utils/request'

// 获取歌单详情
export const getPlaylistDetail = id => request.get(`/playlist/detail?id=${id}`)

// 获取歌单评论
export const getPlaylistComment = params => request.get('/comment/playlist', { params })
