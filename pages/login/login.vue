<template>
	<view>
		<view :class="type===1?'head':'head2'">
		  <!-- <image class="logo" src="../../imgs/logo.png"></image> -->
		</view>
		<view class="yijian" v-if="type ===1">
		  <button class="fcc" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">微信手机号登录</button>
		  <view class="codeData fcc" @tap="codeLogin">验证码登录</view>
		</view>
		<view class="yanzheng" v-else>
		  <view class="inputLable">手机号</view>
		  <block>
			<input class="inputPhone" placeholder="请输入手机号码" placeholder-class="inputNumplace" v-model="phoneNum" maxlength="11" type="number"></input>
		  </block>
		  <view class="inputLable">验证码</view>
		  <view class="codeApp">
			<input class="inputCode" placeholder="请输入验证码" placeholder-class="inputNumplace" v-model="code" maxlength="6" type="number"></input>
			<view :class="{'verification':true,'sending':status!=='normal'}" @tap="sendCode">{{status==='normal'?'发送验证码':second+'s'}}</view>
		  </view>
		   <view class="footText">未注册的手机号验证通过后将自动注册</view>
		   <button class="submit fcc" @tap="submit">登录</button> 
		   <view class="codeData fcc" @tap="PhoneLogin">微信手机号登录</view>
		</view>
		<view class="footer">
		  登录即代表同意 <text class="xieyi" @tap="toXieyi" data-type="1">《隐私协议》</text>、<text class="xieyi" @tap="toXieyi"  data-type="2">《用户协议》</text>
		</view>
	</view>
</template>

<script>
	import { http } from "../../utils/util.js"
	import { mapActions } from 'vuex'
	const app = getApp();
	let isNextClick=false;
	export default {
		comments:{},
		data() {
			return {
				type:1,
				phoneNum: '',
				second: 60,
				code: "",
				status: 'normal',
				path:'',//1代表正常登录，2代表登录成功后要返回页面
			}
		},
		onLoad(options) {
			this.path = options.path; 
		},
		mounted() {
			isNextClick = false;
			wx.login({
				success:res => {
					app.globalData.resCode = res.code;
				}
			})
		},
		methods:{
			...mapActions(['getToken']),
			toXieyi(e){
			    let type = e.currentTarget.dataset.type;
			    if(type=='1'){
			      /*隐私协议*/
			      wx.navigateTo({
			        url: '/pages/about/about?type=1',
			      })
			    }else{
			      /*使用协议*/
			      wx.navigateTo({
			        url: '/pages/about/about?type=2',
			      })
			    }
			},
			codeLogin(){this.type = 2},
			PhoneLogin(){
				this.type = 1;
				this.status = 'normal';
				this.second = 60;
				this.phoneNum = '';
				this.code = '';
			    clearInterval(this.timerId)
			},
			//一键登录
			getPhoneNumber: function (e) {
				console.log("触发一件登录")
				let requestData={
				  jsCode: app.globalData.resCode,
				  encryptedData: e.detail.encryptedData,
				  iv: e.detail.iv,
				}
				if (e.detail.errMsg == "getPhoneNumber:fail:user deny" || e.detail.errMsg == "getPhoneNumber:fail user deny") {
				  wx.showModal({
					title: '提示',
					showCancel: false,
					content: '您已拒绝微信手机号授权，请重新授权',
					confirmColor:'#CE241D',
				  })
				} else {
				  http("/v1/auth/guideLoginByWechat", requestData, "GET", this.guideLoginRegister, this.errorCallback, 1)
				}
			},
			phoneNumber(e) { this.phoneNum = e.detail.value },
			codeNumber(e) { this.code = e.detail.value },
			// 发送验证码
			sendCode (e) {
			    if (this.phoneNum.length != 11) {
			      wx.showToast({
			        title: '手机号格式不正确',
			        icon: 'none',
			        mask: true
			      })
			      return
			    }
			    if (this.status === 'waiting') {
			      return
			    }
			    const reqObj = { phoneNum: this.phoneNum }
			    http("/v1/auth/sendSmsForRegister", reqObj, "GET", this.sendSmsCallBack, this)
			},
			// 倒计时
			countDown() {
			    let timerId = setInterval(() => {
				  this.second = this.second - 1;
			      if (this.second <= 0) {
			        clearInterval(this.timerId)
					this.status = 'normal';
					this.second = 60;
			      }
			    }, 1000)
				this.timerId = timerId;
				this.status = 'waiting';
			},
			submit(){
			    if (!isNextClick){//默认的可点击状态
			      if (this.phoneNum.length != 11) {
			        wx.showToast({
			          title: '手机号格式不正确',
			          icon: 'none',
			          mask: true
			        })
			        return
			      }
			      if (this.code.length != 6) {
			        wx.showToast({
			          title: '验证码格式不正确',
			          icon: 'none',
			          mask: true
			        })
			        return
			      }
			      isNextClick = true;
			      let reqObj = {
			        code: this.code,
			        guidePhone: this.phoneNum,
			      }
			      http("/v1/auth/guideLoginRegister", reqObj, "POST", this.guideLoginRegister, this.errorCallback,1)
			    }
			},
			sendSmsCallBack (res) {
			  this.countDown()
			},
			errorCallback (res) {
			  isNextClick = false;
			},
			guideLoginRegister (res) {
			  isNextClick = false;
				this.getToken(res.token)
			  wx.setStorageSync("oauthToken", res.token)
			  wx.setStorageSync("guide", res.guide)
			  //如果是我的页面过来登录的就回到我的页面去
			  if (this.path == '2'){
			    wx.navigateBack({
			      delta:1
			    })
			  }else{
			    if (res.guide.auditStatus != 0) {//已提交报名表单，跳转到提交成功页面
			      wx.redirectTo({
			        url: '/pages/successfulApplication/successfulApplication',
			      })
			    } else {//未提交报名表单，跳转到引领员申请页面
			      wx.redirectTo({
			        url: '/pages/apply/apply?seeInformation=0',
			      })
			    }
			  }
			}
		},
		destroyed() {
			clearInterval(this.timerId);
		}
	}
</script>

<style>
	@import url("./login.css");
</style>
