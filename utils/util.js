const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
// 从数组对象中过滤掉重复的元素
const deteleObject = (obj) => {
  var uniques = [];
  var stringify = {};
  for (var i = 0; i < obj.length; i++) {
      var keys = Object.keys(obj[i]);
      keys.sort(function(a, b) {
          return (Number(a) - Number(b));
      });
      var str = '';
      for (var j = 0; j < keys.length; j++) {
          str += JSON.stringify(keys[j]);
          str += JSON.stringify(obj[i][keys[j]]);
      }
      if (!stringify.hasOwnProperty(str)) {
          uniques.push(obj[i]);
          stringify[str] = true;
      }
  }
  uniques = uniques;
  return uniques;
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
let appUrl = getApp().globalData.url
// const md5 = require('md5.js');
import {hex_md5} from './md5.js'
const appKey = "32443243SF3SF4343SFS35";
const appSecret = "F7554DGDHD4H2D42SRR74C4H44S4S11BC72DF";
let sign='';
// 发送请求
const http = (url, data, method, s, f, mode) => {
  if (method == "GET") {
    // 把参数进行排序a-z
    let newkey = Object.keys(data).sort()
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
    let newData = JSON.stringify(data);
    let str1 = appKey + appSecret + newData;
    str1 = str1.replace(/ /g, "").replace(/!/g, "").replace(/~/g, "").replace(/\(/g, "").replace(/\)/g, "").replace(/\'/g, "");
    sign = hex_md5(encodeURIComponent(str1)).toUpperCase()
  }
  wx.request({
    url: appUrl + url,
    method: method,
    header: {
      "token": wx.getStorageSync("oauthToken") ? wx.getStorageSync("oauthToken") : "",
      "sign": sign,
      "appKey": appKey
    },
    data: data,
    success: (res) => {
      sign=''
      if (res.data.code == 10000) {
        s(res.data.response == null ? [] : res.data.response)
      } else if (res.data.code == 30005) {
        wx.hideLoading();
        wx.removeStorageSync('oauthToken');
        wx.removeStorageSync('guide');
        if(mode == 1){//不用回去的
          wx.redirectTo({
            url: "/pages/login/login?path=1",
          })
        }else if(mode == 2){//需要返回的
          wx.navigateTo({
            url: "/pages/login/login?path=2",
          })
        }
      } else if(res.data.code == 40005){
        wx.hideLoading();
        wx.login({
          success: res => {
            getApp().globalData.resCode = res.code
          }
        })
      }else {
        wx.hideLoading();
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
        if (f) {
          return f(res.data.response)
        }
      }
    },
    fail: function (info) {
      sign = ''
      wx.hideLoading();
      wx.showModal({
        title: '提示',
        content: '网络请求失败！',
      });
    }
  })
}

module.exports = {
  formatTime: formatTime,
  http: http,
  deteleObject: deteleObject
}
