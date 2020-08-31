import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
// 懒加载
const Discovery = () => import('../views/discovery/Discovery.vue')
const Playlists = () => import('../views/playlists/Playlists.vue')
const Playlist = () => import('../views/playlist-detail/Playlist.vue')

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
  }
]

const router = new VueRouter({
  routes
})

export default router
