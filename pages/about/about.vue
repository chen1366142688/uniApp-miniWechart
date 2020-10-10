<template>
	<view class="app">
		<web-view :src="termsOfService"></web-view>
	</view>
</template>

<script>
	import { http } from "../../utils/util.js"
	const app= getApp();
	let timer = null;
	export default {
		comments:{},
		data() {
			return {
				termsOfService:''
			}
		},
		onLoad(options) {
			if (options.type == '1'){
			      /*隐私协议*/ 
			      wx.setNavigationBarTitle({
			        title: '隐私协议',
			      })
			      this.termsOfService = `${app.globalData.h5Url}/page/leaderSprots.html?code=PRIVACY_PROTOCOL_APPLET`
			    } else if (options.type == '2'){
			      /*用户协议*/
			      wx.setNavigationBarTitle({
			        title: '用户协议',
			      })
			      this.termsOfService = `${app.globalData.h5Url}/page/leaderSprots.html?code=USER_PROTOCOL_APPLET`
			    }else{
			      /*关于我们*/
			      wx.setNavigationBarTitle({
			        title: '关于我们',
			      })
			      this.termsOfService = `${app.globalData.h5Url}/page/leaderSprots.html?code=ABOUT_US`
			    }
		},
		onShow() {},
		methods: {},
		computed:{
		},
		destroyed() {
		}
	}
</script>

<style>
</style>
