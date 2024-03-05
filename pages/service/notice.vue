<template>
	
	<view>
		<view class="container">
			<uni-breadcrumb separator="/">
				<uni-breadcrumb-item v-for="(route,index) in routes" :key="index" :to="route.to">
					{{route.name}}
				</uni-breadcrumb-item>
			</uni-breadcrumb>
		</view>
		<view class="content">
			<view>
				<button class="container left-aligned-button uni-bg-blue1" @click="inputDialogToggle" style="background-color: #b88e22;font-size: 12px; color: white;">新增公告</button>
				<uni-title type="h4" title="信息列表" style="font-size: 12px"></uni-title>
			</view>
			<view class="uni-container">
				<uni-table ref="table" :loading="loading" border stripe emptyText="暂无更多数据">
					<uni-tr>
						<uni-th width="100" align="center">公告内容</uni-th>
						<uni-th width="150" align="center">创建时间</uni-th>
						<uni-th width="80" align="center">设置</uni-th>
					</uni-tr>
					<uni-tr v-for="(item, index) in tableData" :key="index">
						<uni-td>{{ item.displayCreateTime }}</uni-td>
						<uni-td>
							<view class="name">{{ item.displayText }}</view>
						</uni-td>
						<uni-td>
							<view class="uni-group">
								<button class="uni-button" size="mini" style="font-size: 8px" type="primary" @click="inputDialogToggle(item)">修改</button>
								<button class="uni-button" size="mini" style="font-size: 8px" type="warn" @click="deleteNotice(item)">删除</button>
							</view>
						</uni-td>
					</uni-tr>
				</uni-table>
				<uni-popup ref="inputDialog" type="dialog">
					<uni-popup-dialog ref="inputClose"  mode="input" title="公告信息" :value="dialogText"
						placeholder="请输入内容" @confirm="dialogInputConfirm">
					</uni-popup-dialog>
				</uni-popup>
				<!-- 提示信息弹窗 -->
				<uni-popup ref="message" type="message">
					<uni-popup-message :type="msgType" :message="messageText" :duration="2000"></uni-popup-message>
				</uni-popup>
				<uni-popup ref="alertDialog" type="dialog">
					<uni-popup-dialog :type="msgType" cancelText="关闭" confirmText="同意" title="删除" content="需要删除公告信息" @confirm="dialogConfirm"
						@close="dialogClose"></uni-popup-dialog>
				</uni-popup>
			</view>
		</view>
	</view>
	
</template>

<script>
	export default {
		data() {
			return {
				tableData: [],
				loading: false,
				selectedItem: null,
				dialogText: '',
				msgType: 'success',
				type: 'center',
				messageText: '成功提示',
				routes: [
					{
						to: "/pages/index/index",
						name: "首页",
					},
				]
			}
		},
		onLoad() {
			this.loadNoticeList()
		},
		methods: {
			inputDialogToggle(item) {
				this.selectedItem = item
				this.dialogText = item.text
				this.$refs.inputDialog.open()
			},
			deleteNotice(item) {
				this.selectedItem = item
				this.dialogText = item.text
				this.msgType = 'success'
				this.$refs.alertDialog.open()
			},
			dialogConfirm() {
				console.log('点击确认')
				this.messageText = `点击确认删除了一条公告信息`
				uni.request({
					// #ifdef H5
					url: 'api/notice/delete/' + this.selectedItem.id,
					// #endif
					// #ifdef MP-WEIXIN
					url: this.$api.defConfig.def().baseUrl + 'api/notice/delete/' + this.selectedItem.id,
					// #endif
					method: 'DELETE',
					success: (res) => {
						this.$refs.message.open()
						this.loadNoticeList()
					},
					fail: () => {
						
					}
				})
				this.selectedItem = null
				this.dialogText = ''
			},			
			dialogClose() {
				console.log('点击关闭')
			},
			dialogInputConfirm(val) {
				uni.showLoading({
					title: '更新公告'
				})
				uni.request({
					// #ifdef H5
					url: 'api/notice/update',
					// #endif
					// #ifdef MP-WEIXIN
					url: this.$api.defConfig.def().baseUrl + 'api/notice/update',
					// #endif
					// url: "api/notice/update",
					data: {
						text: val,
						id: this.selectedItem.id,
						createTime: this.selectedItem.createTime
					},
					method: "POST",
					success: (res) => {
						uni.hideLoading()
						console.log(val)
						this.value = val
						// 关闭窗口后，恢复默认内容
						this.$refs.inputDialog.close()
						this.loadNoticeList()
					}
				})
				this.selectedItem = null
				this.dialogText = ''
			},
			loadNoticeList() {
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
							this.tableData = res.data.noticeList
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
.content {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
.container { position: relative; } 
.left-aligned-button { position: absolute; left: 0; }
.uni-group {
	display: flex;
	align-items: center;
}
</style>
