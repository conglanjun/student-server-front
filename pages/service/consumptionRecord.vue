<template>
	<view>
		<uni-nav-bar dark :fixed="true" shadow background-color="#007AFF" status-bar left-icon="left" left-text="返回" title="导航栏" @clickLeft="back" />
		<view class="content">
			<view>
				<uni-title type="h4" title="耗材记录列表" style="font-size: 12px"></uni-title>
			</view>
			<view class="uni-container">
				<uni-table ref="table" :loading="loading" border stripe emptyText="暂无更多数据">
					<uni-tr>
						<uni-th width="100" align="center">耗材</uni-th>
						<uni-th width="100" align="center">消耗</uni-th>
						<uni-th width="120" align="center">申请人</uni-th>
						<uni-th width="120" align="center">创建时间</uni-th>
					</uni-tr>
					<uni-tr v-for="(item, index) in tableData" :key="index">
						<uni-td>{{ item.consumption.type }}</uni-td>
						<uni-td>
							<view class="name">{{ item.consumptionNumber }}</view>
						</uni-td>
						<uni-td>{{ item.creator.name }}</uni-td>
						<uni-td>
							{{item.displayCreateTime}}
						</uni-td>
					</uni-tr>
				</uni-table>
			</view>
		</view>
	</view>
</template>

<script>
	import {set, get} from '@/common/storage.js'
	export default {
		data() {
			return {
				loading: false,
				tableData: []
			}
		},
		onLoad() {
			this.loadConsumptionRecordList()
		},
		methods: {
			loadConsumptionRecordList() {
				uni.request({
					// #ifdef H5
					url: 'api/consumptionRecordList',
					// #endif
					// #ifdef MP-WEIXIN
					url: this.$api.defConfig.def().baseUrl + 'api/consumptionRecordList',
					// #endif
					method: 'GET',
					success: (res) => {
						if (res.data.code === 200) {
							this.tableData = res.data.consumptionRecordDataList
							console.log(res.data)
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
@import '../../common/uni.css';
</style>
