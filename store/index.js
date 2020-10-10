import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state:{//定义全局变量
		hasLogin:false,//登录状态
		userInfo:{},//用户信息
		token: ''
	},
	mutations: {//定义全局函数
		login(state,data){
			uni.setStorage({key:'userInfo',data:data})
		},
		getToken (state, paylod) {
			state.token = paylod
			console.log('state.token', state.token)
		},
		setUserInfo (state, paylod) {
			state.userInfo = paylod
			console.log('state.userInfo', state.userInfo)
		}
	},
	actions: {
		getToken ({commit}, data) {
			commit('getToken', data)
		},
		setUserInfo ({commit}, data) {
			commit('setUserInfo', data)
		}
	}
})

export default store