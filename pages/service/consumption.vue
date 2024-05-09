<template>
	<view>
		<uni-nav-bar dark :fixed="true" shadow background-color="#007AFF" status-bar left-icon="left" left-text="返回" title="导航栏" @clickLeft="back" />
		<view class="content">
			<view>
				<button class="container right-aligned-button uni-bg-blue1" v-show="showManage" @click="inputDialogToggle('add')" style="background-color: #b88e22;font-size: 12px; color: white;">新增耗材</button>
				<uni-title type="h4" title="耗材列表" style="font-size: 12px"></uni-title>
			</view>
			<view class="uni-container">
				<uni-table ref="table" :loading="loading" border stripe emptyText="暂无更多数据">
					<uni-tr>
						<uni-th width="100" align="center">耗材</uni-th>
						<uni-th width="100" align="center">库存</uni-th>
						<uni-th width="120" align="center">操作</uni-th>
					</uni-tr>
					<uni-tr v-for="(item, index) in tableData" :key="index">
						<uni-td>{{ item.type }}</uni-td>
						<uni-td>
							<view class="name">{{ item.inventory }}</view>
						</uni-td>
						<uni-td>
							<view class="uni-group">
								<button class="uni-button" size="mini" style="font-size: 8px" type="primary" @click="inputDialogToggle('consumption', item)">使用</button>
								<button class="uni-button" size="mini" style="font-size: 8px; background-color: #61CD00;" v-show="showManage" @click="inputDialogToggle('update', item)">更新</button>
								<button class="uni-button" size="mini" style="font-size: 8px" type="warn" v-show="showManage" @click="deleteConsumption(item)">删除</button>
							</view>
						</uni-td>
					</uni-tr>
				</uni-table>
				<uni-popup ref="addDialog" type="dialog">
					<view class="popConfig" >
						<uni-forms :modelValue="formData">
							<uni-forms-item label="耗材" name="type">
								<uni-easyinput class="uni-row" type="text" v-model="formData.type" placeholder="请输入耗材类别" />
							</uni-forms-item>
							<uni-forms-item label="库存" name="inventory">
								<uni-number-box v-model="formData.inventory" ></uni-number-box>
							</uni-forms-item>
						</uni-forms>
						<view>
							<uni-row class="demo-uni-row">
								<uni-col :span="12">
									<button class="container uni-bg-blue1" @click="addDialogClose" style="background-color: #b88e22;font-size: 12px; color: white; margin: 10px 10px;">关闭</button>
								</uni-col>
								<uni-col :span="12">
									<button  class="container uni-bg-blue1" @click="addDialogConfirm(formData.id)" style="background-color: #b88e22;font-size: 12px; color: white; margin: 10px 10px;">确认</button>
								</uni-col>
							</uni-row>
						</view>
					</view>
				</uni-popup>
				<uni-popup ref="inputDialog" type="dialog">
					<uni-popup-dialog ref="inputClose"  mode="base" title="使用耗材数量" :value="dialogText" @close="consumptionDialogClose" @confirm="dialogInputConfirm">
						<uni-number-box v-model="consumptionNum" ></uni-number-box>
					</uni-popup-dialog>
				</uni-popup>
				<uni-popup ref="alertDialog" type="dialog">
					<uni-popup-dialog :type="msgType" cancelText="关闭" confirmText="同意" title="删除" content="需要删除耗材吗" @confirm="deleteDialogConfirm"
						@close="deleteDialogClose"></uni-popup-dialog>
				</uni-popup>
			</view>
		</view>
	</view>
</template>

<script>
	import {set, get} from '@/common/storage.js'
	export default {
		data() {
			return {
				dialogText:'',
				type: '',
				formData: {
					
				},
				item: {
					
				},
				consumptionNum: '',
				selectedItem: {},
				tableData:[],
				loading: false,
				showManage: false,
				msgType: 'success',
				loginInfo: {}
			}
		},
		onLoad() {
			var loginInfo = get('loginInfo')
			this.loginInfo = loginInfo
			if (loginInfo?.role?.name === "admin" || loginInfo?.role?.name === "maintenance-manager") {
				this.showManage = true
			} else {
				this.showManage = false
			}
			this.loadConsumptionList()
		},
		methods: {
			inputDialogToggle(type, item) {
				if (type === 'add') {
					this.$refs.addDialog.open()
				} else if (type === 'consumption') {
					this.selectedItem = item
					this.dialogText = item.text
					this.type = 'consumption'
					this.$refs.inputDialog.open()
				} else if (type === 'update') {
					this.formData = item
					this.type = 'update'
					this.$refs.addDialog.open()
				}
			},
			deleteConsumption(item) {
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
			consumptionDialogClose() {
				this.$refs.inputDialog.close()
			},
			addDialogConfirm(id) {
				console.log('id:' + id)
				if (typeof id=== "undefined") {
					uni.showToast({
						title: '新增耗材'
					})
				} else {
					uni.showToast({
						title: '更新耗材'
					})
				}
				uni.request({
					// #ifdef H5
					url: 'api/consumption/save',
					// #endif
					// #ifdef MP-WEIXIN
					url: this.$api.defConfig.def().baseUrl + 'api/consumption/save',
					// #endif
					method: 'POST',
					data: {
						id: id,
						inventory: this.formData.inventory,
						type: this.formData.type
					},
					method: "POST",
					success: (res) => {
						uni.hideLoading()
						console.log(res)
						// 关闭窗口后，恢复默认内容
						this.$refs.addDialog.close()
						this.loadConsumptionList()
						this.consumptionNum = 0
						this.selectedItem = {}
						this.formData = {}
					}
				})
				this.selectedItem = null
				this.dialogText = ''
			},
			loadConsumptionList() {
				uni.request({
					// #ifdef H5
					url: 'api/consumptionList',
					// #endif
					// #ifdef MP-WEIXIN
					url: this.$api.defConfig.def().baseUrl + 'api/consumptionList',
					// #endif
					method: 'GET',
					success: (res) => {
						if (res.data.code === 200) {
							this.tableData = res.data.consumptionDataList
						}
					}
				})
			},
			dialogInputConfirm() {
				if (this.consumptionNum > this.selectedItem.inventory) {
					uni.showToast({
						title: '使用耗材数量不能大于库存',
						icon: 'error'
					})
					return
				} else {
					uni.showToast({
						title: '使用耗材'
					})
				}
				uni.request({
					// #ifdef H5
					url: 'api/consumption/update',
					// #endif
					// #ifdef MP-WEIXIN
					url: this.$api.defConfig.def().baseUrl + 'api/consumption/update',
					// #endif
					method: 'POST',
					data: {
						consumptionNum: this.consumptionNum,
						id: this.selectedItem.id,
						inventory: this.selectedItem.inventory
					},
					method: "POST",
					success: (res) => {
						uni.hideLoading()
						console.log(res)
						// 关闭窗口后，恢复默认内容
						this.$refs.addDialog.close()
						this.loadConsumptionList()
						this.consumptionNum = 0
						this.selectedItem = {}
					}
				})
				uni.request({
					// #ifdef H5
					url: 'api/consumptionRecord/update',
					// #endif
					// #ifdef MP-WEIXIN
					url: this.$api.defConfig.def().baseUrl + 'api/consumptionRecord/update',
					// #endif
					method: 'POST',
					data: {
						consumptionNumber: this.consumptionNum,
						consumptionId: this.selectedItem.id,
						creatorId: this.loginInfo.id
					},
					method: "POST",
					success: (res) => {
						console.log('update consumption record successfully!' + res)
					}
				})
			},
			deleteDialogConfirm() {
				uni.request({
					// #ifdef H5
					url: 'api/consumption/delete/' + this.selectedItem.id,
					// #endif
					// #ifdef MP-WEIXIN
					url: this.$api.defConfig.def().baseUrl + 'api/consumption/delete/' + this.selectedItem.id,
					// #endif
					method: 'DELETE',
					success: (res) => {
						uni.hideLoading()
						console.log(res)
						// 关闭窗口后，恢复默认内容
						this.$refs.alertDialog.close()
						this.loadConsumptionList()
						this.selectedItem = {}
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

.right-aligned-button { position: absolute; right: 0; }
.left-aligned-button { position: absolute; left: 0; }
</style>
