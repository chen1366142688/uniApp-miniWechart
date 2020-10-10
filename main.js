import Vue from 'vue'
import Store from './store'
import App from './App'

Vue.config.productionTip = false

Vue.prototype.$store = Store

App.mpType = 'app'

const app = new Vue({
	Store,
	...App
})
app.$mount()
