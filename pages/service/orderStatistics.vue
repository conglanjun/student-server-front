<template>
	<view>
		<uni-nav-bar dark :fixed="true" shadow background-color="#007AFF" status-bar left-icon="left" left-text="返回" title="导航栏" @clickLeft="back" />
		<view>
			<!-- <button class="container right-aligned-button uni-bg-blue1" @click="addService" style="background-color: #b88e22;font-size: 12px; color: white;width: 80ps;">提交维修单</button> -->
			
			<uni-row class="demo-uni-row">
				<uni-col :span="6" v-for="item in serviceStatistics">
					<uni-text>
						<span style="font-size: 14px; color: #606266;">{{item.name}}: {{item.num}}</span>
					</uni-text>
				</uni-col>
			</uni-row>
			<!-- <uni-title type="h1" title="订单列表"></uni-title> -->
			<uni-row class="demo-uni-row">
				<uni-col :span="6">
					<uni-text>
						<span style="font-size: 14px; color: #606266;">订单类型:</span>
					</uni-text>
				</uni-col>
				<uni-col :span="6">
					<uni-data-select
						v-model="value"
						:localdata="serviceTypeList"
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
				submittedNum: 0,
				pendingOrderNum: 0,
				receivedOrderNum: 0,
				rejectOrderNum: 0,
				handlingNum: 0,
				doneNum: 0,
				finishedNum: 0,
				serviceTypeList:[],
				serviceStatistics: [],
			}
		},
		onLoad(param) {
			this.listServiceType()
			
			// this.loadServiceList(param)
			let userInfo = get('loginInfo')
			var requestUrl = 'api/service/orderStatistics'
			if (userInfo?.role?.name === "maintainer") {
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
						console.log(res.data)
						for (var key in res.data.serviceCombination.statisticsNumByServiceType) {
							let item = {"name": key, "num": res.data.serviceCombination.statisticsNumByServiceType[key]}
							this.serviceStatistics.push(item)
						}
						
						this.items = res.data.serviceCombination.serviceDataList
					}
				}
			})
			this.creatorId = param.creatorId
		},
		methods: {
			listServiceType() {
				uni.request({
					// #ifdef H5
					url: 'api/serviceTypeList',
					// #endif
					// #ifdef MP-WEIXIN
					url: this.$api.defConfig.def().baseUrl + 'api/serviceTypeList',
					// #endif
					method: 'GET',
					success: (res) => {
						if (res.data.code === 200) {
							if (res.data.serviceTypeList) {
								for (let i = 0; i < res.data.serviceTypeList.length; i++) {
									res.data.serviceTypeList[i].text = res.data.serviceTypeList[i].name
									res.data.serviceTypeList[i].value = res.data.serviceTypeList[i].id
								}
							}
							this.serviceTypeList = res.data.serviceTypeList
						}
					},
					fail: (res) => {
						
					}
				})	
			},
			onClick(id) {
				uni.redirectTo({
				  url: '/pages/service/detail?id=' + id + '&type=myDispatch'
				})
			},
			selectChange(e) {
				console.log(e)
				this.loadServiceList(e)
			},
			loadServiceList(type) {
				let userInfo = get('loginInfo')
				var requestUrl = 'api/serviceList'
				if (userInfo?.role?.name === "maintainer") {
					requestUrl += '?maintainerId=' + get('loginInfo').id
				}
				if (typeof type !== 'undefined' && type !== null && type !== 'null' && type !== '') {
					requestUrl += '&serviceTypeId=' + type
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
					},
					fail: (res) => {
						
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
