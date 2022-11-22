/*
路由器模块
 */
import Vue from 'vue'
import VueRouter from 'vue-router'

import Msite from '../pages/MsiteWxr/MsiteWxr.vue'
import Search from '../pages/SearchWxr/SearchWxr.vue'
import Order from '../pages/OrderWxr/OrderWxr.vue'
import Profile from '../pages/ProfileWxr/ProfileWxr.vue'

// const Msite = () => import('../pages/MsiteWxr/MsiteWxr.vue')
// const Search = () => import('../pages/SearchWxr/SearchWxr.vue')
// const Order = () => import('../pages/OrderWxr/OrderWxr.vue')
// const Profile = () => import('../pages/ProfileWxr/ProfileWxr.vue')

import Login from '../pages/LoginWxr/LoginWxr.vue'
import Shop from '../pages/ShopWxr/ShopWxr.vue'
import ShopGoods from '../pages/ShopWxr/ShopGoods/ShopGoods.vue'
import ShopRatings from '../pages/ShopWxr/ShopRatings/ShopRatings.vue'
import ShopInfo from '../pages/ShopWxr/ShopInfo/ShopInfo.vue'


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
    {
      path: '/shop',
      component: Shop,
      children:[
        {
          path: '/shop/goods',
          component: ShopGoods,
        },
        {
          path: '/shop/ratings',
          component: ShopRatings,
        },
        {
          path: '/shop/info',
          component: ShopInfo,
        },
        {
          path: '',
          redirect: '/shop/goods',
        },
      ]
    },
  ]
})