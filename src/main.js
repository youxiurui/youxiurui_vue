import Vue from "vue";
import App from "./App.vue";
import router from './router'
import store from './store'
import {Button} from 'mint-ui'
import './mock/mockServer'

import './filers'


Vue.component(Button.name,Button)


new Vue({
  el: "#app",
  render: (h) => h(App),
  router,//使用上vue-router
  store,//使用上vuex
});
