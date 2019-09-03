// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Vuex from 'vuex'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/iconfont.css'
import '@/assets/styles/main.scss'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(Vuex)
/* eslint-disable no-new */
const store = new Vuex.Store({
  state:{
    user:sessionStorage.getItem("user")
  },
  mutations:{
    setUser(state,res){
      sessionStorage.setItem('user',res.user)
      state.user = res.user
    }
  },
  actions:{}
});

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {App},
  store
})


