<template>
	<view class="container">
		<view :class="{'form':true,'form-fixed':showModal}">
			<!-- 姓名 -->
			<view class="cell">
				<view class="cell-title">
					<view>姓名</view>
					<view style="color:#CE241D;margin-left:18rpx;margin-top:4rpx;">*</view>
				</view>
				<input placeholder="请输入姓名" v-model="name" type="text" :disabled="seeInformation=='1'" placeholder-style="color:#D0D0D0;"
				 maxlength="30" />
			</view>
			<!-- 身份证号 -->
			<view class="cell">
				<view class="cell-title">
					<view>身份证号</view>
					<view style="color:#CE241D;margin-left:18rpx;margin-top:4rpx;">*</view>
				</view>
				<input placeholder="请输入身份证号" type="idcard" v-model="idCard" :disabled="seeInformation=='1'" placeholder-style="color:#D0D0D0;"
				 maxlength="18" />
			</view>
			<!-- 民族 -->
			<view class="cell">
				<view class="cell-title">
					<view>民族</view>
					<view style="color:#CE241D;margin-left:18rpx;margin-top:4rpx;">*</view>
				</view>
				<picker mode="selector" :value="nationIndex" :range="nationNameData" @change="changeNation" v-if="seeInformation !='1'">
					<view :class="{'picker':true,'noPadding':seeInformation=='1'}">
						<text style="color:#D0D0D0;" v-if="!nationIndex && seeInformation == '0'">请选择民族</text>
						<text v-else>{{nationNameData[nationIndex]}}</text>
						<image class="right_icon" src="../../static/right_icon.png" style="width:10rpx;height:20rpx;" v-if="seeInformation=='0'"></image>
					</view>
				</picker>
				<view v-else>{{nationalName}}</view>
			</view>
			<!-- 政治面貌 -->
			<view class="cell">
				<view class="cell-title">
					<view>政治面貌</view>
					<view style="color:#CE241D;margin-left:18rpx;margin-top:4rpx;">*</view>
				</view>
				<picker mode="selector" :value="politicalIndex" :range="politicalObj" @change="changePolitical" :disabled="seeInformation=='1'"
				 range-key="name">
					<view :class="{'picker':true,'noPadding':seeInformation=='1'}">
						<text style="color:#D0D0D0;" v-if="!politicalIndex && seeInformation=='0'">请选择政治面貌</text>
						<text v-else>{{politicalObj[politicalIndex].name}}</text>
						<image class="right_icon" src="../../static/right_icon.png" style="width:10rpx;height:20rpx;" v-if="seeInformation=='0'"></image>
					</view>
				</picker>
			</view>
			<!-- 申请方式 -->
			<view class="cell apply-type">
				<view class="cell-title">
					<view>申请方式</view>
					<view style="color:#CE241D;margin-left:18rpx;margin-top:4rpx;">*</view>
				</view>
				<radio-group class="radio-group" @change="changeApplyType" v-if="seeInformation =='0'">
					<radio color="#F6AE6A" class="radio" v-for="item in applyTypeList" :key="index" :checked="item.checked" :value="item.applyType">
						<text>{{item.text}}</text>
					</radio>
				</radio-group>
				<view v-else>
					<text>{{applyType == 1?'单位推荐':'个人自荐'}}</text>
					<text v-if="seeInformation == 1 && applyCompanyType"> — </text>
					<text v-if="applyType == 1">{{applyCompanyType == 1 ? '省级单位' : applyCompanyType == 2 ? '地市州级单位' : '区县级单位及其他' }}</text>
				</view>
			</view>
			<!-- 申请方式为单位推荐时需要选择单位级别 -->
			<view class="cell" v-if="applyType == '1' && seeInformation =='0'">
				<radio-group @change="checkCompanyType" class="radioGroup">
					<radio v-for="item in companyTypeList" :value="item.id" :key="index" class="radio" style="margin-left:46rpx;white-space:nowrap;" color="#F6AE6A">{{item.text}}</radio>
				</radio-group>
			</view>
			<!-- 职业 -->
			<view class="cell">
				<view class="cell-title">
					<view>职业</view>
					<view style="color:#CE241D;margin-left:18rpx;margin-top:4rpx;">*</view>
				</view>
				<picker mode="selector" :value="professionIndex" :range="professionObj" @change="changeProfession" :disabled="seeInformation=='1'"
				 range-key="name">
					<view :class="{'picker':true,'noPadding':seeInformation=='1'}">
						<text style="color:#D0D0D0;" v-if="!professionIndex && seeInformation=='0'">请选择职业</text>
						<text v-else>{{professionObj[professionIndex].name}}</text>
						<image class="right_icon" src="../../static/right_icon.png" style="width:10rpx;height:20rpx;" v-if="seeInformation=='0'"></image>
					</view>
				</picker>
			</view>
			<!-- 是否社会体育指导员  -->
			<view :class="{'sport-industry':true,'cell':true,'borderNo':haveGuide == '1'}" v-if="seeInformation =='0'">
				<view class="cell-title cell-title-max">
					<view>是否社会体育指导员</view>
					<view style="color:#CE241D;margin-left:18rpx;margin-top:4rpx;">*</view>
				</view>
				<radio-group @change="checkSocietySportIndustry" v-if="seeInformation !='1'">
					<radio :value="1" class="radio" color="#F6AE6A">是</radio>
					<radio :value="0" class="radio" color="#F6AE6A">否</radio>
				</radio-group>
			</view>
			<view class="cell" v-if="haveGuide == '1' && seeInformation =='0'">
				<radio-group @change="checkInstructorType" class="radioGroup">
					<radio :value="1" class="radio" color="#F6AE6A" :checked="guideType=='1'">公益性</radio>
					<radio :value="2" class="radio" color="#F6AE6A" style="margin-left:64rpx;" :checked="guideType=='2'">职业性</radio>
				</radio-group>
			</view>
			<!-- 查看 -是社会体育指导员 -->
			<view class="cell" v-if="seeInformation =='1' && haveGuide=='1'">
				<view class="cell-title cell-title-max">
					<view>是否社会体育指导员</view>
					<view style="color:#CE241D;margin-left:18rpx;margin-top:4rpx;">*</view>
				</view>
				<view>{{guideType == 1 ? '公益性' : '职业性'}}</view>
			</view>
			<!-- 查看 -不是社会体育指导员 -->
			<view class="cell" v-if="seeInformation =='1' && haveGuide=='0'">
				<view class="cell-title">
					<view>是否社会体育指导员</view>
					<view style="color:#CE241D;margin-left:18rpx;margin-top:4rpx;">*</view>
				</view>
				<view>否</view>
			</view>
			<!-- 工作单位 -->
			<view class="cell">
				<view class="cell-title">
					<view>工作单位</view>
					<view style="color:#CE241D;margin-left:18rpx;margin-top:4rpx;">*</view>
				</view>
				<input placeholder="请输入工作单位" type="text" v-model="companyName" :disabled="seeInformation=='1'" placeholder-style="color:#D0D0D0;"
				 maxlength="60" />
			</view>
			<!-- 所属地区 -->
			<view class="cell">
				<view class="cell-title">
					<view>所属地区</view>
					<view style="color:#CE241D;margin-left:18rpx;margin-top:4rpx;">*</view>
				</view>
				<picker mode="multiSelector" @change="bindcityAreaChange" @columnchange="bindcityAreaColumnChange" :value="cityAreaIndex"
				 :range="cityAreaList" :disabled="seeInformation == '1'" v-if="seeInformation == '0'">
					<view v-if="noCity && seeInformation=='0'" style="color:#D0D0D0;display:inline-block;padding-right:35rpx;">请选择所属区域</view>
					<view :class="{'picker':true,'noPadding':seeInformation=='1'}" v-else>
						{{cityAreaList[0][cityAreaIndex[0]]}}{{cityAreaList[1][cityAreaIndex[1]]}}
					</view>
					<image class="right_icon" src="../../static/right_icon.png" style="width:10rpx;height:20rpx;" v-if="seeInformation=='0'"></image>
				</picker>
				<view v-else>{{cityName}}{{areaName}}</view>
			</view>
			<!-- 所属街道、社区 -->
			<view class="cell" v-if="seeInformation=='1' || !noCity">
				<view class="cell-title">
					<view>所属街道、社区</view>
					<view style="color:#CE241D;margin-left:18rpx;margin-top:4rpx;">*</view>
				</view>
				<picker mode="multiSelector" @change="bindstreetVillageChange" @columnchange="bindstreetVillageColumnChange" :value="streetVillageIndex"
				 :range="streetVillageList" :disabled="seeInformation == '1'" v-if="seeInformation == '0'">
					<view v-if="noStreet && seeInformation=='0'" style="color:#D0D0D0;display:inline-block;padding-right:35rpx;">请选择所属街道、社区</view>
					<view :class="{'picker':true,'noPadding':seeInformation=='1'}" v-else>
						{{streetVillageList[0][streetVillageIndex[0]]}}{{streetVillageList[1][streetVillageIndex[1]]}}
					</view>
					<image class="right_icon" src="../../static/right_icon.png" style="width:10rpx;height:20rpx;" v-if="seeInformation=='0'"></image>
				</picker>
				<view v-else>{{streetName}}{{villageName}}</view>
			</view>
			<!-- 详细地址 -->
			<view class="cell">
				<view class="cell-title">
					<view>详细地址</view>
				</view>
				<view v-if="seeInformation=='1'&&address==''">无</view>
				<input v-else placeholder="请输入详细地址" v-model="address" type="text" :disabled="seeInformation=='1'" placeholder-style="color:#D0D0D0;"
				 maxlength="30" />
			</view>
			<!-- 专长 -->
			<view class="cell">
				<view>专长</view>
				<view>
					<view @tap="selectSpeciality" v-if="selectedInterest.length <= 0 && seeInformation=='0'" style="color:#D0D0D0;display:inline-block;">请选择专长</view>
					<view @tap="selectSpeciality" v-if="selectedInterest.length >= 1 && seeInformation=='0'" style="display:inline-block;">
						<text>{{selectedInterest[0].interestName}}</text>
						<text v-if="selectedInterest.length > 1">、{{selectedInterest[1].interestName}}</text>
						<text v-if="selectedInterest.length > 2">等{{selectedInterest.length}}项</text>
					</view>
					<view v-if="seeInformation=='1'" style="display:inline-block;">
						<view v-if="!selectedInterest.length">无</view>
						<view v-else>
							<text>{{selectedInterest[0].interestName}}</text>
							<text v-if="selectedInterest.length > 1">、{{selectedInterest[1].interestName}}</text>
							<text v-if="selectedInterest.length > 2">等{{selectedInterest.length}}项</text>
						</view>
					</view>
					<image src="../../static/right_icon.png" style="width:10rpx;height:20rpx;margin-left:20rpx;" v-if="seeInformation=='0'"></image>
				</view>
			</view>
			<!-- 体育学历证书 -->
			<view class="upload-img" style="border-bottom:1rpx solid #eee;" v-if="files1.length >= 1">
				<view class="upload-title">体育学历证书</view>
				<view>
					<view class="uploadImgData" v-for="(item,index) in files1" :key="index" v-if="!(files1.length > 1 && index == files1.length-1)">
						<image class="uploadImg" :id="item" :src="item" @tap="chooseImage" :data-index="index" data-type="1" v-if="!(files1.length > 1 && index == files1.length-1)"
						 :mode="files1.length - 1 == index?'scaleToFill':'aspectFill'">
						</image>
						<image class="delete" src="../../static/delete.png" v-if="files1.length - 1 != index && seeInformation=='0'" @tap="deleteImage"
						 :data-index="index" data-type="1"></image>
					</view>
				</view>
			</view>
			<!-- 体育专业证书 -->
			<view class="upload-img" style="border-bottom:1rpx solid #eee;" v-if="files2.length >= 1">
				<view class="upload-title">体育专业证书</view>
				<view style="color:#D0D0D0;padding-left:10rpx;">运动员证、各类体育教师资格证、裁判证、教练员证、运动医师执照、体育记者证、领队证、体育经纪人证等</view>
				<view>
					<view class="uploadImgData" v-for="(item,index) in files2" :key="index" v-if="!(files2.length > 3 && index == files2.length-1)">
						<image class="uploadImg" :id="item" :src="item" @tap="chooseImage" :data-index="index" data-type="2" v-if="!(files2.length > 3 && index == files2.length-1)"
						 :mode="files2.length - 1 == index?'scaleToFill':'aspectFill'">
						</image>
						<image class="delete" src="../../static/delete.png" v-if="files2.length - 1 != index && seeInformation=='0'" @tap="deleteImage"
						 :data-index="index" data-type="2"></image>
					</view>
				</view>
			</view>
			<!-- 社会体育指导员证书 -->
			<view class="upload-img" style="border-bottom:1rpx solid #eee;" v-if="files3.length >= 1">
				<view class="upload-title">社会体育指导员证书</view>
				<view>
					<view class="uploadImgData" v-for="(item,index) in files3" :key="index" v-if="!(files3.length > 1 && index == files3.length-1)">
						<image class="uploadImg" :id="item" :src="item" @tap="chooseImage" :data-index="index" data-type="3" v-if="!(files3.length > 1 && index == files3.length-1)"
						 :mode="files3.length - 1 == index?'scaleToFill':'aspectFill'">
						</image>
						<image class="delete" src="../../static/delete.png" v-if="files3.length - 1 != index && seeInformation=='0'" @tap="deleteImage"
						 :data-index="index" data-type="3"></image>
					</view>
				</view>
			</view>
		</view>
		<view :class="{'footer':true,'footer-fixed':showModal}" v-if="seeInformation=='0'">
			<view class="btn" @tap="submit">提交报名</view>
		</view>
		<!--- 弹出层 -->
		<view class="modal-bg" v-if="showModal"></view>
		<view id="modal" v-if="showModal">
			<view class="modal-header flex-between">
				<view class="cancel" @tap="cancel">取消</view>
				<view class="title" style="font-weight:bold;">选择专长（多选）</view>
				<view class="shure" style="color:#F4963C;" @tap="complete">完成</view>
			</view>
			<!-- 已选专长 -->
			<view class="modal-selected" v-if="selectedInterest.length >= 1">
				<view style="text-align:center;margin-bottom:38rpx;">已选</view>
				<view class="selected-list">
					<view class="selected-item" v-for="(item,index) in selectedInterest" :key="index" @tap="deleteInterest"
					 :data-index="index" :data-interestId="item.interestId">
						<text>{{item.interestName}}</text>
						<image src="../../static/delete_icon.png"></image>
					</view>
				</view>
			</view>
			<view class="modal-content">
				<view class="left">
					<view :class="{'left-item':true,'parent-selected':parentInterestId == item.interestId}" v-for="(item,index) in parentInterest"
					 :key="index" @tap="changeParentInterest" :data-id="item.interestId">
						{{item.interestName}}
					</view>
				</view>
				<view class="right">
					<view :class="{'right-item':true,'child-selected':item.checked}" v-for="item in childInterest" :key="item.interestId"
					 @tap="changeChildInterest" :data-item="item" v-if="item.parentInterestId == parentInterestId">
						<text>{{item.interestName}}</text>
						<image src="../../static/delete_icon.png" v-if="item.checked"></image>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {http} from "../../utils/util.js";
	import api from '../../api/baseApi.js'
	import uploadFile from "../../utils/uploadAliyun.js";
	const app = getApp();
	var that;
	let timer = null;
	let isNextClick = false;
	export default {
		data() {
			return {
				seeInformation: '', // 0:新增 1：查看
				name: '', // 用户名
				idCard: '', //身份证
				nationObjList: [], // 民族数组对象
				nationNameData: [], // 民族展示数据
				nationIndex: '', // 选中的民族index
				nationalName: '', //选中民族的名称
				politicalObj: [{
						id: '1',
						name: '党员'
					},
					{
						id: '2',
						name: '预备党员'
					},
					{
						id: '3',
						name: '共青团员'
					},
					{
						id: '4',
						name: '群众'
					},
					{
						id: '5',
						name: '其他'
					},
				],
				politicsStatus: '',
				companyTypeList: [
					{id: '1', text: '省级单位'},
					{id: '2', text: '地市州级单位'},
					{id: '3', text: '区县级单位及其他'},
				],
				applyCompanyType: '',
				politicalIndex: '', // 已选中的政治面貌index
				applyTypeList: [ // 申请方式
					{
						applyType: 1,
						text: '单位推荐',
						checked: false
					},
					{
						applyType: 2,
						text: '个人自荐',
						checked: false
					}
				],
				applyType: '',
				professionObj: [{
						id: '1',
						name: '机关单位工作人员'
					},
					{
						id: '2',
						name: '事业单位工作人员'
					},
					{
						id: '3',
						name: '企业工作人员'
					},
					{
						id: '4',
						name: '工会负责人'
					},
					{
						id: '8',
						name: '学生'
					},
					{
						id: '5',
						name: '志愿者'
					},
					{
						id: '6',
						name: '体育爱好者'
					},
					{
						id: '7',
						name: '其他'
					}
				],
				professionId: '',
				professionList: ['机关单位工作人员', '事业单位工作人员', '企业工作人员', '工会负责人', '学生', '志愿者', '体育爱好者', '其他'],
				professionIndex: '', // 选中的职业
				sportsPeople: '', // 是否是体育行业从业者 1：是 0：否
				haveGuide: '', // 是否是社会体育指导员 1：是 0：否
				companyName: '', // 工作单位
				cityArr: [],
				countyArr: [],
				allCityListObj: [],
				allCountyListObj: [],
				multiIndex: [],
				multiArray: [],
				countyData: [],
				nationalCodeData: [],
				showModal: false, // 专长选择弹出层
				uploadType: '', // 图片上传类型
				tempFilePaths1: [],
				tempFilePaths2: [],
				tempFilePaths3: [],
				allInterestList: [], // 所有专长
				parentInterest: [], // 父类专长
				childInterest: [], // 子类专长
				parentInterestId: 1,
				selectedInterest: [], // 选中的专长
				selectedInterestId: [], // 选中的专长id
				files1: ['../../static/upload.png'], // 学历证书
				files2: ['../../static/upload.png'], // 体育专业
				files3: ['../../static/upload.png'], // 体育指导员证书
				imgList1: [],
				imgList2: [],
				imgList3: [],
				applyType: '',
				sportsList: [{
						name: 'sportsMan',
						value: '运动员',
						checked: false
					},
					{
						name: 'sportsCoach',
						value: '教练员',
						checked: false
					},
					{
						name: 'sportsJudge',
						value: '裁判员',
						checked: false
					}
				],
				sportslistSelected: [], //选中的体育从业者分类多选
				guideType: '', // 选中的社会体育指导员分类

				/*mike--更改选择归属地的数据*/
				noCity: true, //是否可以选择街道社区
				noStreet: true, //是否可以选择街道社区
				cityAreaIndex: [0, 0],
				cityAreaIndexCopy: [0, 0],
				allCityList: [], //所有城市名称
				allCityListData: [], //所有城市名称id
				allAreaList: [], //所有区名称
				allAreaListData: [], //所有区名称id
				cityAreaList: [], //城市和区域
				cityAreaListData: [], //城市和区域id
				streetVillageIndex: [0, 0],
				allStreetList: [], //所有街道名称 
				allStreetListData: [], //所有街道名称id
				allVillageList: [], //所有村子名称
				allVillageListData: [], //所有村子名称id
				streetVillageList: [], //所有街道和村子
				streetVillageListData: [], //所有街道和村子id
				address: '', //详细地址
				cityName: '', //城市
				areaName: '', //区域
				streetName: '', //街道
				villageName: '', //村子
			}
		},
		onLoad(options) {
			that = this
			isNextClick = false;
			wx.showLoading({
				title: '加载中...',
				mask: true
			})
			timer = setTimeout(() => {
				wx.hideLoading()
			}, 1500)
			that.getAllNational() // 查询所有民族
			that.getAllInterest() // 新增-查询所有专长
			/*查看*/
			if (options.seeInformation == '1') {
				/* 获取用户之前提交的申请信息*/
				let guideInfo = wx.getStorageSync('guide')
				let professionIndex = this.professionObj.findIndex(item => { // 职业
					return item.id ==  guideInfo.profession
				})
				let politicsStatus = Number(guideInfo.politicsStatus) -1 // 政治面貌
				that.seeInformation = '1';
				that.name = guideInfo.guideName;
				that.idCard = guideInfo.identityCard;
				that.nationalName = guideInfo.nationalName;
				that.politicalIndex = String(politicsStatus);
				that.applyType = guideInfo.applyType;
				that.professionId = guideInfo.profession;
				that.professionIndex = String(professionIndex);
				that.haveGuide = guideInfo.haveGuide;
				that.guideType = guideInfo.guideType;
				that.companyName = guideInfo.companyName;
				that.address = guideInfo.addrDetail;
				that.cityName = guideInfo.cityName;
				that.areaName = guideInfo.areaName;
				that.streetName = guideInfo.streetName;
				that.villageName = guideInfo.villageName;
				that.applyCompanyType = guideInfo.applyCompanyType;
				/*查询引领员证件*/
				that.queryGuideCertificate();
				/*查询引领员专长*/
				that.queryGuideInterest();
			} else { /*编辑*/
				that.seeInformation = '0'
				that.getAllCityList() // 查询四川所有城市
			}
		},
		methods: {
			/** 提交申请 */
			async submit() {
				if (!isNextClick) {
					let idCardValidate =
						/^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|31)|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}([0-9]|x|X)$/
					if (!this.name) {
						wx.showToast({
							title: '请输入姓名！',
							icon: 'none'
						})
						return false
					}
					if (!this.idCard) {
						wx.showToast({
							title: '请输入身份证号！',
							icon: 'none'
						})
						return false
					}
					if (!idCardValidate.test(this.idCard)) {
						wx.showToast({
							title: '请输入合法的身份证号！',
							icon: 'none'
						})
						return false
					}
					if (!this.nationIndex) {
						wx.showToast({
							title: '请选择民族！',
							icon: 'none'
						})
						return false
					}
					if (!this.politicsStatus) {
						wx.showToast({
							title: '请选择政治面貌！',
							icon: 'none'
						})
						return false
					}
					if (!this.applyType) {
						wx.showToast({
							title: '请选择申请方式！',
							icon: 'none'
						})
						return false
					}
					if (this.applyType == 1) { // 申请单位是公司推荐时，需要选择单位级别
						if (!this.applyCompanyType) {
							wx.showToast({
								title: '请选择单位级别!',
								icon: 'none'
							})
							return false
						}
					}
					if (!this.professionId) {
						wx.showToast({
							title: '请选择职业！',
							icon: 'none'
						})
						return false
					}
					if (!this.haveGuide) {
						wx.showToast({
							title: '请选择是否是社会体育指导员！',
							icon: 'none'
						})
						return false
					}
					if (this.haveGuide == 1) {
						if (!this.guideType) {
							wx.showToast({
								title: '请选择社会体育指导员类型！',
								icon: 'none'
							})
							return false
						}
					}
					if (!this.companyName) {
						wx.showToast({
							title: '请输入工作单位！',
							icon: 'none'
						})
						return false
					}
					if (this.noCity) {
						wx.showToast({
							title: '请选择所属地区！',
							icon: 'none'
						})
						return false
					}
					if (this.noStreet) {
						wx.showToast({
							title: '请选择所属街道、社区！',
							icon: 'none'
						})
						return false
					}
					try {
						let {
							streetVillageListData,
							cityAreaListData,
							cityAreaIndex,
							streetVillageIndex,
							applyType,
							companyName,
							selectedInterest,
							address,
							noCity
						} = this;
						let imgList1 = this.imgList1.slice(0, -1)
						let imgList2 = this.imgList2.slice(0, -1)
						let imgList3 = this.imgList3.slice(0, -1)
						let allImgList = [...imgList1, ...imgList2, ...imgList3]
						const params = {
							certificateUrls: allImgList,
							guide: {
								addrCity: noCity ? '' : cityAreaListData[0][cityAreaIndex[0]].cityCode || '', // 市id
								addrArea: noCity ? '' : cityAreaListData[1][cityAreaIndex[1]].areaCode || '', // 区id
								addrStreet: noCity ? '' : streetVillageListData[0][streetVillageIndex[0]].streetCode || '', // 街道id
								addrVillage: noCity ? '' : streetVillageListData[1][streetVillageIndex[1]].villageCode || '', // 村子id
								addrDetail: address,
								addrProvince: 510, // 省id
								applyType: applyType, // 申请方式
								companyName: companyName, // 工作单位
								guideId: 0,
								auditStatus: '3',
								applyCompanyType: this.applyCompanyType, // 单位推荐类型
								guideName: this.name, // 姓名
								identityCard: this.idCard, // 身份证号码
								nationalCode: this.nationObjList[this.nationIndex].nationalCode, // 民族code
								nationalName: this.nationObjList[this.nationIndex].nationalName,
								politicsStatus: this.politicsStatus, // 政治面貌
								profession: this.professionId, // 职业
								haveGuide: this.haveGuide, // 是否是社会指导员
								guideType: this.guideType
							},
							interestList: selectedInterest
						}
						wx.showLoading({
							title: '提交中...',
						})
						isNextClick = true;
						let res = await api.guideApply(params)
						if (res.code === 10000) {
							that.noCity = true;
							that.noStreet = true;
							wx.showToast({
								title: '提交成功',
								icon: 'none'
							})
							wx.redirectTo({
								url: '/pages/successfulApplication/successfulApplication',
							})
						}
						// http('/v1/auth/guideApply', params, 'POST', this.submitCb, this, this.errorCallback)
					} catch (error) {
						console.log('错误信息：', error)
					}
				}
			},
			/** 删除已选择专长 */
			deleteInterest(e) {
				let index = e.currentTarget.dataset.index
				let selectedId = e.currentTarget.dataset.interestid
				let selectedInterest = this.selectedInterest
				selectedInterest.splice(index, 1)
				let childInterest = this.childInterest // 所有子类
				for (let i = 0; i < childInterest.length; i++) {
					let chd = childInterest[i]
					if (chd.interestId == selectedId) {
						chd.checked = false
					}
				}
				this.selectedInterest = selectedInterest;
				this.childInterest = childInterest;
			},
			//查询引领员证件
			queryGuideCertificate() {
				http("/v1/auth/queryGuideCertificate", {}, "GET", this.queryGuideCertificateback, this)
			},
			//查询引领员证件回调
			queryGuideCertificateback(res) {
				let files1 = []
				let files2 = []
				let files3 = []
				for (let i = 0; i < res.length; i++) {
					if (res[i].certificateType == 1) {
						files1.push(res[i].certificateUrl)
					} else if (res[i].certificateType == 2) {
						files2.push(res[i].certificateUrl)
					} else {
						files3.push(res[i].certificateUrl)
					}
				}
				this.files1 = files1;
				this.files2 = files2;
				this.files3 = files3;
			},
			// 查看-查询引领员专长
			queryGuideInterest() {
				http("/v1/auth/queryGuideInterest", {}, "GET", this.queryGuideInterestback, this)
			},
			// 查看-查询引领员专长回调
			queryGuideInterestback(res) {
				this.selectedInterest = res
			},
			/** 选择专长（父类） */
			changeParentInterest(e) {
				this.parentInterestId = e.currentTarget.dataset.id
			},
			/** 选择申请方式*/
			changeApplyType(e) {
				this.applyCompanyType = ''
				this.applyType = e.detail.value
			},
			/** 选择专长（子类） */
			changeChildInterest(e) {
				const item = e.currentTarget.dataset.item
				let selectedInterest = this.selectedInterest
				let repeatIndex = selectedInterest.findIndex(data => { // 判断是否重复选
					return data.interestId == item.interestId
				})
				if (repeatIndex != -1) { // 重复选中则取消选中
					selectedInterest.splice(repeatIndex, 1)
				} else { // 未重复选中则添加到数组最后一位
					selectedInterest.push({
						interestId: item.interestId,
						interestName: item.interestName
					})
				}
				let selectedInterestId = selectedInterest.map(item => { // 保存选中
					return item.interestId
				})
				let childInterest = this.childInterest // 所有子类
				for (let i = 0; i < childInterest.length; i++) {
					let chd = childInterest[i]
					if (chd.interestId == item.interestId && repeatIndex == -1) {
						chd.checked = true // 给所有选中项添加checked
					}
					if (chd.interestId == item.interestId && repeatIndex != -1) {
						chd.checked = false // 取消选中时取消checked= false
					}
				}
				this.selectedInterest = selectedInterest;
				this.selectedInterestId = selectedInterestId;
				this.childInterest = childInterest;
			},
			/** 新增-查询所有专长 */
			getAllInterest() {
				http('/v1/conmon/queryAllInterest', '', 'GET', this.getAllInterestCb, this)
			},
			/** 查询所有民族 */
			getAllNational() {
				http('/v1/conmon/queryAllNational', '', 'GET', this.getAllNationalCb, this)
			},
			//上传令牌
			getOssFileUploadToken() {
				http("/v1/file/getOssFileUploadToken", {}, "GET", this.getOssFileUploadTokenback, this)
			},
			//删除选中图片
			deleteImage(e) {
				let that = this;
				let type = e.currentTarget.dataset.type
				let {
					files1,
					files2,
					files3,
					imgList1,
					imgList2,
					imgList3
				} = this;
				if (type == 1) {
					files1.splice(e.currentTarget.dataset.index, 1)
					imgList1.splice(e.currentTarget.dataset.index, 1)
				} else if (type == 2) {
					files2.splice(e.currentTarget.dataset.index, 1)
					imgList2.splice(e.currentTarget.dataset.index, 1)
				} else {
					files3.splice(e.currentTarget.dataset.index, 1)
					imgList3.splice(e.currentTarget.dataset.index, 1)
				}
				this.files1 = files1;
				this.files2 = files2;
				this.files3 = files3;
				this.imgList1 = imgList1;
				this.imgList2 = imgList2;
				this.imgList3 = imgList3;
			},
			//选择图片
			chooseImage: function(e) {
				console.log('e', e)
				let uploadType = e.currentTarget.dataset.type
				let index = e.currentTarget.dataset.index
				console.log('index', index)
				let {
					files1,
					files2,
					files3,
					seeInformation
				} = this;
				this.uploadType = uploadType
				let that = this;
				// 体育学历证书
				if (uploadType == 1) {
					// 上传
					if (files1.length - 1 == index && this.seeInformation == '0') {
						// 图片上传超过1张
						if (files1.length > 1) {
							wx.showToast({
								title: '最多只能上传1张体育学历证书',
								icon: 'none',
								mask: true
							})
							return
						}
						wx.chooseImage({
							count: 1, // 最多上传1张
							sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
							sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
							success: function(res) {
								wx.showLoading({
									title: '上传中..',
									mask: true
								})
								that.tempFilePaths1 = res.tempFilePaths;
								that.getOssFileUploadToken();
							}
						})
					} else { // 查看
						let urls = seeInformation == 0 ? files1.slice(0, files1.length - 1) : files1
						wx.previewImage({
							current: e.currentTarget.id, // 当前显示图片的http链接
							urls: urls // 需要预览的图片http链接列表
						})
					}
				}
				// 体育专业证书
				if (uploadType == 2) {
					// 上传
					if (files2.length - 1 == index && this.seeInformation == '0') {
						// 图片上传超过1张
						if (that.files2.length > 3) {
							wx.showToast({
								title: '最多只能上传3张体育专业证书',
								icon: 'none',
								mask: true
							})
							return
						}
						wx.chooseImage({
							count: files2.length == 1 ? 3 : files2.length == 2 ? 2 : files2.length == 3 ? 1 : 0, // 动态判断最多上传图片数量
							sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
							sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
							success: function(res) {
								wx.showLoading({
									title: '上传中..',
									mask: true
								})
								that.tempFilePaths2 = res.tempFilePaths;
								that.getOssFileUploadToken();
							}
						})
					} else { // 查看
						let urls = seeInformation == 0 ? files2.slice(0, files2.length - 1) : files2
						wx.previewImage({
							current: e.currentTarget.id, // 当前显示图片的http链接
							urls: urls // 需要预览的图片http链接列表
						})
					}
				}
				// 社会体育指导员证书
				if (uploadType == 3) {
					// 上传
					if (files3.length - 1 == index && this.seeInformation == '0') {
						// 图片上传超过1张
						if (that.files3.length > 1) {
							wx.showToast({
								title: '最多只能上传1张社会体育指导员证书',
								icon: 'none',
								mask: true
							})
							return
						}
						wx.chooseImage({
							count: 1, // 最多上传1张
							sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
							sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
							success: function(res) {
								wx.showLoading({
									title: '上传中..',
									mask: true
								})
								that.tempFilePaths3 = res.tempFilePaths;
								that.getOssFileUploadToken();
							}
						})
					} else { // 查看
						let urls = seeInformation == 0 ? files3.slice(0, files3.length - 1) : files3
						wx.previewImage({
							current: e.currentTarget.id, // 当前显示图片的http链接
							urls: urls // 需要预览的图片http链接列表
						})
					}
				}
			},
			/*选择体育从业者分类todo*/
			checkboxChange: function(e) {
				this.sportslistSelected = e.detail.value;
			},
			/** 选择社会指导员分类 */
			checkInstructorType(e) {
				this.guideType = e.detail.value;
			},
			/** 选择单位推荐方式 */
			checkCompanyType(e) {
				console.log('eeeee', e)
				this.applyCompanyType = e.detail.value;
			},
			/** 专长选择取消 */
			cancel() {
				this.showModal = false;
			},
			/** 专长选择完成 */
			complete() {
				this.showModal = false;
			},
			/** 选择专长 */
			selectSpeciality() {
				this.showModal = true;
			},
			/** 选择职业 */
			changeProfession(e) {
				this.professionIndex = e.detail.value;
				this.professionId = this.professionObj[e.detail.value].id;
			},
			/** 选择政治面貌 */
			changePolitical(e) {
				this.politicalIndex = e.detail.value;
				this.politicsStatus = this.politicalObj[e.detail.value].id;
			},
			/** 选择民族 */
			changeNation(e) {
				this.nationIndex = e.detail.value
			},
			/** 获取工作单位 */
			getCompanyName(e) {
				this.companyName = e.detail.value;
			},
			/** 选择是否是体育行业从业者 */
			checkSportIndustry(e) {
				this.sportsPeople = e.detail.value;
			},
			/** 选择是否社会体育指导员 */
			checkSocietySportIndustry(e) {
				this.haveGuide = e.detail.value;
			},
			/** 选择城市value改变时触发 */
			bindMultiPickerChange(e) {
				let cityObj = this.allCityListObj[e.detail.value[0]] // 已选择城市index
				let {
					allCountyListObj,
					countyData
				} = this;
				/** 这段代码是为了方式picker滑动速度过快，导致数据匹配不正确 */
				let list = []
				for (let i = 0; i < allCountyListObj.length; i++) {
					let item = allCountyListObj[i]
					if (cityObj.cityId == item.cityId) {
						list.push(item.countyName)
					}
				}
				that.multiArray[1] = list;
				that.multiIndex[0] = e.detail.value[0] ? e.detail.value[0] : 0;
				that.multiIndex[1] = e.detail.value[1];
			},
			/** 选择城市，列改变时触发 */
			bindMultiPickerColumnChange(e) {
				switch (e.detail.column) {
					case 0:
						let list = []
						let countyData = []
						let allCountyListObj = this.allCountyListObj;
						for (let i = 0; i < allCountyListObj.length; i++) {
							let item = allCountyListObj[i]
							if (item.cityId == this.allCityListObj[e.detail.value].cityId) {
								list.push(item.countyName)
								countyData.push({
									countyId: item.countyId,
									countyName: item.countyName
								})
							}
						}
						this.multiArray[1] = list; // 动态改变区的展示名
						this.multiIndex[0] = e.detail.value;
						this.multiIndex[1] = 0;
						this.countyData = countyData; // 动态改变区的数据
						break;
				}
			},
			/*mike-城市区确认的时候触发的函数*/
			bindcityAreaChange(e) {
				if (wx.getStorageSync('cityAreaIndexCopy') == e.detail.value.join('') && !this.noStreet) {
					return false;
				} else {
					wx.setStorageSync('cityAreaIndexCopy', e.detail.value)
					this.cityAreaIndex = e.detail.value;
					this.noCity = false;
					this.noStreet = true;
				}
				that.getAllStreetList(this.cityAreaListData[1][this.cityAreaIndex[1]].areaCode);
			},
			/*mike--城市区改变的时候触发的函数*/
			bindcityAreaColumnChange(e) {
				let cityCode = '';
				let {
					cityAreaListData,
					cityAreaIndex
				} = this;
				cityAreaIndex[e.detail.column] = e.detail.value;
				switch (e.detail.column) {
					case 0: //如果修改的是城市的话就去请求区域
						cityCode = cityAreaListData[e.detail.column][e.detail.value].cityCode
						that.getAllAreaList(cityCode);
						cityAreaIndex[0] = e.detail.value;
						cityAreaIndex[1] = 0;
						break;
					case 1: //如果修改的是区域的话就去请求街道和社区
						cityAreaIndex[1] = e.detail.value;
						break;
				}
				this.cityAreaIndex = cityAreaIndex;
			},
			/*mike--街道村确认的时候触发*/
			bindstreetVillageChange(e) {
				this.streetVillageIndex = e.detail.value;
				this.noStreet = false;
			},
			/*mike--街道村修改的时候触发的函数*/
			bindstreetVillageColumnChange(e) {
				let streetCode = '';
				let {
					streetVillageListData,
					streetVillageIndex
				} = this;
				streetVillageIndex[e.detail.column] = e.detail.value;
				switch (e.detail.column) {
					case 0: //如果修改的是街道的话就去请求村子
						streetCode = streetVillageListData[e.detail.column][e.detail.value].streetCode
						that.getAllVillageList(streetCode);
						streetVillageIndex[0] = e.detail.value;
						streetVillageIndex[1] = 0;
						break;
					case 1: //如果修改的是村子的话就只改变当前选中的index
						streetVillageIndex[1] = e.detail.value;
						break;
				}
				this.streetVillageIndex = streetVillageIndex;
			},
			/*1mike-查询四川省所有的城市*/
			getAllCityList() {
				http("/v1/conmon/getAllCityList", {
					provinceCode: 51
				}, "GET", this.getAllCityListCb, this)
			},
			/*2mike-查询当前城市的区域*/
			getAllAreaList(cityCode) {
				http("/v1/conmon/getAllAreaList", {
					cityCode: cityCode
				}, "GET", this.getAllAreaListCb, this)
			},
			/*3mike-查询当前城市当前区域的街道*/
			getAllStreetList(areaCode) {
				http("/v1/conmon/getAllStreetList", {
					areaCode: areaCode
				}, "GET", this.getAllStreetListCb, this)
			},
			/*4mike-查询当前城市当前区域当前街道的村*/
			getAllVillageList(streetCode) {
				http("/v1/conmon/getAllVillageList", {
					streetCode: streetCode
				}, "GET", this.getAllVillageListCb, this)
			},
			/*mike-获取四川省的所有城市回调*/
			getAllCityListCb(res) {
				let allCityList = [];
				for (let val of res) {
					allCityList.push(val.cityName)
				}
				that.allCityListData = res;
				that.allCityList = allCityList;
				that.getAllAreaList(res[0].cityCode)
			},
			/*mike-获取四川省的当前城市的区*/
			getAllAreaListCb(res) {
				let allAreaList = [];
				for (let val of res) {
					allAreaList.push(val.areaName)
				}
				let cityAreaList = [that.allCityList, allAreaList]
				let cityAreaListData = [that.allCityListData, res]
				that.allAreaListData = res;
				that.allAreaList = allAreaList;
				that.cityAreaList = cityAreaList;
				that.cityAreaListData = cityAreaListData;
				that.getAllStreetList(res[that.cityAreaIndex[1]].areaCode)
			},
			/*mike-获取四川省当前城市的当前区域的街道*/
			getAllStreetListCb(res) {
				let allStreetList = [];
				for (let val of res) {
					allStreetList.push(val.streetName)
				}
				that.allStreetListData = res;
				that.allStreetList = allStreetList;
				that.getAllVillageList(res[0].streetCode)
			},
			/*mike-获取四川省当前城市的当前区域的当前街道的村子*/
			getAllVillageListCb(res) {
				let allVillageList = [];
				for (let val of res) {
					allVillageList.push(val.villageName)
				}
				let streetVillageList = [that.allStreetList, allVillageList]
				let streetVillageListData = [that.allStreetListData, res]
				that.allVillageListData = res;
				that.allVillageList = allVillageList;
				that.streetVillageList = streetVillageList;
				that.streetVillageListData = streetVillageListData;
			},


			/** 提交 */
			// submitCb(res) {
			// 	wx.hideLoading()
			// 	that.noCity = true;
			// 	that.noStreet = true;
			// 	wx.showToast({
			// 		title: '提交成功',
			// 		icon: 'none'
			// 	})
			// 	wx.redirectTo({
			// 		url: '/pages/successfulApplication/successfulApplication',
			// 	})
			// },
			/** 新增-查询所有专长回调 */
			getAllInterestCb(res) {
				let parentList = []
				let childList = []
				for (let i = 0; i < res.length; i++) {
					if (res[i].interestLevel == 1) {
						parentList.push(res[i])
					} else {
						childList.push(res[i])
					}
				}
				that.allInterestList = res;
				that.parentInterest = parentList;
				that.childInterest = childList;
			},
			/** 查询所有民族回调函数 */
			getAllNationalCb(res) {
				that.nationObjList = res;
				let name = []
				let code = []
				for (let i = 0; i < that.nationObjList.length; i++) {
					let item = that.nationObjList[i]
					name.push(item.nationalName)
					code.push(item.nationalCode)
				}
				that.nationNameData = name;
				that.nationalCodeData = code;
			},
			/*上传图片*/
			getOssFileUploadTokenback(res) {
				let uploadType = that.uploadType
				let fileName = '',
					filesArr = uploadType == 1 ? that.files1 : uploadType == 2 ? that.files2 : uploadType == 3 ? that.files3 : [];
				let uploadImageUrl = app.globalData.ossUploadUrl;
				let tempFilePaths = uploadType == 1 ? that.tempFilePaths1 : uploadType == 2 ? that.tempFilePaths2 : uploadType == 3 ? that.tempFilePaths3 : []
				console.log('tempFilePaths', tempFilePaths)
				for (let val of tempFilePaths) {
					fileName = "user/guide/" + that.getUploadFileName(val);
					uploadFile({
						filePath: val,
						dir: "",
						success: function(res) {
							wx.hideLoading();
							filesArr.unshift(uploadImageUrl + "/" + res)
							let imgList1 = [] // 学历证书
							let imgList2 = [] // 体育专业证书 
							let imgList3 = [] // 体育指导员证书 
							console.log('res', res)
							if (uploadType == 1) {
								filesArr.forEach(item => {
									imgList1.push({
										certificateType: '1',
										certificateUrl: item
									})
								})
								that.files1 = filesArr;
								that.imgList1 = imgList1;
							} else if (uploadType == 2) {
								filesArr.forEach(item => {
									imgList2.push({
										certificateType: '2',
										certificateUrl: item
									})
								})
								that.files2 = filesArr;
								that.imgList2 = imgList2;
							} else {
								filesArr.forEach(item => {
									imgList3.push({
										certificateType: '3',
										certificateUrl: item
									})
								})
								that.files3 = filesArr;
								that.imgList3 = imgList3;
							}
						},
						fail: function(res) {
							wx.hideLoading();
						},
						envs: {
							uploadImageUrl: uploadImageUrl,
							OSSAccessKeyId: res.accessKeyId,
							AccessKeySecret: res.accessKeySecret,
							timeout: 10, //超时时间 单位 小时
							stsToken: res.securityToken,
							fileSize: 50, //文件大小  单位m
							fileName: fileName
						}
					})
				}
			},
			/*图片命名*/
			getUploadFileName(videoSrc) {
				let len = 6;
				var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
				var maxPos = chars.length;
				var pwd = '';
				for (let i = 0; i < len; i++) {
					pwd += chars.charAt(Math.floor(Math.random() * maxPos));
				}
				pwd = pwd + '_' + new Date().getTime() + '.' + videoSrc.split('.').pop()
				return pwd;
			},
			errorCallback(res) {
				isNextClick = false;
			}
		},
		destroyed() {
			timer = null
		}
	}
</script>

<style>
	@import url("./apply.css");
</style>
