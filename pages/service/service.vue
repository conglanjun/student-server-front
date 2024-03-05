<template>
	<view>
		<view>
			<button class="container right-aligned-button uni-bg-blue1" @click="addService" style="background-color: #b88e22;font-size: 12px; color: white;width: 80ps;">提交维修单</button>
			<button class="container right-aligned-button uni-bg-blue1" @click="homePage" style="background-color: #007FD9;font-size: 12px; color: white; margin-right: 100px;">首页</button>
			<uni-title type="h1" title="维修信息"></uni-title>
		</view>
		<!-- <view class="container">
			<uni-breadcrumb separator="/">
				<uni-breadcrumb-item v-for="(route,index) in routes" :key="index" :to="route.to">
					{{route.name}}
				</uni-breadcrumb-item>
			</uni-breadcrumb>
		</view> -->
		<uni-list v-for="(item, index) in items">
			<uni-list-item badgeText="done" :style="{'background-color': item.color}" :title="item.displayTitle" :note="item.detail" :rightText="item.serviceType.name" clickable  @click="onClick(item.id)" ></uni-list-item>
		</uni-list>
	</view>
</template>

<script>
	import {set, get} from '@/common/storage.js'
	export default {
		data() {
			return {
				items:[
				],
				routes: [
				],
				creatorId: 0
			}
		},
		onLoad(param) {
			this.loadServiceList(param)
			this.creatorId = param.creatorId
		},
		methods: {
			homePage() {
				uni.reLaunch({
					url: '/pages/index/index'
				})
			},
			onClick(id) {
				uni.navigateTo({
				  url: '/pages/service/detail?id=' + id
				})
			},
			addService() {
				uni.navigateTo({
					url: "/pages/service/addService?creatorId=" + this.creatorId
				})
			},
			loadServiceList(param) {
				let userInfo = get('loginInfo')
				var requestUrl = 'api/serviceList'
				if (userInfo?.role?.name === "student") {
					requestUrl += '?creatorId=' + get('loginInfo').id
				} else if (userInfo?.role?.name === "maintainer") {
					requestUrl += '?maintainerId=' + get('loginInfo').id
				}
				uni.request({
					// #ifdef H5
					url: requestUrl,
					// #endif
					// #ifdef MP-WEIXIN
					url: this.$api.defConfig.def().baseUrl + requestUrl,
					// #endif
					method: 'GET',
					success: (res) => {
						if (res.data.code === 200) {
							for(let i = 0; i < res.data.serviceDataList.length; i++) {
								if (res.data.serviceDataList[i].status === "FINISHED") {
									res.data.serviceDataList[i].color = '#B6FFA3'
								} else if (res.data.serviceDataList[i].status === "DONE") {
									res.data.serviceDataList[i].color = '#C7F0FE'
								} else if (res.data.serviceDataList[i].status === "HANDLING") {
									res.data.serviceDataList[i].color = '#FEDDC7'
								} else if (res.data.serviceDataList[i].status === "SUBMITTED") {
									res.data.serviceDataList[i].color = '#FBFEC7'
								}
								
								
							}
							this.items = res.data.serviceDataList
							console.log(this.items)
						}
					},
					fail: (res) => {
						
					}
				})
			}
		}
	}
</script>

<style>
	.center{text-align: center; vertical-align:middle;}
	.container { position: relative; } 
	.right-aligned-button { position: absolute; right: 0; }
	.left-aligned-button { position: absolute; left: 0; }
</style>
