(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["common/main"],{"6be3":function(t,e,n){},8194:function(t,e,n){"use strict";(function(t){n("4e23"),n("921b");var e=c(n("66fd")),o=c(n("edb5")),r=c(n("880a"));function c(t){return t&&t.__esModule?t:{default:t}}function a(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(t);e&&(o=o.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,o)}return n}function u(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?a(Object(n),!0).forEach((function(e){l(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function l(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}e.default.config.productionTip=!1,e.default.prototype.$store=o.default,r.default.mpType="app";var i=new e.default(u({Store:o.default},r.default));t(i).$mount()}).call(this,n("543d")["createApp"])},"85e9":function(t,e,n){"use strict";var o=n("6be3"),r=n.n(o);r.a},"880a":function(t,e,n){"use strict";n.r(e);var o=n("9158");for(var r in o)"default"!==r&&function(t){n.d(e,t,(function(){return o[t]}))}(r);n("85e9");var c,a,u,l,i=n("f0c5"),f=Object(i["a"])(o["default"],c,a,!1,null,null,null,!1,u,l);e["default"]=f.exports},9158:function(t,e,n){"use strict";n.r(e);var o=n("988b"),r=n.n(o);for(var c in o)"default"!==c&&function(t){n.d(e,t,(function(){return o[t]}))}(c);e["default"]=r.a},"988b":function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var o={globalData:{userInfo:null,resCode:null,url:"https://yltyapi.sportsfun.com.cn",h5Url:"https://ylty.sportsfun.com.cn/html",ossUploadUrl:"https://ylty.sportsfun.com.cn"},onLaunch:function(){var t=this;if(wx.canIUse("getUpdateManager")){var e=wx.getUpdateManager();e.onCheckForUpdate((function(t){})),e.onUpdateReady((function(){wx.showModal({title:"更新提示",content:"新版本已经准备好，点击重启应用？",showCancel:!1,success:function(t){e.applyUpdate()}})})),e.onUpdateFailed((function(){wx.showModal({title:"下载提示",content:"新版本下载失败，请手动删除本地小程序重新下载"})}))}else wx.showModal({title:"提示",content:"当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。"});wx.login({success:function(e){t.globalData.resCode=e.code}})},onShow:function(){console.log("App Show")},onHide:function(){console.log("App Hide")}};e.default=o}},[["8194","common/runtime","common/vendor"]]]);