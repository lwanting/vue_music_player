import request from '../utils/request'

// 根据关键字获取搜索结果
export const getSearch = params => request.get('/search', { params })
