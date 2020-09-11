import axios from 'axios'
import { Loading } from 'element-ui'

let loading
// loading个数
let loadingCount = 0
const request = axios.create({
  baseURL: 'http://localhost:3000'
})
// 显示loading
function showLoading() {
  if (loadingCount === 0) {
    loading = Loading.service({
      target: 'body',
      lock: true,
      background: 'transparent',
      text: '加载中'
    })
  }
  loadingCount++
}
// 隐藏loading
function hideLoading() {
  loadingCount--
  if (loadingCount === 0) {
    loading.close()
    loading = null
  }
}
request.interceptors.request.use(config => {
  showLoading()
  return config
}, error => {
  return Promise.reject(error)
})
request.interceptors.response.use(response => {
  hideLoading()
  return response
}, error => {
  return Promise.reject(error)
})
export default request
