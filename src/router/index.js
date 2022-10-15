/*
路由器模块
 */
import Vue from 'vue'
import VueRouter from 'vue-router'

import Msite from '../pages/MsiteWxr/MsiteWxr.vue'
import Search from '../pages/SearchWxr/SearchWxr.vue'
import Order from '../pages/OrderWxr/OrderWxr.vue'
import Profile from '../pages/ProfileWxr/ProfileWxr.vue'
import Login from '../pages/LoginWxr/LoginWxr.vue'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/msite',
    },
    {
      path: '/msite',
      component: Msite,
      meta:{
        showFooter:true
      }
    },
    {
      path: '/search',
      component: Search,
      meta:{
        showFooter:true
      }
    },
    {
      path: '/order',
      component: Order,
      meta:{
        showFooter:true
      }
    },
    {
      path: '/profile',
      component: Profile,
      meta:{
        showFooter:true
      }
    },
    {
      path: '/login',
      component: Login,
    },
  ]
})