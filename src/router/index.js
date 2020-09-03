import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 获取原型对象上的push函数
const originalPush = VueRouter.prototype.push
// 修改原型对象中的push方法
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

// 懒加载
const Discovery = () => import('../views/discovery/Discovery.vue')
const Playlists = () => import('../views/playlists/Playlists.vue')
const Playlist = () => import('../views/playlist-detail/Playlist.vue')
const Songs = () => import('../views/songs/Songs.vue')
const Mvs = () => import('../views/mvs/Mvs.vue')
const Mv = () => import('../views/mv-detail/Mv.vue')

const routes = [
  {
    path: '/',
    component: Discovery
  },
  {
    path: '/discovery',
    component: Discovery
  },
  {
    path: '/playlists',
    component: Playlists
  },
  {
    path: '/playlist',
    component: Playlist
  },
  {
    path: '/songs',
    component: Songs
  },
  {
    path: '/mvs',
    component: Mvs
  },
  {
    path: '/mv',
    component: Mv
  }
]

const router = new VueRouter({
  routes
})

export default router
