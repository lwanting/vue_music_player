import request from '../utils/request'

// 根据关键字获取搜索结果
export const getSearch = params => request.get('/search', { params })

// 获取热门搜索
export const getHotSearch = () => request.get('/search/hot')
