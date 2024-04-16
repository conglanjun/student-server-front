<template>
	<view>
		<uni-nav-bar dark :fixed="true" shadow background-color="#007AFF" status-bar left-icon="left" left-text="返回" title="导航栏" @clickLeft="back" />
		<view class="container">
			<uni-breadcrumb separator="/">
				<uni-breadcrumb-item v-for="(route,index) in routes" :key="index" :to="route.to">
					{{route.name}}
				</uni-breadcrumb-item>
			</uni-breadcrumb>
		</view>
		<view class="uni-container">
			<uni-table ref="table" :loading="loading" border stripe emptyText="暂无更多数据">
				<uni-tr>
					<uni-th width="70" align="center">姓名</uni-th>
					<uni-th width="70" align="center">电话</uni-th>
					<uni-th width="70" align="center">权限</uni-th>
					<uni-th width="70" align="center">宿舍</uni-th>
					<uni-th width="70" align="center">设置</uni-th>
				</uni-tr>
				<uni-tr v-for="(item, index) in tableData" :key="index">
					<uni-td>{{ item.name }}</uni-td>
					<uni-td>{{ item.phone }}</uni-td>
					<uni-td>{{ item.role.displayName }}</uni-td>
					<uni-td>{{ item.displayRoomInfo }}</uni-td>
					<uni-td>
						<view class="uni-group">
							<button class="uni-button" size="mini" style="font-size: 8px" type="primary" @click="inputDialogToggle(item)">修改</button>
						</view>
					</uni-td>
				</uni-tr>
			</uni-table>
			<uni-popup ref="inputDialog" type="dialog">
				<view class="popConfig" >
					<uni-forms :modelValue="formData">
						<uni-forms-item label="姓名" name="name">
							<uni-easyinput class="uni-row" type="text" v-model="selectedItem.name" placeholder="请输入姓名" />
						</uni-forms-item>
						<uni-forms-item label="电话" name="phone">
							<uni-easyinput class="uni-row" type="text" v-model="selectedItem.phone" placeholder="请输入电话" />
						</uni-forms-item>
						<uni-forms-item label="权限修改" name="role">
							<uni-data-select
								v-model="selectedItem.role.id"
								:localdata="roleList"
								@change="selectRoleChange"
								style="width: 150px;"
							  ></uni-data-select>
						</uni-forms-item>
						<uni-forms-item label="分配宿舍楼" name="building">
							<uni-data-select
								v-model="selectedItem.room.buildingId"
								:localdata="buildingList"
								@change="selectBuildingChange"
								style="width: 150px;"
							  ></uni-data-select>
						</uni-forms-item>
						<uni-forms-item label="分配寝室" name="building">
							<uni-data-select
								v-model="selectedItem.room.id"
								:localdata="roomList"
								@change="selectRoomChange"
								style="width: 150px;"
							  ></uni-data-select>
						</uni-forms-item>
					</uni-forms>
					<view>
						<uni-row class="demo-uni-row">
							<uni-col :span="12">
								<button class="container left-aligned-button uni-bg-blue1" @click="addDialogClose" style="background-color: #b88e22;font-size: 12px; color: white; margin: 10px 10px;">关闭</button>
							</uni-col>
							<uni-col :span="12">
								<button  class="container left-aligned-button uni-bg-blue1" @click="dialogInputConfirm(selectedItem.id)" style="background-color: #b88e22;font-size: 12px; color: white; margin: 10px 10px;">确认</button>
							</uni-col>
						</uni-row>
					</view>
				</view>
			</uni-popup>
			<!-- <uni-popup ref="inputDialog" type="dialog">
				<uni-popup-dialog ref="inputClose"  mode="base" title="权限修改" :value="dialogText" @confirm="dialogInputConfirm">
					<uni-data-select
						v-model="value"
						:localdata="roleList"
						@change="selectChange"
						style="width: 150px;"
					  ></uni-data-select>
				</uni-popup-dialog>
			</uni-popup> -->
			<!-- 提示信息弹窗 -->
			<uni-popup ref="message" type="message">
				<uni-popup-message :type="msgType" :message="messageText" :duration="2000"></uni-popup-message>
			</uni-popup>
			<uni-popup ref="alertDialog" type="dialog">
				<uni-popup-dialog :type="msgType" cancelText="关闭" confirmText="同意" title="删除" content="需要修改权限" @confirm="dialogConfirm"
					@close="dialogClose"></uni-popup-dialog>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				value: 0,
				selectedItem: {
					name: '',
					phone: '',
					roleId: '',
					buildingId: '',
					roomId: '',
					role:{},
					room:{}
				},
				tableData: [],
				loading: false,
				roleList: [],
				buildingList:[],
				roomList:[],
				dialogText: '',
				msgType: 'success',
				type: 'center',
				messageText: '成功提示',
				formData:{},
				buildingId: '',
				roomId: '',
			}
		},
		onLoad() {
			this.listUser()
		},
		methods: {
			loadBuildingList() {
				uni.request({
					// #ifdef H5
					url: 'api/buildingList',
					// #endif
					// #ifdef MP-WEIXIN
					url: this.$api.defConfig.def().baseUrl + 'api/buildingList',
					// #endif
					method: 'GET',
					success: (res) => {
						if (res.data.code === 200) {
							if (res.data.buildingDataList) {
								for (let i = 0; i < res.data.buildingDataList.length; i++) {
									res.data.buildingDataList[i].text = res.data.buildingDataList[i].name
									res.data.buildingDataList[i].value = res.data.buildingDataList[i].id
								}
							}
							this.buildingList = res.data.buildingDataList
						}
					}
				})
			},
			loadRoomList() {
				if (this.buildingId === 'undefined' || this.buildingId === null || this.buildingId === 'null') {
					return
				}
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
							if (res.data.roomDataList) {
								for (let i = 0; i < res.data.roomDataList.length; i++) {
									res.data.roomDataList[i].text = res.data.roomDataList[i].name
									res.data.roomDataList[i].value = res.data.roomDataList[i].id
								}
							}
							this.roomList = res.data.roomDataList
							console.log(this.roomList)
						}
					}
				})
			},
			listUser() {
				// list user
				uni.request({
					// #ifdef H5
					url: "api/userList",
					// #endif
					// #ifdef MP-WEIXIN
					url: this.$api.defConfig.def().baseUrl + 'api/userList',
					// #endif
					success: (res) => {
						this.tableData = res.data.userDataList
					}
				})	
			},
			selectRoleChange(e) {
				console.log(e)
			},
			selectBuildingChange(e) {
				console.log(e)
				this.buildingId = e
				this.selectedItem.buildingId = e
				this.loadRoomList()
			},
			selectRoomChange(e) {
				console.log(e)
				this.roomId = e
				this.selectedItem.roomId = e
			},
			inputDialogToggle(item) {
				console.log(item)
				this.selectedItem = item
				this.value = item.role?.Id
				// list role
				uni.request({
					// #ifdef H5
					url: 'api/roleList',
					// #endif
					// #ifdef MP-WEIXIN
					url: this.$api.defConfig.def().baseUrl + 'api/roleList',
					// #endif
					method: 'GET',
					success: (res) => {
						if (res.data.code === 200) {
							if (res.data.roleList) {
								for (let i = 0; i < res.data.roleList.length; i++) {
									res.data.roleList[i].text = res.data.roleList[i].displayName
									res.data.roleList[i].value = res.data.roleList[i].id
								}
							}
							this.roleList = res.data.roleList
						}
					}
				})
				this.loadBuildingList()
				this.buildingId = item.room.buildingId
				this.loadRoomList()
				this.dialogText = item.text
				this.$refs.inputDialog.open()
			},
			dialogConfirm() {
				console.log('点击确认')
			},	
			dialogClose() {
				console.log('点击关闭')
			},
			addDialogClose() {
				this.$refs.inputDialog.close()
			},
			dialogInputConfirm() {
				uni.request({
					// #ifdef H5
					url: 'api/user/update',
					// #endif
					// #ifdef MP-WEIXIN
					url: this.$api.defConfig.def().baseUrl + 'api/user/update',
					// #endif
					data: {
						id: this.selectedItem.id,
						name: this.selectedItem.name,
						phone: this.selectedItem.phone,
						roleId: this.selectedItem.role.id,
						roomId: this.selectedItem.room.id
					},
					method: "POST",
					success: (res) => {
						uni.hideLoading()
						// 关闭窗口后，恢复默认内容
						this.$refs.inputDialog.close()
						this.listUser()
					}
				})
				this.selectedItem = {
					name: '',
					phone: '',
					roleId: '',
					buildingId: '',
					roomId: '',
					role:{},
					room:{}
				},
				this.dialogText = ''
				this.value = 0
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
</style>
