import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
// 懒加载
const Discovery = () => import('../views/discovery/Discovery.vue')

const routes = [
  {
    path: '/',
    component: Discovery
  },
  {
    path: '/discovery',
    component: Discovery
  }
]

const router = new VueRouter({
  routes
})

export default router
