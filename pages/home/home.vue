<template>
	<view class="container">
		<view class="nav-swiper">
			<swiper class='swiper' :current="current" :autoplay="autoplay" :circular="circular">
				<swiper-item class='back' v-for="(item,index) in bannerList":key="index">
					<image class="bannerImg" :src="item.imgUrl"></image>
				</swiper-item>
			</swiper>
		</view>
		<view @click="goSign">
			<image class="signUpNow" src="../../static/signUpNow.png"></image>
		</view>
		<view class="fcc transverseData">
			<view class="transverse"></view>
			<text class="asdie">引领员简介</text>
			<view class="transverse"></view>
		</view>
		<view class="sectionData">
			实施“百万群众体育引领员建设工程”，是四川省体育局主动作为、开拓创新，着力推进体育领域治理体系和治理能力、推动全民健身的重大创举，自2020年起，四年内全省招募并培训100万群众体育引领员。在全省逐步形成“横向到边、纵向到底”的群众体育引领员网络体系，实现每一个乡镇（街道）、行政村（社区）、机关事业单位、企业、健身俱乐部、学校和单项体育协会等最基层单位都有群众体育引领员。做到群众在哪里，引领员就在哪里，全民健身赛事和活动就开展到哪里，以此影响和带动数千万群众经常性参加全民健身活动，进一步增强广大人民群众的获得感、幸福感，为提高人民群众身体素质和建设体育强省做出积极贡献。
		</view>
		<view class="kong"></view>
	</view>
</template>

<script>
	import { http } from "../../utils/util.js"
	import api from '../../api/baseApi.js'
	let timer = null;
	export default {
		data() {
			return {
				bannerList: [
				  'http://xlrtimo.oss-cn-beijing.aliyuncs.com/HorseScoutData/leaderMassSports/banner1.png',
				  'http://xlrtimo.oss-cn-beijing.aliyuncs.com/HorseScoutData/leaderMassSports/banner2.png',
				  'http://xlrtimo.oss-cn-beijing.aliyuncs.com/HorseScoutData/leaderMassSports/banner3.png',
				  'http://xlrtimo.oss-cn-beijing.aliyuncs.com/HorseScoutData/leaderMassSports/banner4.png',
				],
				autoplay: true,
				interval: 2000,
				duration: 500,
				circular: true,
				current: 0,
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
			/*每次进入时刷新token*/
			if (wx.getStorageSync("oauthToken")) {
				http("/v1/auth/queryGuideByToken", {
					token: wx.getStorageSync('oauthToken')
				}, "GET", this.guideByToken)
			}
		},
		mounted() {
			this.getBannerList()
		},
		methods: {
			async getBannerList () {
				try{
					let res = await api.getBannerList()
					if (res.code === 10000) {
						this.bannerList = res.response
					}
				}catch(err){
					console.log(err)
				}
			},
			goSign() {
				wx.switchTab({
					url: '/pages/index/index',
				})
			},
			guideByToken(res) {
				wx.setStorageSync("oauthToken", res.token)
				wx.setStorageSync("guide", res.guide)
			},
			/*获取banner图片地址*/
			queryBannerList(res) {
				this.bannerList = res;
			},
		},
		beforeDestroy() {
			timer = null
		}
	}
</script>

<style>
	@import url("./home.css");
</style>
