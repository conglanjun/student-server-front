<template>
	<view class="content">
		<view>
			<button class="container left-aligned-button uni-bg-blue1" @click="inputDialogToggle('add')" style="background-color: #b88e22;font-size: 12px; color: white;">新增寝室</button>
			<uni-title type="h4" title="寝室列表" style="font-size: 12px"></uni-title>
		</view>
		<view class="uni-container">
			<uni-table ref="table" :loading="loading" border stripe emptyText="暂无更多数据">
				<uni-tr>
					<uni-th width="100" align="center">寝室</uni-th>
					<uni-th width="100" align="center">详情</uni-th>
					<uni-th width="120" align="center">操作</uni-th>
				</uni-tr>
				<uni-tr v-for="(item, index) in tableData" :key="index">
					<uni-td>{{ item.name }}</uni-td>
					<uni-td>
						<view class="name">{{ item.displayDescription }}</view>
					</uni-td>
					<uni-td>
						<view class="uni-group">
							<button class="uni-button" size="mini" style="font-size: 8px; background-color: #61CD00;" v-show="showManage" @click="inputDialogToggle('update', item)">更新</button>
							<button class="uni-button" size="mini" style="font-size: 8px" type="warn" v-show="showManage" @click="deleteRoom(item)">删除</button>
						</view>
					</uni-td>
				</uni-tr>
			</uni-table>
			<uni-popup ref="addDialog" type="dialog">
				<view class="popConfig" >
					<uni-forms :modelValue="formData">
						<uni-forms-item label="寝室" name="name">
							<uni-easyinput class="uni-row" type="text" v-model="formData.name" placeholder="请输入寝室房号" />
						</uni-forms-item>
						<uni-forms-item label="寝室详情" name="description">
							<uni-easyinput type="textarea" v-model="formData.description" placeholder="请输入寝室详情" />
						</uni-forms-item>
					</uni-forms>
					<view>
						<uni-row class="demo-uni-row">
							<uni-col :span="12">
								<button class="container left-aligned-button uni-bg-blue1" @click="addDialogClose" style="background-color: #b88e22;font-size: 12px; color: white; margin: 10px 10px;">关闭</button>
							</uni-col>
							<uni-col :span="12">
								<button  class="container left-aligned-button uni-bg-blue1" @click="addDialogConfirm(formData.id)" style="background-color: #b88e22;font-size: 12px; color: white; margin: 10px 10px;">确认</button>
							</uni-col>
						</uni-row>
					</view>
				</view>
			</uni-popup>
			<uni-popup ref="alertDialog" type="dialog">
				<uni-popup-dialog :type="msgType" cancelText="关闭" confirmText="同意" title="删除" content="需要删除寝室信息吗" @confirm="deleteDialogConfirm"
					@close="deleteDialogClose"></uni-popup-dialog>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	import {set, get} from '@/common/storage.js'
	export default {
		data() {
			return {
				dialogText:'',
				formData: {
					
				},
				item: {
					
				},
				selectedItem: {},
				tableData:[],
				loading: false,
				showManage: false,
				msgType: 'success',
				buildingId: ''
			}
		},		
		onLoad(param) {
			this.buildingId = param.buildingId
			var loginInfo = get('loginInfo')
			if (loginInfo?.role?.name === "admin" || loginInfo?.role?.name === "dormitory-manager") {
				this.showManage = true
			} else {
				this.showManage = false
			}
			this.loadRoomList()
		},
		methods: {
			inputDialogToggle(type, item) {
				if (type === 'add') {
					this.$refs.addDialog.open()
				} else if (type === 'consumption') {
					this.selectedItem = item
					this.dialogText = item.text
					this.$refs.inputDialog.open()
				} else if (type === 'update') {
					this.formData = item
					this.$refs.addDialog.open()
				}
			},
			deleteRoom(item) {
				this.selectedItem = item
				this.dialogText = item.text
				this.msgType = 'success'
				this.$refs.alertDialog.open()
			},
			addDialogClose() {
				this.$refs.addDialog.close()
			},
			deleteDialogClose() {
				this.$refs.alertDialog.close()
			},
			loadRoomList() {
				uni.request({
					// #ifdef H5
					url: 'api/roomList?buildingId=' + this.buildingId,
					// #endif
					// #ifdef MP-WEIXIN
					url: this.$api.defConfig.def().baseUrl + 'api/roomList?buildingId=' + this.buildingId,
					// #endif
					method: 'GET',
					success: (res) => {
						if (res.data.code === 200) {
							this.tableData = res.data.roomDataList
							console.log(this.tableData)
						}
					}
				})
			},
			addDialogConfirm(id) {
				console.log('id:' + id)
				if (typeof id=== "undefined") {
					uni.showToast({
						title: '新增宿舍'
					})
				} else {
					uni.showToast({
						title: '更新宿舍'
					})
				}
				uni.request({
					// #ifdef H5
					url: 'api/room/save',
					// #endif
					// #ifdef MP-WEIXIN
					url: this.$api.defConfig.def().baseUrl + 'api/room/save',
					// #endif
					method: 'POST',
					data: {
						id: id,
						name: this.formData.name,
						description: this.formData.description,
						buildingId: this.buildingId
					},
					method: "POST",
					success: (res) => {
						uni.hideLoading()
						console.log(res)
						// 关闭窗口后，恢复默认内容
						this.$refs.addDialog.close()
						this.loadRoomList()
						this.selectedItem = {}
						this.formData = {}
					}
				})
				this.selectedItem = null
				this.dialogText = ''
			},
			deleteDialogConfirm() {
				uni.request({
					// #ifdef H5
					url: 'api/room/delete/' + this.selectedItem.id,
					// #endif
					// #ifdef MP-WEIXIN
					url: this.$api.defConfig.def().baseUrl + 'api/room/delete/' + this.selectedItem.id,
					// #endif
					method: 'DELETE',
					success: (res) => {
						uni.hideLoading()
						console.log(res)
						// 关闭窗口后，恢复默认内容
						this.$refs.alertDialog.close()
						this.loadRoomList()
						this.selectedItem = {}
						this.formData = {}
					}
				})
			}
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
</style>
