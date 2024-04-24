<template>
	<view>
		<!-- 漂浮头部 -->
		<view class="header" :style="{position:'fixed'}">
		</view>
		<!-- 占位 -->
		<view class="place"></view>
		<!-- 轮播图 -->
		<view class="swiper-view">
			<swiper class="swiper" indicator-dots="true" autoplay="true" circular="true" indicator-active-color="#ffffff">
				<swiper-item v-for="(notice, index) in noticeList" :key="index" @click="showDetail(notice)">
					<image :src="notice.imageAddress"></image>
				</swiper-item>
			</swiper>
			<view class="keep-out"></view>
		</view>
		
		<!-- 分类轮播 -->
		<view class="category">
			<view class="box">
				<swiper	class="swiper" duration="300" @change="categoryChange">
					<swiper-item v-for="(page, pageindex) in categoryList" :key="pageindex" >
						<view class="category-list">
							<view class="icon" v-for="category in page" :key="category.cat_id" @click="onClick(category.key)">
								<image mode="widthFix" :src="category.img"></image>
								<view>{{ category.title }}</view>
							</view>
						</view>
					</swiper-item>
				</swiper>
				<!-- <view class="dots">
					<view v-for="(page, pageindex) in categoryList" :key="pageindex" :class="{ active: pageindex == currentPageindex }"></view>
				</view> -->
			</view>
		</view>
		<!-- 
		<uni-row v-if="showAdmin">
			<uni-col :span="8">
				<view @click="onClick('building')" class="center">
					<image mode="widthFix" style="width: 150rpx; align-content: center;" src="/static/building.png"></image>
				</view>
			</uni-col>
			<uni-col :span="8">
				<view @click="onClick('consumption')" class="center">
					<image mode="widthFix" style="width: 150rpx; align-content: center;" src="/static/consumption.png"></image>
				</view>
			</uni-col>
			<uni-col :span="8">
				<view @click="onClick('consumptionRecord')" class="center">
					<image mode="widthFix" style="width: 150rpx; align-content: center; margin-left: 10rpx;" src="/static/consumptionRecord.png"></image>
				</view>
			</uni-col>
		</uni-row> -->
		<!-- #ifdef H5 -->
		<!-- <uni-row v-if="showAdmin">
			<uni-col :span="8">
				<view @click="onClick('person')" class="center">
					<image mode="widthFix" style="width: 150rpx; align-content: center; margin-left: 10rpx;" src="/static/person.png"></image>
				</view>
			</uni-col>
			<uni-col :span="8">
				<view @click="onClick('notice')" class="center">
					<image mode="widthFix" style="width: 150rpx; align-content: center; margin-left: 10rpx;" src="/static/notice.png"></image>
				</view>
			</uni-col>
			<uni-col :span="8">
				<view @click="onClick('serviceType')" class="center">
					<image mode="widthFix" style="width: 150rpx; align-content: center; margin-left: 10rpx;" src="/static/serviceType.png"></image>
				</view>
			</uni-col>
		</uni-row> -->
		<!-- #endif -->
		<!-- #ifdef MP-WEIXIN -->
		<!-- <uni-row v-if="showAdmin">
			<uni-col :span="12">
				<view @click="onClick('notice')" class="center">
					<image mode="widthFix" style="width: 150rpx; align-content: center; margin-left: 10rpx;" src="/static/notice.png"></image>
				</view>
			</uni-col>
			<uni-col :span="12">
				<view @click="onClick('serviceType')" class="center">
					<image mode="widthFix" style="width: 150rpx; align-content: center; margin-left: 10rpx;" src="/static/serviceType.png"></image>
				</view>
			</uni-col>
		</uni-row> -->
		<!-- #endif -->
		
		<!-- <uni-row v-if="showMaintenance">
			<uni-col :span="12">
				<view @click="onClick('myDispatch')" class="center">
					<image mode="widthFix" style="width: 150rpx; align-content: center;" src="/static/myDispatched.png"></image>
				</view>
			</uni-col>
			<uni-col :span="12">
				<view @click="onClick('comment')" class="center">
					<image mode="widthFix" style="width: 150rpx; align-content: center;" src="/static/comment.png"></image>
				</view>
			</uni-col>
		</uni-row>
		<uni-row v-if="showMaintenance">
			<uni-col :span="12">
				<view @click="onClick('orderStatistics')" class="center">
					<image mode="widthFix" style="width: 150rpx; align-content: center;" src="/static/orderStatistics.png"></image>
				</view>
			</uni-col>
			<uni-col :span="12">
				<view @click="onClick('consumptionRecord')" class="center">
					<image mode="widthFix" style="width: 150rpx; align-content: center; margin-left: 10rpx;" src="/static/consumptionRecord.png"></image>
				</view>
			</uni-col>
		</uni-row>
		<uni-row v-if="showMaintenance">
			<uni-col :span="12">
				<view @click="onClick('consumptionRecord')" class="center">
					<image mode="widthFix" style="width: 150rpx; align-content: center; margin-left: 10rpx;" src="/static/consumptionRecord.png"></image>
				</view>
			</uni-col>
			<uni-col :span="12">
				<view @click="onClick('message')" class="center">
					<image mode="widthFix" style="width: 150rpx; align-content: center;" src="/static/message2.png"></image>
				</view>
			</uni-col>
		</uni-row>
		<uni-row v-if="showMaintenanceManage">
			<uni-col :span="8">
				<view @click="onClick('consumption')" class="center">
					<image mode="widthFix" style="width: 150rpx; align-content: center;" src="/static/consumption.png"></image>
				</view>
			</uni-col>
			<uni-col :span="8">
				<view @click="onClick('service')" class="center">
					<image mode="widthFix" style="width: 150rpx; align-content: center;" src="/static/statistics.png"></image>
				</view>
			</uni-col>
			<uni-col :span="8">
				<view @click="onClick('dispatch')" class="center">
					<image mode="widthFix" style="width: 150rpx; align-content: center;" src="/static/dispatch.png"></image>
				</view>
			</uni-col>
		</uni-row>
		<uni-row v-if="showMaintenanceManage">
			<uni-col :span="12">
				<view @click="onClick('message')" class="center">
					<image mode="widthFix" style="width: 150rpx; align-content: center;" src="/static/message2.png"></image>
				</view>
			</uni-col>
			<uni-col :span="12">
				<view @click="onClick('consumptionRecord')" class="center">
					<image mode="widthFix" style="width: 150rpx; align-content: center; margin-left: 10rpx;" src="/static/consumptionRecord.png"></image>
				</view>
			</uni-col>
		</uni-row>
		</uni-row>
		<uni-row v-if="showDormitory">	
			<uni-col :span="12">
				<view @click="onClick('notice')" class="center">
					<image mode="widthFix" style="width: 150rpx; align-content: center; margin-left: 10rpx;" src="/static/notice.png"></image>
				</view>
			</uni-col>
			<uni-col :span="12">
				<view @click="onClick('building')" class="center">
					<image mode="widthFix" style="width: 150rpx; align-content: center;" src="/static/building.png"></image>
				</view>
			</uni-col>
		</uni-row>
		<uni-row v-if="showDormitory">
			<uni-col :span="12">
				<view @click="onClick('buildingOrder')" class="center">
					<image mode="widthFix" style="width: 150rpx; align-content: center;" src="/static/buildingOrder.png"></image>
				</view>
			</uni-col>		
		    <uni-col :span="12">
				<view @click="onClick('tool')" class="center">
					<image mode="widthFix" style="width: 150rpx; align-content: center;" src="/static/tool.png"></image>
				</view>
			</uni-col>
		</uni-row>
		<uni-row v-if="showDormitory">
			<uni-col :span="12">
				<view @click="onClick('message')" class="center">
					<image mode="widthFix" style="width: 150rpx; align-content: center;" src="/static/message2.png"></image>
				</view>
			</uni-col>
		</uni-row>
		<uni-row v-if="showStudent">
			<uni-col :span="12">
				<view @click="onClick('tool')" class="center">
					<image mode="widthFix" style="width: 150rpx; align-content: center;" src="/static/tool.png"></image>
				</view>
			</uni-col>
			<uni-col :span="12">
				<view @click="onClick('message')" class="center">
					<image mode="widthFix" style="width: 150rpx; align-content: center;" src="/static/message2.png"></image>
				</view>
			</uni-col>
		</uni-row>
		<uni-row v-if="showStudent">
			<uni-col :span="12">
				<view @click="onClick('service')" class="center">
					<image mode="widthFix" style="width: 150rpx; align-content: center;" src="/static/statistics.png"></image>
				</view>
			</uni-col>
		</uni-row> -->
		<view class="content">
			<uni-popup ref="inputDialog" type="dialog">
				<view class="popConfig" >
					<view>
						<image style="max-width: 70px; max-height: 70px;" :src="noticeDetai.imageAddress" mode="aspectFit"></image>
					</view>
					<view>
						<span style="font-size: 14px; color: #606266;">公告信息: 	{{noticeDetai.text}}</span>
					</view>
					<view>
						<uni-row class="demo-uni-row">
							<uni-col :span="24">
								<button class="container uni-bg-blue1" @click="addDialogClose" style="background-color: #4ba5f6;font-size: 8px; color: white; margin: 10px 10px;">关闭</button>
							</uni-col>
						</uni-row>
					</view>
				</view>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	import {set, get} from '@/common/storage.js'
	export default {
		data() {
			return {
				categoryList: [
					// [//第一页
					// 	{ cat_id: 0, key: 'person', img: '/static/person.png', title: '人员管理' },
					// 	{ cat_id: 1, key: 'building', img: '/static/building.png', title: '宿舍管理' },
					// 	{ cat_id: 2, key: 'consumption', img: '/static/consumption.png', title: '耗材管理' },
					// 	{ cat_id: 3, key: 'consumptionRecord', img: '/static/consumptionRecord.png',  title: '耗材记录' },
					// 	{ cat_id: 4, key: 'notice', img: '/static/notice.png', title: '公告管理' },
					// 	{ cat_id: 5, key: 'serviceType', img: '/static/serviceType.png', title: '维修类型' },
					// 	{ cat_id: 6, key: 'myDispatch', img: '/static/myDispatched.png', title: '我的派单' },
					// 	{ cat_id: 7, key: 'comment', img: '/static/comment.png', title: '订单评价' },
					// 	{ cat_id: 8, key: 'orderStatistics', img: '/static/orderStatistics.png', title: '工单统计' },
					// 	{ cat_id: 9, key : 'message', img: '/static/message.png', title: '留言' },
					// 	{ cat_id: 10, key: 'dispatch', img: '/static/dispatch.png', title: '分配' },
					// 	{ cat_id: 11, key: 'buildingOrder', img: '/static/buildingOrder.png', title: '楼栋订单' },
					// 	{ cat_id: 12, key: 'tool', img: '/static/tool.png', title: '维修申请' },
					// 	{ cat_id: 13, key: 'service', img: '/static/statistics.png', title: '订单统计' }
					// 	{ cat_id: 14, key: 'progress', img: '/static/progress.png', title: '维修进度' }
					// 	{ cat_id: 14, key: 'history', img: '/static/history.png', title: '历史订单' }
					// ],
					// [//第二页
					// 	{ cat_id: 10, img: '../../static/HM-shophome/category-img/10.png', title: '面霜' },
					// 	{ cat_id: 11, img: '../../static/HM-shophome/category-img/11.png', title: '乳液' },
					// 	{ cat_id: 12, img: '../../static/HM-shophome/category-img/12.png', title: '梳子' },
					// 	{ cat_id: 13, img: '../../static/HM-shophome/category-img/13.png', title: '刷子' },
					// 	{ cat_id: 14, img: '../../static/HM-shophome/category-img/14.png', title: '洗脸仪' },
					// 	{ cat_id: 15, img: '../../static/HM-shophome/category-img/15.png', title: '洗面奶' },
					// 	{ cat_id: 16, img: '../../static/HM-shophome/category-img/16.png', title: '香水' }
					// ]
				],
				showAdmin:false,
				showMaintenance:false,
				showMaintenanceManage:false,
				showDormitory:false,
				showStudent:false,
				showPersonManage: false,
				showNoticeManage: false,
				showToolManage: false,
				showConsumptionManage: false,
				showBuildingManage: false,
				toolCover: '/static/tool1.png',
				background: ['color1', 'color2', 'color3'],
				indicatorDots: true,
				autoplay: true,
				interval: 5000,
				duration: 500,
				noticeList:[],
				user: {
					name:'',
					phone:'',
					identity:'',
					role:{
						id:0,
						name:'',
						displayName:''
					}
				},
				noticeDetai:{}
			}
		},
		onLoad() {
			uni.request({
				// #ifdef H5
				url: 'api/noticeList',
				// #endif
				// #ifdef MP-WEIXIN
				url: this.$api.defConfig.def().baseUrl + 'api/noticeList',
				// #endif
				method: 'GET',
				success: (res) => {
					if (res.data.code === 200) {
						this.noticeList = res.data.noticeList
					}
				},
				fail: (res) => {
					
				}
			})
			
			var isLogin = get('isLogin')
			console.log(isLogin)
			var loginInfo = get('loginInfo')
			console.log(loginInfo)
			if (isLogin && loginInfo) {
				this.user = loginInfo
			} else {
				setTimeout(()=>{
					uni.navigateTo({
					  url: '/pages/user/login'
					})
				}, 1000)
				uni.showToast({
				  title: '请登录！',
				  icon: 'none'
				})
			}
			console.log(this?.user?.role.name)
			let categries = []
			if (this?.user?.role?.name === 'admin') {
				categries.push({ cat_id: 0, key: 'person', img: '/static/person.png', title: '人员管理' })
				categries.push({ cat_id: 1, key: 'building', img: '/static/building.png', title: '宿舍管理' })
				categries.push({ cat_id: 2, key: 'consumption', img: '/static/consumption.png', title: '耗材管理' })
				categries.push({ cat_id: 3, key: 'consumptionRecord', img: '/static/consumptionRecord.png',  title: '耗材记录' })
				categries.push({ cat_id: 4, key: 'notice', img: '/static/notice.png', title: '公告管理' })
				categries.push({ cat_id: 5, key: 'serviceType', img: '/static/serviceType.png', title: '维修类型' })
				categries.push({ cat_id: 9, key : 'message', img: '/static/message.png', title: '留言' })
			} else if (this?.user?.role?.name === 'student') {
				categries.push({ cat_id: 12, key: 'tool', img: '/static/tool.png', title: '维修申请' })
				categries.push({ cat_id: 14, key: 'progress', img: '/static/progress.png', title: '维修进度' })
				categries.push({ cat_id: 15, key: 'history', img: '/static/history.png', title: '历史订单' })
				categries.push({ cat_id: 9, key : 'message', img: '/static/message.png', title: '留言' })
			} else if (this?.user?.role?.name === 'maintenance-manager') {
				categries.push({ cat_id: 10, key: 'dispatch', img: '/static/dispatch.png', title: '分配' })
				categries.push({ cat_id: 5, key: 'serviceType', img: '/static/serviceType.png', title: '维修类型' })
				categries.push({ cat_id: 2, key: 'consumption', img: '/static/consumption.png', title: '耗材管理' })
				categries.push({ cat_id: 3, key: 'consumptionRecord', img: '/static/consumptionRecord.png',  title: '耗材记录' })
				categries.push({ cat_id: 13, key: 'service', img: '/static/statistics.png', title: '订单统计' })
				categries.push({ cat_id: 9, key : 'message', img: '/static/message.png', title: '留言' })
			} else if (this?.user?.role?.name === 'maintainer') {
				categries.push({ cat_id: 6, key: 'myDispatch', img: '/static/myDispatched.png', title: '我的派单' })
				categries.push({ cat_id: 7, key: 'comment', img: '/static/comment.png', title: '订单评价' })
				categries.push({ cat_id: 8, key: 'orderStatistics', img: '/static/orderStatistics.png', title: '工单统计' })
				categries.push({ cat_id: 2, key: 'consumption', img: '/static/consumption.png', title: '耗材管理' })
				categries.push({ cat_id: 3, key: 'consumptionRecord', img: '/static/consumptionRecord.png',  title: '耗材记录' })
				categries.push({ cat_id: 9, key : 'message', img: '/static/message.png', title: '留言' })
			} else if (this?.user?.role?.name === 'dormitory-manager') {
				categries.push({ cat_id: 4, key: 'notice', img: '/static/notice.png', title: '公告管理' })
				categries.push({ cat_id: 1, key: 'building', img: '/static/building.png', title: '宿舍管理' })
				categries.push({ cat_id: 11, key: 'buildingOrder', img: '/static/buildingOrder.png', title: '楼栋订单' })
				categries.push({ cat_id: 12, key: 'tool', img: '/static/tool.png', title: '维修申请' })
				categries.push({ cat_id: 9, key : 'message', img: '/static/message.png', title: '留言' })
			} else if (this?.user?.role?.name === "none") {
			}
			this.categoryList.push(categries)
			console.log('this.showAdmin:'+this.showAdmin)
			console.log('this.showStudent:'+this.showStudent)
			console.log('this.showMaintenance:'+this.showMaintenance)
			console.log('this.showDormitory:'+this.showDormitory)
		},
		methods: {
			my() {
				uni.reLaunch({
					url: "/pages/user/my"
				})
			},
			onClick(type) {
				if (type === 'notice') {
					uni.reLaunch({
						url: "/pages/service/notice"
					})
				} else if (type === 'person') {
					uni.reLaunch({
						url: "/pages/user/person"
					})
				} else if (type === 'tool') {
					uni.reLaunch({
						url: "/pages/service/addService?creatorId=" + get('loginInfo').id
					})
				} else if (type === 'service') {
					uni.reLaunch({
						url: "/pages/service/service?creatorId=" + get('loginInfo').id
					})
				} else if (type === 'dispatch') {
					uni.reLaunch({
						url: "/pages/service/dispatch"
					})
				} else if (type === 'myDispatch') {
					uni.reLaunch({
						url: "/pages/service/myDispatch"
					})
				} else if (type === 'comment') {
					uni.reLaunch({
						url: "/pages/service/comment"
					})
				} else if (type === 'orderStatistics') {
					uni.reLaunch({
						url: "/pages/service/orderStatistics"
					})
				} else if (type === 'buildingOrder') {
					uni.reLaunch({
						url: "/pages/service/buildingOrder"
					})
				} else if (type === 'history') {
					uni.reLaunch({
						url: "/pages/service/service"
					})
				} else if (type === 'progress') {
					uni.reLaunch({
						url: "/pages/service/progress"
					})
				} else if (type === 'consumption') {
					uni.reLaunch({
						url: "/pages/service/consumption"
					})
				} else if (type === 'consumptionRecord') {
					uni.reLaunch({
						url: "/pages/service/consumptionRecord"
					})
				} else if (type === 'building') {
					uni.reLaunch({
						url: "/pages/service/building"
					})
				} else if (type === 'message') {
					uni.reLaunch({
						url: "/pages/message/message"
					})
				} else if (type === 'serviceType') {
					uni.reLaunch({
						url: "/pages/service/serviceType"
					})
				}
			},			
			addDialogClose() {
				this.$refs.inputDialog.close()
			},
			showDetail(notice) {
				console.log(notice)
				this.noticeDetai= notice
				this.$refs.inputDialog.open()
			}
		}
	}
</script>
<style lang="scss">
	@font-face {font-family:"HMfont-home";src:url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAAP8AAsAAAAACFwAAAOwAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCDHAqEEINSATYCJAMQCwoABCAFhG0HTxtLBxHVmzvJfhS4scOeC1v4zNNRK/hO5b0IHqg/8838ye5XsIDanmAkhZ1NSZygm4SsbYYkp17ICsOUxIP/ZZm9xejtQAD8zzX10geY387mEtXapUd7A5xF6oAi2pJoE8YNY1dexGkIwCSZQoiq1es2RUdhTBKA6N2jWwf0lAlVky3QEYSUrFSIOTjQ5VR5GZjt/168obDQQeLQMGY27FqtMxWf5z5fpgWCgdYugng8B8DWgQYUAhSI7qWujmhhqBAaptJfURzQ0ZEwVkfB58uCQSTZi0o3//JAItBAhGBk2gAURUrtxMQ2BQnPC1IQ8HyZmpvE1XgdMIDtwHVEJt4qkThsZwFPVHiEFTHKtWBBYGGUe/HmsZu6TluCStw+fXGMY9GyUb4b133Xrze9etV77VqzxcuXbYq8bF6/7rtxo5lY6A1cLcuCQJS3oXHswOYKUSaI71xkXr3ayZy2SIix0YumRS6AwEnLmr58WS9z2pKlYcJCCGzcXOU81Xuhp1osIWbBiUQWehda7lTvaNeCJX0WbYgksMA0hdlLo6zDp1PEomIdVu7YE4wN7nH7uGPdHXz2R3uHnX68tcP6SPE5ZSdObNpN/9dybtfmr6tHoy6+rN+DqdvnW9lUbkHTdcUWfKp1yzVr5Ag5HCqGU0Hca3jpAt2GiWFRwxYvdpYFo2b3tN/HvLeFd+BAr5Bu7CXnzKFlJb8dtP3ucx1djc+589Pep+W7X706stfvml+7i8fsWunxp7/f/uzsrgzj9Sv3p+6T7yqwvrfdy3nk/J6eZ84fnHp2lSvf/m/7H7569dDvuY/fTX+Mwdog+QVAGyB/IHmGyK8/exQrX13Maucu+y23rrbi5tQ1T3yTor3oj4kV8a8VtyxSqtQwKyXLbJF2kaI5DgAkYGICPzQG4dwfQxPVOhMEOlExSEJJAg2dTFSRhcCBRVEIQacCmBSkxnqLCAaiIZQBFGAiAIGH3SBxcRo0PFxBFXkPHETzDkLwCA1MfCJiR4tswStWxeEccIPlAbXSxS1rYEH2G0U8ZpeU+sw/Oq+80JR1NjrghW6MOT6JNgQO3NEJPTgPj4PAONK4hlKGYLqq4mVvKlc6M0YVh3PADZYH1EoXd8sHlvv+G0U8ZldDq/D+0XnVPTRl3QIdVFcr2rX090m0IXA8jjs6oYcOPMwQgSkfpnENpewRMF2FSvG2qnJ+zfmE6wATY6YSUmhCCQehg9V8advwun0+nHuJ0VP0kYrcz/Qox5hl') format('woff2');}
	.icon {
		font-family:"HMfont-home" !important;
		font-size:60upx;
		font-style:normal;
		color:#ffffff;
		&.scan {
			&:before{content:"\e69a";}
		}
		&.menu {
			&:before{content:"\e62b";}
		}
		&.search {
			&:before{content:"\e628";}
		}
	}
	page {
		background-color: #fff;
	}
	.status {
		width: 100%;
		height: 0;
		/*  #ifdef  APP-PLUS  */
		height: var(--status-bar-height);
		/*  #endif  */
		background-color: #ff570a;
		position: fixed;
		top: 0;
		z-index: 999;
	}
	.header {
		width: 100%;
		height: 100upx;
		background-color: #7ab7ff;
		display: flex;
		position: fixed;
		top: 0;
		/*  #ifdef  APP-PLUS  */
		top: var(--status-bar-height);
		/*  #endif  */
		
		z-index: 996;
		.scan {
			width: 100upx;
			height: 100upx;
			flex-shrink: 1;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.input {
			width: calc(100% - 200upx);
			display: flex;
			justify-content: center;
			align-items: center;
			position:relative;
			input {
				width: calc(100% - 60upx);
				height: 60upx;
				background-color: #ffffff;
				border-radius: 60upx;
				padding-left: 60upx;
				font-size: 30upx;
				
			}
			.icon{
				width: 60upx;
				height: 60upx;
				position: absolute;
				color: #a18090;
				z-index: 996;
				top: 20upx;
				left: 0;
				font-size: 40upx;
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}
		.menu {
			width: 100upx;
			height: 100upx;
			flex-shrink: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			image{
				width: 60upx;
				height: 60upx;
				border-radius: 60upx;
			}
		}
	}
	.place{
		/*  #ifdef  APP-PLUS  */
		margin-top: var(--status-bar-height);
		/*  #endif  */
		background-color: #7ab7ff;
		height: 100upx;
	}
	.swiper-view {
		.swiper {
			width: 100%;
			height: 280upx;
			image {
				width: 100%;
				height: 280upx;
			}
		}
		.keep-out {
			width: 100%;
			height: 30upx;
			border-radius: 100% 100% 0 0;
			background-color: #8987ff;
			margin-top: -15upx;
			position: absolute;
		}
	}
	.category {
		width: 95%;
		padding: 2.5vw 2.5vw;
		background-color: #7ab7ff;
		.box {
			width: 100%;
			border-radius: 20upx;
			background-color: #ffffff;
			.dots {
				display: flex;
				justify-content: center;
				height: 15upx;
				width: 100%;
				view{
					width: 30upx;
					height: 5upx;
					background-color: rgba(0, 0, 0, 0.2);
					&.active {
						background-color: #ff570a;
					}
				}
			}
			.swiper {
				width: 100%;
				padding: 10upx 0;
				.uni-swiper-dot {
					width: 20upx;
				}
				.category-list {
					width: 100%;
					height: auto;
					display: flex;
					justify-content: flex-start;
					padding: 10upx 0;
					flex-flow: wrap;
					.icon {
						width: 20%;
						margin: 0px 20px 0px 20px;
						display: flex;
						flex-flow: wrap;
						justify-content: center;
						font-size: 22upx;
						color: #666;
						image {
							width: 70%;
							height: 13.3vw;
						}
						view{
							width: 100%;
							display: flex;
							justify-content: center;
						}
					}
				}
			}
		}
	}
	.pick{
		width: 95%;
		padding: 0 2.5vw 2.5vw 2.5vw;
		background: linear-gradient(to bottom, #ff570a 0%,#ffffff 105%);
		.box{
			width: 100%;
			border-radius: 20upx;
			background-color: #ffffff;
			.title{
				display: flex;
				justify-content: flex-start;
				align-items: flex-end;
				height: 60upx;
				border-bottom: solid 1upx #eee;
				padding-bottom: 10upx;
				.big{
					font-size: 34upx;
					padding-left: 20upx;
					color: #46434f;
				}
				.small{
					font-size: 24upx;
					padding-left: 20upx;
					color: #827f8b;
				}
			}
			.product-list{
				padding: 15upx 20upx 15upx 20upx;
				column-count: 2;
				column-width: 50%;
				column-gap: 10upx;
				>view{
					display: flex;
					background-color: #f8f8f8;
					position:relative;
					&:nth-child(1){
						.price{
							color: #e65339;
							font-size: 30upx;
							position: absolute;
							bottom: 8upx;
							left: 8upx;
						}
						.slogan{
							color: #807c87;
							font-size: 30upx;
							position: absolute;
							bottom: 8upx;
							right: 8upx;
						}
						image{
							width: 100%;
							height: 0;
						}
					}
					&:nth-child(2),&:nth-child(3){
						image{
							width: calc(50% - 5upx);
							height: 0;
						}
						.price{
							position: absolute;
							top: 25%;
							left: 55%;
							color: #e65339;
							font-size: 30upx;
						}
						.slogan{
							position: absolute;
							top: 60%;
							left: 55%;
							color: #807c87;
							font-size: 20upx;
						}
					}
					&:nth-child(2){
						margin-bottom: 10upx;
					}
				}
			}
		}
	}
	.banner{
		image{
			width: 100%;
		}
	}
	.goods-list{
		background-color: #f4f4f4;
		.title{
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 60upx;
			color: #979797;
			font-size: 24upx;
		}
		.loading-text{
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 60upx;
			color: #979797;
			font-size: 24upx;
		}
		.product-list{
			width: 95%;
			padding: 0 2.5% 2.5vw 2.5%;
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
			.product{
				width: 48.75%;
				border-radius: 20upx;
				background-color: #fff;
				margin: 0 0 15upx 0;
				image{
					width: 100%;
					border-radius: 20upx 20upx 0 0;
				}
				.name{
					width: 92%;
					padding: 10upx 4%;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					text-align: justify;
					overflow: hidden;
					font-size: 30upx;
				}
				.info{
					display: flex;
					justify-content: space-between;
					align-items: flex-end;
					width: 92%;
					padding: 10upx 4% 10upx 4%;
					
					.price{
						color: #e65339;
						font-size: 30upx;
						font-weight: 600;
					}
					.slogan{
						color: #807c87;
						font-size: 24upx;
					}
				}
			}
			
		}
	}
	.center{text-align: center; vertical-align:middle;}
	.container { position: relative; } 
	.right-aligned-button { position: absolute; right: 0; }
	.left-aligned-button { position: absolute; left: 0; }
	.uni-margin-wrap {
		/* width: 690rpx; */
		width: 100%;
		height: 100%;
	}
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}
	.swiper {
		height: 300px;
	}
	.swiper-wx {
		height: 150px;
	}
	.swiper-item {
		display: block;
		/* height: 300rpx; */
		/* line-height: 300rpx; */
		text-align: center;
	}
	.swiper-list {
		margin-top: 40rpx;
		margin-bottom: 0;
	}
	.uni-common-mt {
		margin-top: 60rpx;
		position: relative;
	}
	.info {
		position: absolute;
		right: 20rpx;
	}
	.uni-padding-wrap {
		width: 550rpx;
		padding: 0 100rpx;
	}
	@import '../../common/uni.css';
	.popConfig {
			z-index: 999;
			background-color: white;
			box-sizing: border-box;
			padding: 25rpx;
			width: 60vw;
			min-height: 300rpx;
			border-radius: 15rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			align-items: center;
	}
	.left-aligned-button { position: absolute; left: 0; }
	.uni-group {
		display: flex;
		align-items: center;
	}	
	.demo-uni-row {
		margin-bottom: 10px;
		/* #ifdef MP-TOUTIAO || MP-QQ || MP-BAIDU */
		display: block;
		/* #endif */
	}
</style>