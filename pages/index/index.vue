<template>
	<view class="container">
		<view class="app">
		  <view class="asideTop"></view>
		  <view class="app-section">
		    <image class="recruit" src="../../static/recruit.png"></image>
		    <image class="leaderTop" src="../../static/leaderTop.png"></image>
		    <image class="biaoyu" src="../../static/biaoyu.png"></image>
		    <image class="introduction" src="../../static/introduction.png"></image>
		    <image class="content1" src="../../static/content1.png"></image>
		    <image class="content2" src="../../static/content2.png"></image>
		    <image class="condition" src="../../static/condition.png"></image>
		    <image class="duty" src="../../static/duty.png"></image>
		  </view>
		  <view class="aside"></view>
		</view>
		<view class="footer fcc">
		  <view class="footerBtn fcc" @click="apply">我要报名</view>
		</view>
	</view>
</template>

<script>
	import { http } from "../../utils/util.js"
	// import {mapState,mapMutations} from 'vuex'
	let timer = null;
	export default {
		comments:{},
		data() {
			return {
				
			}
		},
		onLoad() {
			wx.showLoading({
			      title: '加载中...',
			      mask: true
			    })
			    timer = setTimeout(() => { wx.hideLoading() }, 1500)
		},
		onShow() {},
		mounted() {},
		methods: {
			//点击我要申请
			  apply(){
			    /*若为非登录状态，跳转到登录页面。
			      若是登录状态，且未提交报名表单，跳转到引领员申请页面；
			      若是登录状态，且已提交报名表单，跳转到提交成功页面。
			    */
			    if (wx.getStorageSync('oauthToken')) {//登录状态
			      if (wx.getStorageSync("guide").auditStatus != 0) {//已提交报名表单，跳转到提交成功页面
			        wx.navigateTo({
						url: '/pages/successfulApplication/successfulApplication',
			        })
			      } else {//未提交报名表单，跳转到引领员申请页面
			        wx.navigateTo({
			          url: '/pages/apply/apply?seeInformation=0',
			        })
			      }
			    }else{//非登录状态，跳转到登录页面
			      wx.navigateTo({
			        url: '/pages/login/login?path=1',
			      })
			    }
			  },
			  // ...mapState(['hasLogin']),
		},
		computed:{
			// ...mapMutations(['login']),
		},
		
		destroyed() {
			 timer = null 
			 // this.login({name:'Mike chen'})
		}
	}
</script>

<style>
	@import url("./index.css");
</style>
