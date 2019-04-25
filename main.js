import Vue from 'vue'
import App from './App'
import { request} from './common/js/api.js'

Vue.config.productionTip = false
// Vue.prototype.baseUrl = 'https://www.easy-mock.com/mock/5cb572a7495e884f42772f4f/uni-app'
Vue.prototype.baseUrl = 'https://www.imovietrailer.com/superhero/'
Vue.prototype.$http = request
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
