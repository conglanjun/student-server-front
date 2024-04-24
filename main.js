import App from './App'
import * as config from './config'
import store from './store'
const defConfig = config

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'

// 引入全局TuniaoUI
import TuniaoUI from 'tuniao-ui'
Vue.use(TuniaoUI)

let vuexStore = require('@/store/$tn.mixin.js')
Vue.mixin(vuexStore)


const app = new Vue({
  store,
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif

Vue.prototype.$api = {
	
	defConfig,
	
};