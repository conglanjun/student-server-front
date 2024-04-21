<template>
	<view>
		<uni-nav-bar dark :fixed="true" shadow background-color="#007AFF" status-bar left-icon="left" left-text="返回" title="导航栏" @clickLeft="back" />
		<view>
			<!-- <button class="container right-aligned-button uni-bg-blue1" @click="addService" style="background-color: #b88e22;font-size: 12px; color: white;width: 80ps;">提交维修单</button> -->
			<!-- <uni-title type="h1" title="订单列表"></uni-title> -->
			<uni-row class="demo-uni-row">
				<uni-col :span="6">
					<uni-text>
						<span style="font-size: 14px; color: #606266;">维修状态:</span>
					</uni-text>
				</uni-col>
				<uni-col :span="6">
					<uni-data-select
						v-model="value"
						:localdata="statusList"
						@change="selectChange"
						style="width: 150px;"
					  ></uni-data-select>
				</uni-col>
			</uni-row>
		</view>
		<uni-list v-for="(item, index) in items">
			<uni-list-item badgeText="done" :title="item.displayTitle" :note="item.detail" :rightText="item.serviceType.name" clickable  @click="onClick(item.id)" ></uni-list-item>
		</uni-list>
	</view>
</template>

<script>
	import {set, get} from '@/common/storage.js'
	export default {
		data() {
			return {
				value: 0,
				items:[
				],
				creatorId: 0,
				statusList: [],
			}
		},
		onLoad(param) {
			this.statusList = [
				{
					"text": "待维修",
					"value": "NOTFIX",
					"num": 0
				},
				{
					"text": "已维修",
					"value": "FIXED",
					"num": 0
				}
			]
			// this.loadServiceList(param)
			let userInfo = get('loginInfo')
			var requestUrl = 'api/serviceList'
			if (userInfo?.role?.name === "student") {
				requestUrl += '?creatorId=' + get('loginInfo').id
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
						this.items = res.data.serviceDataList
						console.log(this.items)
					}
				}
			})
			this.creatorId = param.creatorId
		},
		methods: {
			onClick(id) {
				uni.redirectTo({
				  url: '/pages/service/detail?id=' + id
				})
			},
			addService() {
				uni.navigateTo({
					url: "/pages/service/addService?creatorId=" + this.creatorId
				})
			},
			selectChange(e) {
				console.log(e)
				this.loadServiceList(e)
			},
			loadServiceList(status) {
				let userInfo = get('loginInfo')
				var requestUrl = 'api/serviceList'
				if (userInfo?.role?.name === "student") {
					requestUrl += '?creatorId=' + get('loginInfo').id
				}
				if (typeof status !== 'undefined' && status !== null && status !== 'null' && status !== '') {
					requestUrl += '&fixStatus=' + status
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
							this.items = res.data.serviceDataList
							console.log(this.items)
						}
					}
				})
			},
			clickLeft() {
			},			
			back() {
				uni.switchTab({
					url: "/pages/index/index",
				})
			},
		}
	}
</script>

<style>
	.center{text-align: center; vertical-align:middle;}
	.container { position: relative; } 
	.right-aligned-button { position: absolute; right: 0; }
	.left-aligned-button { position: absolute; left: 0; }
	.demo-uni-row {
		margin-bottom: 10px;
		/* #ifdef MP-TOUTIAO || MP-QQ || MP-BAIDU */
		display: block;
		/* #endif */
	}
	.uni-select__selector{height: 200rpx;}
</style>
