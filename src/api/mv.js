import request from '../utils/request'

// 根据id获取mv数据
export const getMvData = id => request.get(`/mv/detail?mvid=${id}`)

// 根据id获取mv地址
export const getMvUrl = id => request.get(`/mv/url?id=${id}`)

// 获取mv评论
export const getMvComment = params => request.get('/comment/mv', { params })

// 根据id获取歌手信息
export const getArtistInfo = id => request.get(`/artists?id=${id}`)

// 获取相关mv
export const getSimiMv = id => request.get(`/simi/mv?mvid=${id}`)
