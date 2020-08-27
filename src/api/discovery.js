import request from '../utils/request'

// 获取轮播图
export const getBanners = () => request.get('/banner')

// 获取推荐歌单
export const getCommend = params => request.get('/personalized', { params })

// 获取最新音乐
export const getNewSongs = () => request.get('/personalized/newsong')

// 获取推荐MV
export const getMvs = () => request.get('/personalized/mv')

// 获取音乐url
export const getMusicUrl = id => request.get(`/song/url?id=${id}`)
