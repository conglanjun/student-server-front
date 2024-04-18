<template>
	<view>
		<uni-nav-bar dark :fixed="true" shadow background-color="#007AFF" status-bar left-icon="left" left-text="返回" title="导航栏" @clickLeft="back" />
		<uni-row class="demo-uni-row">
			<uni-col :span="6">
				<uni-text>
					<span style="font-size: 14px; color: #606266;">分配状态:</span>
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
		<uni-list v-for="(item, index) in items">
			<uni-list-item badgeText="done" :title="item.displayTitle" :note="item.detail" :rightText="item.serviceType.name" clickable  @click="onClick(item.id)" ></uni-list-item>
		</uni-list>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				value: 0,
				items:[
				],
				statusList: [],
			}
		},
		onLoad(param) {
			this.statusList = [
				{
					"text": "待分配",
					"value": "PENDINGDISPATCH"
				},
				{
					"text": "已分配",
					"value": "DISPATCHED"
				}
			]
			this.loadServiceList(null)
		},
		methods: {
			loadServiceList(dispatchStatus) {
				var requestUrl = 'api/serviceList'
				if (typeof dispatchStatus !== 'undefined' && dispatchStatus !== null && dispatchStatus !== 'null' && dispatchStatus !== '') {
					requestUrl += '?dispatchStatus=' + dispatchStatus
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
			onClick(id) {
				uni.redirectTo({
				  url: '/pages/service/detail?id=' + id + '&type=dispatch'
				})
			},
			selectChange(e) {
				console.log(e)
				this.loadServiceList(e)
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

</style>
