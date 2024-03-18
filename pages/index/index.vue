<template>
	<view class="content">
		<view>
			<button class="container right-aligned-button uni-bg-blue1" @click="my">我的</button>
			<uni-title type="h1" title="寝室公告信息"></uni-title>
		</view>
		<view class="uni-margin-wrap">
			<swiper class="swiper" circular :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval"
				:duration="duration">
				<swiper-item v-for="(notice, index) in noticeList" :key="index">
					<view class="swiper-item uni-bg-grey">
						<image :src="notice.imageAddress" style="max-width: 200px; max-height: 200px;margin: 10px;"></image>
<!-- 						<text style="word-break:break-all;">
							{{notice.text}}
						</text> -->
					</view>
				</swiper-item>
			</swiper>
		</view>
		<uni-row v-show="showAdmin">
			<uni-col :span="8">
				<uni-section title="人员管理" type="circle" titleColor="#a17b17" style="font-size: 10px;">
					<uni-card :is-shadow="true" @click="onClick('person')" class="center">
						<image style="width: 30px; height: 30px;" src="/static/person.png"></image><br/>
					</uni-card>
				</uni-section>
			</uni-col>
			<uni-col :span="8">
				<uni-section title="公告管理" type="square" titleColor="#a17b17">
					<uni-card :is-shadow="true" @click="onClick('notice')" class="center">
						<image style="width: 30px; height: 30px;" src="/static/notice.png"></image><br/>
					</uni-card>
				</uni-section>
			</uni-col>
			<uni-col :span="8">
				<uni-section title="维修类型" type="square" titleColor="#a17b17">
					<uni-card :is-shadow="true" @click="onClick('serviceType')" class="center">
						<image style="width: 30px; height: 30px; align-content: center;" src="/static/serviceType.png"></image><br/>
					</uni-card>
				</uni-section>
			</uni-col>
		</uni-row>
		<uni-row v-show="showAdmin">
			<uni-col :span="8">
				<uni-section title="宿舍管理" type="line">
					<uni-card :is-shadow="true" @click="onClick('building')" class="center">
						<image style="width: 30px; height: 30px; align-content: center;" src="/static/building.png"></image><br/>
					</uni-card>
				</uni-section>
			</uni-col>
			<uni-col :span="8">
				<uni-section title="耗材管理" type="line">
					<uni-card :is-shadow="true" @click="onClick('consumption')" class="center">
						<image style="width: 30px; height: 30px; align-content: center;" src="/static/consumption.png"></image><br/>
					</uni-card>
				</uni-section>
			</uni-col>
			<uni-col :span="8">
				<uni-section title="耗材记录" type="line">
					<uni-card :is-shadow="true" @click="onClick('consumptionRecord')" class="center">
						<image style="width: 30px; height: 30px; align-content: center;" src="/static/consumptionRecord.png"></image><br/>
					</uni-card>
				</uni-section>
			</uni-col>
		</uni-row>
		<uni-row v-show="showMaintenance">
			<uni-col :span="12">
				<uni-section title="耗材管理" type="line">
					<uni-card :is-shadow="true" @click="onClick('consumption')" class="center">
						<image style="width: 30px; height: 30px; align-content: center;" src="/static/consumption.png"></image><br/>
					</uni-card>
				</uni-section>
			</uni-col>
			<uni-col :span="12">
				<uni-section title="维修管理" type="line">
					<uni-card :is-shadow="true" @click="onClick('tool')" class="center">
						<image style="width: 30px; height: 30px; align-content: center;" src="/static/tool1.png"></image><br/>
					</uni-card>
				</uni-section>
			</uni-col>
		</uni-row>
		<uni-row v-show="showMaintenance">
			<uni-col :span="12">
				<uni-section title="留言管理" type="line">
					<uni-card :is-shadow="true" @click="onClick('message')" class="center">
						<image style="width: 30px; height: 30px; align-content: center;" src="/static/message.png"></image><br/>
					</uni-card>
				</uni-section>
			</uni-col>
			<uni-col :span="12">
				<uni-section title="耗材记录" type="line">
					<uni-card :is-shadow="true" @click="onClick('consumptionRecord')" class="center">
						<image style="width: 30px; height: 30px; align-content: center;" src="/static/consumptionRecord.png"></image><br/>
					</uni-card>
				</uni-section>
			</uni-col>
		</uni-row>
		</uni-row>
		<uni-row v-show="showDormitory">	
			<uni-col :span="12">
				<uni-section title="维修管理" type="line">
					<uni-card :is-shadow="true" @click="onClick('tool')" class="center">
						<image style="width: 30px; height: 30px; align-content: center;" src="/static/tool1.png"></image><br/>
					</uni-card>
				</uni-section>
			</uni-col>
			<uni-col :span="12">
				<uni-section title="留言管理" type="line">
					<uni-card :is-shadow="true" @click="onClick('message')" class="center">
						<image style="width: 30px; height: 30px; align-content: center;" src="/static/message.png"></image><br/>
					</uni-card>
				</uni-section>
			</uni-col>
		</uni-row>
		<uni-row v-show="showDormitory">
			<uni-col :span="12">
				<uni-section title="宿舍管理" type="line">
					<uni-card :is-shadow="true" @click="onClick('building')" class="center">
						<image style="width: 30px; height: 30px; align-content: center;" src="/static/building.png"></image><br/>
					</uni-card>
				</uni-section>
			</uni-col>		
		    <uni-col :span="12">
				<uni-section title="公告管理" type="square" titleColor="#a17b17">
					<uni-card :is-shadow="true" @click="onClick('notice')" class="center">
						<image style="width: 30px; height: 30px;" src="/static/notice.png"></image><br/>
					</uni-card>
				</uni-section>
			</uni-col>
		</uni-row>
		<uni-row v-show="showStudent">
			<uni-col :span="12">
				<uni-section title="维修管理" type="line">
					<uni-card :is-shadow="true" @click="onClick('tool')" class="center">
						<image style="width: 30px; height: 30px; align-content: center;" src="/static/tool1.png"></image><br/>
					</uni-card>
				</uni-section>
			</uni-col>
			<uni-col :span="12">
				<uni-section title="留言管理" type="line">
					<uni-card :is-shadow="true" @click="onClick('message')" class="center">
						<image style="width: 30px; height: 30px; align-content: center;" src="/static/message.png"></image><br/>
					</uni-card>
				</uni-section>
			</uni-col>
		</uni-row>
	</view>
</template>

<script>
	import {set, get} from '@/common/storage.js'
	export default {
		data() {
			return {
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
				}
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
			if (this?.user?.role?.name === 'admin') {
				this.showAdmin = true
				this.showStudent = true
				this.showMaintenance = true
				this.showDormitory = true
			} else if (this?.user?.role?.name === 'student') {
				this.showStudent = true
				this.showAdmin = false
				this.showMaintenance = false
				this.showDormitory = false
			} else if (this?.user?.role?.name === 'maintenance-manager' || this?.user?.role?.name === 'maintainer') {
				this.showStudent = false
				this.showAdmin = false
				this.showMaintenance = true
				this.showDormitory = false
			} else if (this?.user?.role?.name === 'dormitory-manager') {
				this.showStudent = false
				this.showAdmin = false
				this.showMaintenance = false
				this.showDormitory = true
			} else if (this?.user?.role?.name === "none") {
				this.showStudent = false
				this.showAdmin = false
				this.showMaintenance = false
				this.showDormitory = false
			}
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
						url: "/pages/service/service?creatorId=" + get('loginInfo').id
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
			}
		}
	}
</script>
<style>
	.center{text-align: center; vertical-align:middle;}
	.container { position: relative; } 
	.right-aligned-button { position: absolute; right: 0; }
	.left-aligned-button { position: absolute; left: 0; }
	.uni-margin-wrap {
		width: 690rpx;
		width: 100%;
	}
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.swiper {
		height: 300rpx;
	}
	.swiper-item {
		display: block;
		height: 300rpx;
		line-height: 300rpx;
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
</style>
