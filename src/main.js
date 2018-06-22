import Vue from 'vue'
import App from './App'
import router from './router'
import './filter'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
var VueQuillEditor = require('vue-quill-editor')
// import axios from 'axios'
// Vue.prototype.axios = axios
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(ElementUI)
Vue.use(VueQuillEditor)
import 'element-ui/lib/theme-chalk/pagination.css'
import 'element-ui/lib/theme-chalk/select.css'
import 'element-ui/lib/theme-chalk/option.css'
import 'element-ui/lib/theme-chalk/message.css'
import 'element-ui/lib/theme-chalk/message-box.css'

import store from '@/store/index'

Vue.prototype.exit = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
