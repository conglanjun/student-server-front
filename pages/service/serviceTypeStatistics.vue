
<template>
	<view>
		<uni-nav-bar dark :fixed="true" shadow background-color="#007AFF" status-bar left-icon="left" left-text="返回" title="导航栏" @clickLeft="back" />
		<view class="charts-box" style="height: 300px; width: 100%;">
		  <qiun-data-charts
		    type="pie"
		    :chartData="chartData"
		    :echartsH5="true"
		    :echartsApp="true"
		    background="none"
			:eopts="{legend:{show:false}}"
		  />
		</view>
		
	</view>
</template>
<script>
	export default {
	    data() {
	        return {
	            chartData: {
					"series": [
						{
							"data": [
								// {
								// 	"name": "一班",
								// 	"value": 50
								// },
								// {
								// 	"name": "二班",
								// 	"value": 30
								// },
								// {
								// 	"name": "三班",
								// 	"value": 20
								// },
								// {
								// 	"name": "四班",
								// 	"value": 18
								// },
								// {
								// 	"name": "五班",
								// 	"value": 8
								// }
							]
						}
					]
				},
	        }
	    },
		onLoad() {
			this.loadData()
		},
	    methods: {
	        loadData() {
				uni.request({
					// #ifdef H5
					url: 'api/service/typeStatistics',
					// #endif
					// #ifdef MP-WEIXIN
					url: this.$api.defConfig.def().baseUrl + 'api/service/typeStatistics',
					// #endif
					method: 'GET',
					success: (res) => {
						if (res.data.code === 200) {
							console.log(res.data.serviceTypeStatisticsData)
							this.chartData["series"] = []
							console.log(this.chartData["series"])
							this.chartData["series"][0] = (res.data.serviceTypeStatisticsData)
							console.log(this.chartData)
						}
					},
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
 
</style>