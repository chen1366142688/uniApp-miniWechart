<template>
	<view class="container">
		<view class="head"></view>
		<view class="section">
			<!-- 获取到头像前 -->
			<button class="avatar" v-if="!hasUserInfo && canIUse" open-type="getUserInfo" @getuserinfo="getUserInfo">
				<image class="logo" :src='userInfo.avatarUrl'></image>
			</button>
			<!-- 获取到头像后 -->
			<view class="avatar" v-else>
				<image class="userinfo-avatar" :src='userInfo.avatarUrl' mode="cover"></image>
			</view>
			<view class="kong"></view>
			<view class="phone fcc" @click="goLogin">{{phoneNum?phoneNum:'点击登录'}}</view>
			<view class="infoData fcb" @click="contactUs">
				<view class="infoSec">
					<image src="../../static/phone.png"></image>
					<text>联系我们</text>
				</view>
				<image class="right-icon" src="../../static/right_icon.png"></image>
			</view>
			<view class="infoData fcb" @click="aboutGo">
				<view class="infoSec">
					<image src="../../static/about.png"></image>
					<text>关于我们</text>
				</view>
				<image class="right-icon" src="../../static/right_icon.png"></image>
			</view>
		</view>
		<view class="foot fcc" v-if="phoneNum">
			<button class="getOut fcc" @click="getOutLogin">退出登录</button>
		</view>
	</view>
</template>

<script>
	import {http} from "../../utils/util"
	import {mapActions} from 'vuex'
	const app = getApp();
	let timer = null;
	export default {
		data() {
			return {
				phoneNum: '',
				userInfo: {
					avatarUrl: "../../static/logo.png"
				}, //用户信息
				hasUserInfo: false,
				canIUse: wx.canIUse('button.open-type.getUserInfo'), //测试getUserInfo在当前版本是否可用    
			}
		},
		onLoad() {
			wx.showLoading({
				title: '加载中...',
				mask: true
			})
			timer = setTimeout(() => {
				wx.hideLoading()
			}, 1500)
			//如果全局对象用户信息不为空
			if (app.globalData.userInfo) {
				this.userInfo = app.globalData.userInfo; //将全局用户信息赋值给变量
				this.hasUserInfo = true;
			} else if (this.canIUse) { //getUserInfo在当前版本可用
				// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
				// 所以此处加入 callback 以防止这种情况
				app.userInfoReadyCallback = res => {
					this.userInfo = res.userInfo;
					this.hasUserInfo = true;
				}
			} else {
				// 在没有 open-type=getUserInfo 版本的兼容处理
				wx.getUserInfo({
					success: res => {
						app.globalData.userInfo = res.userInfo
						this.userInfo = res.userInfo;
						this.hasUserInfo = true;
					}
				})
			};
		},
		onShow() {
			wx.login({
				success: res => {
					app.globalData.resCode = res.code
				}
			})
			this.phoneNum = ''
			let oauthToken = wx.getStorageSync("oauthToken");
			//如果用户已登录则获取用户信息
			if (oauthToken) {
				http("/v1/auth/queryUserInfo", {}, "GET", this.queryUserInfo, this.queryUserInfoBack, 2)
			}
		},
		methods: {
			...mapActions(['setUserInfo']),
			/*联系我们*/
			contactUs() {
				wx.navigateTo({
					url: '/pages/contactUs/contactUs',
				})
			},
			/*关于我们*/
			aboutGo() {
				wx.navigateTo({
					url: '/pages/about/about?type=3',
				})
			},
			/*去登录*/
			goLogin() {
				if (this.phoneNum) {
					return
				}
				wx.navigateTo({
					url: '/pages/login/login?path=2',
				})
			},
			getOutLogin() {
				this.phoneNum = ''
				wx.removeStorageSync('oauthToken');
				wx.removeStorageSync('guide');
				wx.login({
					success: res => {
						app.globalData.resCode = res.code
					}
				})
			},
			/*登录的时候获取用户信息回调*/
			queryUserInfo(res) {
				this.phoneNum = res.phoneNum
			},
			queryUserInfoBack(res) {
				console.log(res)
			},
			getUserInfo(e) {
				//点击取消按钮
				if (e.detail.userInfo == null) {
					console.log("授权失败")
				} else { //点击允许按钮
					this.userInfo = e.detail.userInfo;
				}
				//全局对象用户信息赋值
				app.globalData.userInfo = e.detail.userInfo
				this.setUserInfo(e.detail.userInfo)
			}
		},

		destroyed() {
			timer = null
		}
	}
</script>

<style>
	@import url("./myInfo.css");
</style>
