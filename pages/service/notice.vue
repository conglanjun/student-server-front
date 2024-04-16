<template>
	<view>
		<uni-nav-bar dark :fixed="true" shadow background-color="#007AFF" status-bar left-icon="left" left-text="返回" title="导航栏" @clickLeft="back" />
		<view class="content">
			<view>
				<button class="container right-aligned-button uni-bg-blue1" @click="inputDialogToggle" style="background-color: #b88e22;font-size: 12px; color: white;">新增公告</button>
				<uni-title type="h4" title="信息列表" style="font-size: 12px"></uni-title>
			</view>
			<view class="uni-container">
				<uni-table ref="table" :loading="loading" border stripe emptyText="暂无更多数据">
					<!-- #ifdef H5 -->
					<uni-tr>
						<uni-th align="center">创建时间</uni-th>
						<uni-th align="center">公告内容</uni-th>
						<uni-th align="center">图片内容</uni-th>
						<uni-th align="center">设置</uni-th>
					</uni-tr>
					<!-- #endif -->
					<!-- #ifdef MP-WEIXIN -->
					<uni-tr>
						<uni-th width="80" align="center">创建时间</uni-th>
						<uni-th width="80" align="center">公告内容</uni-th>
						<uni-th width="80" align="center">图片内容</uni-th>
						<uni-th width="80" align="center">设置</uni-th>
					</uni-tr>
					<!-- #endif -->
					<uni-tr v-for="(item, index) in tableData" :key="index">
						<uni-td>{{ item.displayCreateTime }}</uni-td>
						<uni-td>
							<view class="name">{{ item.displayText }}</view>
						</uni-td>
						<uni-td>
							<view>
								<image style="max-width: 70px; max-height: 70px;" :src="item.imageAddress" mode="aspectFit"></image>
							</view>
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
					<view class="popConfig" >
						<uni-forms>
							<uni-forms-item label="公告信息" name="dialogText">
								<uni-easyinput class="uni-row" type="text" v-model="dialogText" placeholder="请输入内容" />
							</uni-forms-item>
							<uni-forms-item label="公共图片" name="imageAddress">
								<view>
									<image style="max-width: 70px; max-height: 70px;" :src="imageAddress" mode="aspectFit"></image>
								</view>
							</uni-forms-item>
							<view>
								<button  class="container uni-bg-blue1" @click="uploadImage" style="background-color: #61CD00;font-size: 8px; color: white; margin: 10px 10px;">上传图片</button>
							</view>
						</uni-forms>
	<!-- 					<uni-popup-dialog ref="inputClose"  mode="input" title="公告信息" :value="dialogText"
							placeholder="请输入内容" @confirm="dialogInputConfirm">
						</uni-popup-dialog> -->
						<view>
							<uni-row class="demo-uni-row">
								<uni-col :span="12">
									<button class="container uni-bg-blue1" @click="addDialogClose" style="background-color: #4ba5f6;font-size: 8px; color: white; margin: 10px 10px;">关闭</button>
								</uni-col>
								<uni-col :span="12">
									<button  class="container uni-bg-blue1" @click="dialogInputConfirm" style="background-color: #b88e22;font-size: 8px; color: white; margin: 10px 10px;">确认</button>
								</uni-col>
							</uni-row>
						</view>
					</view>
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
				imageAddress: '',
			}
		},
		onLoad() {
			this.loadNoticeList()
		},
		methods: {
			uploadImage() {
				uni.chooseImage({
					success: (chooseImageRes) => {
						const tempFilePaths = chooseImageRes.tempFilePaths;
						uni.uploadFile({
							// #ifdef H5
							url: 'api/fileUpload',
							// #endif
							// #ifdef MP-WEIXIN
							url: this.$api.defConfig.def().baseUrl + 'api/fileUpload',
							// #endif
							filePath: tempFilePaths[0],
							name: 'file',
							formData: {
								'user': 'test'
							},
							success: (uploadFileRes) => {
								this.imageAddress = uploadFileRes.data;
								this.selectedItem.imageAddress = this.imageAddress;
								uni.showToast({
								  title: '上传成功',
								  icon: 'none'
								})
							}
						})
					}
				})
			},
			inputDialogToggle(item) {
				this.selectedItem = item
				this.dialogText = item.text
				this.imageAddress = item.imageAddress
				this.$refs.inputDialog.open()
			},
			deleteNotice(item) {
				this.selectedItem = item
				this.dialogText = item.text
				this.imageAddress = item.imageAddress
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
				this.imageAddress = ''
			},			
			addDialogClose() {
				this.$refs.inputDialog.close()
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
						text: this.dialogText,
						id: this.selectedItem.id,
						createTime: this.selectedItem.createTime,
						imageAddress: this.selectedItem.imageAddress
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
				this.imageAddress = ''
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
.popConfig {
		z-index: 999;
		background-color: white;
		box-sizing: border-box;
		padding: 25rpx;
		width: 60vw;
		min-height: 300rpx;
		border-radius: 15rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
}
.content {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
.container { position: relative; } 
.left-aligned-button { position: absolute; left: 0; }
.right-aligned-button { position: absolute; right: 0; }
.uni-group {
	display: flex;
	align-items: center;
}	
.demo-uni-row {
	margin-bottom: 10px;
	/* #ifdef MP-TOUTIAO || MP-QQ || MP-BAIDU */
	display: block;
	/* #endif */
}
</style>
