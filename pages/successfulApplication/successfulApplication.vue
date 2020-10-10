<template>
	<view class="box">
		<view class="head">
		  <image class="successful" :src="imgUrl"></image>
		</view>
		<view class="successText">{{successText}}</view>
		<view class="successText" v-if="successTexting.length>0">{{successTexting}}</view>
		<view class="btnFoot fcc" @tap="seeInformation" v-if="btnFoot.length>0">{{btnFoot}}</view>
	</view>
</template>

<script>
	import { http } from "../../utils/util.js"
	export default {
		comments:{},
		data() {
			return {
				imgUrl:'../../static/successful.png',
				successText:'',
				successTexting:'',
				btnFoot:''
			}
		},
		onLoad() {},
		mounted() {
			/*每次进入时刷新token*/
			if (wx.getStorageSync("oauthToken")) {
			  wx.showLoading({
				title: '加载中...',
				mask:true
			  })
			  http("/v1/auth/queryGuideByToken", { token: wx.getStorageSync('oauthToken') }, "GET", this.guideByToken, this, this.guideByTokenBack,2)
			}
		},
		methods: {
			seeInformation(){
			    let seeInformation=1
			    if(wx.getStorageSync("guide").auditStatus == '2'){
			      seeInformation=0;
			    }else{
			      seeInformation=1;
			    }
			    wx.redirectTo({
			      url: `/pages/apply/apply?seeInformation=${seeInformation}`,
			    })
			  },
			  guideByToken (res) {
			    wx.hideLoading()
			    wx.setStorageSync("oauthToken", res.token)
			    wx.setStorageSync("guide", res.guide)
			    if(res.guide.auditStatus == '0'){//未申请
			        this.successText = '您的报名申请提交成功, 请等待审核。';
			        this.successTexting = '我们将通过短信通知您审核结果及后续安排。';
			        this.btnFoot = '查看我的报名信息';
			    }else if(res.guide.auditStatus == '1'){//审核通过
				  this.successText = '您的报名申请已审核通过';
				  this.successTexting = '我们将通过短信通知您后续安排。';
				  this.btnFoot = '';
			    }else if(res.guide.auditStatus == '2'){//审核不通过
				  this.successText = '很抱歉，您的报名申请审核未通过。';
				  this.successTexting = '';
				  this.btnFoot = '重新报名';
				  this.imgUrl = '../../imgs/errorful.png';
			    }else if(res.guide.auditStatus == '3'){//待审核一次确认
				  this.successText = '您的报名申请提交成功, 请等待审核。';
				  this.successTexting = '我们将通过短信通知您审核结果及后续安排。';
				  this.btnFoot = '查看我的报名信息';
			    }else if(res.guide.auditStatus == '4'){//待审核
				  this.successText = '您的报名申请提交成功, 请等待审核。';
				  this.successTexting = '我们将通过短信通知您审核结果及后续安排。';
				  this.btnFoot = '查看我的报名信息';
			    }
			  },
			  guideByTokenBack (res) {
			    console.log(res)
			  }
		},
		computed:{
		},
		
		destroyed() {
		}
	}
</script>

<style>
	@import url("./successfulApplication.css");
</style>
