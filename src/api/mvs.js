import request from '../utils/request'

// 获取全部mv
export const getMvs = params => request.get('/mv/all', { params })
