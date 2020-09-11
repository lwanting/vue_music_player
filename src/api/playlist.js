import request from '../utils/request'

// 获取歌单详情
export const getPlaylistDetail = id => request.get(`/playlist/detail?id=${id}`)

// 获取歌单所有歌曲
export const getPlaylistSongs = ids => request.get(`/song/detail?ids=${ids}`)

// 获取歌单评论
export const getPlaylistComment = params => request.get('/comment/playlist', { params })
