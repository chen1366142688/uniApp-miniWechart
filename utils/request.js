import Fly from 'flyio/dist/npm/wx'
import {hex_md5} from './md5.js'

const request = new Fly()
const appKey = "32443243SF3SF4343SFS35";
const appSecret = "F7554DGDHD4H2D42SRR74C4H44S4S11BC72DF";
let sign='';
// 设置请求基地址
request.config.baseURL = getApp().globalData.url

request.interceptors.request.use((request) => {
	console.log('request', request)
	if (request.method === 'GET') {
		// 把参数进行排序a-z
		let newkey = Object.keys(request.params).sort()
		// 定义变量
		let newData = {};
		let str1 = "";
		// 把参数重新填入对象
		for (let i = 0; i < newkey.length; i++) {
		  newData[newkey[i]] = "" + data[newkey[i]];
		}
		// 将排好的对象进行判断是否为空，不为空则存入字符串
		for (let i in newData) {
		  if (newData[i] != "" && newData[i] != "undefined" && newData[i] != "NaN") {
		    str1 += i + newData[i]
		  }
		}
		str1 = (str1 + appKey + appSecret);
		str1 = str1.replace(/ /g, "").replace(/!/g, "").replace(/~/g, "").replace(/\(/g, "").replace(/\)/g, "").replace(/\'/g, "");
		sign = hex_md5(encodeURIComponent(str1)).toUpperCase()
	} else {
		let newData = JSON.stringify(request.body);
		let str1 = appKey + appSecret + newData;
		str1 = str1.replace(/ /g, "").replace(/!/g, "").replace(/~/g, "").replace(/\(/g, "").replace(/\)/g, "").replace(/\'/g, "");
		sign = hex_md5(encodeURIComponent(str1)).toUpperCase()
	}
  // 给所有请求添加自定义header，带上token信息让服务器验证用户登陆
  request.headers['token'] = wx.getStorageSync("oauthToken") ? wx.getStorageSync("oauthToken") : "",
	request.headers['sign'] = sign
	request.headers['appKey'] = appKey
	// request.headers['content-type'] = 'application/json'
  wx.showNavigationBarLoading()
	wx.showLoading()
  return request
})

request.interceptors.response.use(
  (response, promise) => {
    wx.hideNavigationBarLoading()
		wx.hideLoading();
    if (response.data.code === 30005) {
			wx.hideLoading();
			wx.removeStorageSync('oauthToken');
			wx.removeStorageSync('guide');
			// if (mode == 1) { //不用回去的
			// 	wx.redirectTo({
			// 		url: "/pages/login/login?path=1",
			// 	})
			// } else if (mode == 2) { //需要返回的
			// 	wx.navigateTo({
			// 		url: "/pages/login/login?path=2",
			// 	})
			// }
      uni.showToast({title: response.data.msg, icon: 'none'})
      return response.data
    } else if (response.data.code === 40005) {
			wx.hideLoading();
			wx.login({
				success: res => {
					getApp().globalData.resCode = res.code
				}
			})
    }
    return promise.resolve(response.data)
  },
  (err, promise) => {
    wx.hideNavigationBarLoading()
		uni.showToast({title: err.message, icon: 'none'})
    return promise.resolve()
  }
)
export default request
