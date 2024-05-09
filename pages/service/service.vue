<template>
	<view>
		<uni-nav-bar dark :fixed="true" shadow background-color="#007AFF" status-bar left-icon="left" left-text="返回" title="导航栏" @clickLeft="back" />
		<view v-show="showTypeStatistics">
			<uni-row class="demo-uni-row">
				<uni-col :span="6">
					<button class="container uni-bg-blue1" @click="serviceType" style="background-color: #b88e22;font-size: 12px; color: white;width: 80ps;">类型统计</button>
				</uni-col>
			</uni-row>
		</view>
		<view>
			<!-- <button class="container right-aligned-button uni-bg-blue1" @click="addService" style="background-color: #b88e22;font-size: 12px; color: white;width: 80ps;">提交维修单</button> -->
			
			<uni-row class="demo-uni-row">
				<uni-col :span="6">
					<uni-text>
						<span style="font-size: 14px; color: #606266;">已提交: {{submittedNum}}</span>
					</uni-text>
				</uni-col>
				<uni-col :span="6">
					<uni-text>
						<span style="font-size: 14px; color: #606266;">待接单: {{pendingOrderNum}}</span>
					</uni-text>
				</uni-col>
				<uni-col :span="6">
					<uni-text>
						<span style="font-size: 14px; color: #606266;">已接单: {{receivedOrderNum}}</span>
					</uni-text>
				</uni-col>
				<uni-col :span="6">
					<uni-text>
						<span style="font-size: 14px; color: #606266;">拒绝接单: {{rejectOrderNum}}</span>
					</uni-text>
				</uni-col>
				<uni-col :span="6">
					<uni-text>
						<span style="font-size: 14px; color: #606266;">维修中: {{handlingNum}}</span>
					</uni-text>
				</uni-col>
				<uni-col :span="6">
					<uni-text>
						<span style="font-size: 14px; color: #606266;">已完成: {{doneNum}}</span>
					</uni-text>
				</uni-col>
				<uni-col :span="6">
					<uni-text>
						<span style="font-size: 14px; color: #606266;">评价完: {{finishedNum}}</span>
					</uni-text>
				</uni-col>
			</uni-row>
			<!-- <uni-title type="h1" title="订单列表"></uni-title> -->
			<uni-row class="demo-uni-row">
				<uni-col :span="6">
					<uni-text>
						<span style="font-size: 14px; color: #606266;">订单状态:</span>
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
				submittedNum: 0,
				pendingOrderNum: 0,
				receivedOrderNum: 0,
				rejectOrderNum: 0,
				handlingNum: 0,
				doneNum: 0,
				finishedNum: 0,
				showTypeStatistics: false,
			}
		},
		onLoad(param) {
			let statusMap = new Map();
			this.statusList = [
				{
					"text": "已提交",
					"value": "SUBMITTED",
					"num": 0
				},
				{
					"text": "待接单",
					"value": "PENDINGORDER",
					"num": 0
				},
				{
					"text": "已接单",
					"value": "RECEIVEDORDER",
					"num": 0
				},
				{
					"text": "拒绝接单",
					"value": "REJECTORDER",
					"num": 0
				},
				{
					"text": "维修中",
					"value": "HANDLING",
					"num": 0
				},
				{
					"text": "已完成",
					"value": "DONE",
					"num": 0
				},
				{
					"text": "评价完",
					"value": "FINISHED",
					"num": 0
				},
			]
			// this.loadServiceList(param)
			let userInfo = get('loginInfo')
			var requestUrl = 'api/serviceList'
			if (userInfo?.role?.name === "student") {
				requestUrl += '?creatorId=' + get('loginInfo').id
			} else if (userInfo?.role?.name === "maintainer") {
				requestUrl += '?maintainerId=' + get('loginInfo').id
			} else if (userInfo?.role?.name === "dormitory-manager") {
				requestUrl += '?dormitoryManagerId=' + get('loginInfo').id
			} else if (userInfo?.role?.name === 'maintenance-manager' || userInfo?.role?.name === "admin") {
				this.showTypeStatistics = true
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
							let status = res.data.serviceDataList[i].status
							if (statusMap.has(status)) {
								let num = statusMap.get(status) + 1;
								statusMap.set(status, num);
							} else {
								statusMap.set(status, 1);
							}
							console.log(statusMap)
						}
						this.items = res.data.serviceDataList
						console.log(this.items)
						
						for (let i = 0; i < this.statusList.length; i++) {
							let status = this.statusList[i].value;
							console.log(status);
							let num = statusMap.get(status);
							if (status == 'SUBMITTED') {
								if (typeof num !== 'undefined' && num !== null && num !== 'null' && num !== '') {
									this.submittedNum = num;
								}
							} else if (status == 'PENDINGORDER') {
								if (typeof num !== 'undefined' && num !== null && num !== 'null' && num !== '') {
									this.pendingOrderNum = num;
								}
							} else if (status == 'RECEIVEDORDER') {
								if (typeof num !== 'undefined' && num !== null && num !== 'null' && num !== '') {
									this.receivedOrderNum = num;
								}
							} else if (status == 'REJECTORDER') {
								if (typeof num !== 'undefined' && num !== null && num !== 'null' && num !== '') {
									this.rejectOrderNum = num;
								}
							} else if (status == 'HANDLING') {
								if (typeof num !== 'undefined' && num !== null && num !== 'null' && num !== '') {
									this.handlingNum = num;
								}
							} else if (status == 'DONE') {
								if (typeof num !== 'undefined' && num !== null && num !== 'null' && num !== '') {
									this.doneNum = num;
								}
							} else if (status == 'FINISHED') {
								if (typeof num !== 'undefined' && num !== null && num !== 'null' && num !== '') {
									this.finishedNum = num;
								}
							}
							console.log(num);
							if (typeof num !== 'undefined' && num !== null && num !== 'null' && num !== '') {
								this.statusList[i].num = num;
							}
						}
						console.log(this.statusList)
					}
				}
			})
			this.creatorId = param.creatorId
		},
		methods: {
			homePage() {
				uni.reLaunch({
					url: '/pages/index/index'
				})
			},
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
				this.loadServiceList(this.creatorId, e)
			},
			loadServiceList(param, status) {
				let userInfo = get('loginInfo')
				var requestUrl = 'api/serviceList'
				if (userInfo?.role?.name === "student") {
					requestUrl += '?creatorId=' + get('loginInfo').id
				} else if (userInfo?.role?.name === "maintainer") {
					requestUrl += '?maintainerId=' + get('loginInfo').id
				} else if (userInfo?.role?.name === "dormitory-manager") {
					requestUrl += '?dormitoryManagerId=' + get('loginInfo').id
				}
				if (typeof status !== 'undefined' && status !== null && status !== 'null' && status !== '') {
					if (userInfo?.role?.name === "maintenance-manager"|| userInfo?.role?.name === "admin") {
						requestUrl += '?status=' + status
					} else {
						requestUrl += '&status=' + status
					}
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
			serviceType() {
				uni.navigateTo({
					url: "/pages/service/serviceTypeStatistics",
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
