<template>
	<view>
		<uni-nav-bar dark :fixed="true" shadow background-color="#007AFF" status-bar left-icon="left" left-text="返回" title="导航栏" @clickLeft="back" />
<!-- 		<uni-row class="demo-uni-row">
			<uni-col :span="6">
				<uni-text>
					<span style="font-size: 14px; color: #606266;">完成状态:</span>
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
		</uni-row> -->
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
				statusList: [],
			}
		},
		onLoad(param) {
			// this.statusList = [
			// 	{
			// 		"text": "未完成",
			// 		"value": "NOTFINISHED"
			// 	},
			// 	{
			// 		"text": "已完成",
			// 		"value": "FINISHED"
			// 	}
			// ]
			this.loadServiceList('FINISHED')
		},
		methods: {
			loadServiceList(commentStatus) {
				var requestUrl = 'api/serviceList'
				requestUrl += '?maintainerId=' + get('loginInfo').id
				if (typeof commentStatus !== 'undefined' && commentStatus !== null && commentStatus !== 'null' && commentStatus !== '') {
					requestUrl += '&commentStatus=' + commentStatus
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
				  url: '/pages/service/detail?id=' + id + '&type=myDispatch'
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
