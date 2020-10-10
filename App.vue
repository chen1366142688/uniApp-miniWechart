<script>
export default {
	globalData:{
		userInfo: null,
		resCode: null,
		url: 'https://yltyapi.sportsfun.com.cn',//正式环境
		h5Url: 'https://ylty.sportsfun.com.cn/html',//正式环境
		ossUploadUrl: 'https://ylty.sportsfun.com.cn',//正式环境
		// url: 'https://guide-interface-tm.tanmasports.com',//测试环境
		// h5Url: 'https://wansheng-sports-interface-tm.tanmasports.com',//测试环境
	},
	onLaunch: function() {
		if (wx.canIUse('getUpdateManager')) {
		      const updateManager = wx.getUpdateManager()
		      updateManager.onCheckForUpdate(function (res) {})
		      updateManager.onUpdateReady(function () {
		        wx.showModal({
		          title: '更新提示',
		          content: '新版本已经准备好，点击重启应用？',
		          showCancel: false,
		          success: function (res) { updateManager.applyUpdate()} 
		        })
		      })
		      updateManager.onUpdateFailed(function () {
		        // 新的版本下载失败
		        wx.showModal({
		          title: '下载提示',
		          content: '新版本下载失败，请手动删除本地小程序重新下载',
		        })
		      })
		    }else{
		      wx.showModal({
		        title: '提示',
		        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
		      })
		    }
		    wx.login({
		      success: res => {
		        this.globalData.resCode = res.code
		      }
		    })
			wx.getSetting({
			      success: res => {
			        if (res.authSetting['scope.userInfo']) {
			          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
			          wx.getUserInfo({
			            success: res => {
			              // 可以将 res 发送给后台解码出 unionId
			              this.globalData.userInfo = res.userInfo
			              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
			              // 所以此处加入 callback 以防止这种情况
			              if (this.userInfoReadyCallback) {
			                this.userInfoReadyCallback(res)
			              }
			            }
			          })
			        }
			      }
			    })
	},
	onShow: function() {
		console.log('App Show');
	},
	onHide: function() {
		console.log('App Hide');
	}
};
</script>

<style>
/* 解决头条小程序组件内引入字体不生效的问题 */
/* #ifdef MP-TOUTIAO */
@font-face {
	font-family: uniicons;
	src: url('/static/uni.ttf');
}
/* #endif */
/**app.wxss**/
.fcc{
  display: flex;
  align-items: center;
  justify-content: center;
}
.fcb{
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.fca{
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.button-hover{
  width: 1rpx;
  height: 1rpx;
  background-color: transparent;
}

</style>
