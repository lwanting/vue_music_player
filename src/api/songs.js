import request from '../utils/request'

// 根据地区类型获取最新音乐
export const getTopSong = type => request.get(`/top/song?type=${type}`)
