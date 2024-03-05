<template>
	<view>
		<uni-forms :modelValue="formData">
			<uni-forms-item label="维修单标题" name="title" class="form">
				<uni-easyinput type="text" v-model="formData.title" placeholder="请输入订单标题" />
			</uni-forms-item>
			<uni-forms-item label="维修单详情" name="detail">
				<uni-easyinput type="textarea" v-model="formData.detail" placeholder="请输入订单详情" />
			</uni-forms-item>
			<uni-forms-item label="维修类别" name="title" class="form">
				<view class="demo-uni-col">
					<button style="position: absolute; left: 0px;font-size: 10px;background-color: #4ba5f6; width: 60px;" @click="updateServieType">更新</button>
					<button style="position: absolute; left: 60px;font-size: 10px;background-color: #83ff92; width: 60px;" @click="addServieType">新增</button>
					<button style="position: absolute; left: 120px;font-size: 10px;background-color: #ffb5b5; width: 60px;" @click="deleteServiceType">删除</button>
				</view>
				<uni-row class="demo-uni-row">
					<uni-col :span="12">
						<uni-data-select
							v-model="value"
							:localdata="serviceTypeList"
							@change="selectChange"
							style="width: 150px;"
						  ></uni-data-select>
					</uni-col>
					<uni-col :span="6">
					</uni-col>
				</uni-row>
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
			<uni-popup ref="inputDialog" type="dialog">
				<uni-popup-dialog ref="inputClose"  mode="base" title="新增类别" :value="dialogText" @close="dialogClose" @confirm="dialogInputConfirm">
					<uni-forms-item label="维修类别" name="title" class="form">
						<uni-easyinput type="text" v-model="serviceType.name" placeholder="请输入维修类别" />
					</uni-forms-item>
				</uni-popup-dialog>
			</uni-popup>
			
			<uni-popup ref="updateDialog" type="dialog">
				<uni-popup-dialog ref="inputClose"  mode="base" title="更新类别内容" :value="dialogText" @close="dialogClose" @confirm="dialogUpdateConfirm">
					<uni-forms-item label="维修类别内容" name="title" class="form">
						<uni-easyinput type="text" v-model="serviceType.name"/>
					</uni-forms-item>
				</uni-popup-dialog>
			</uni-popup>
			
			<uni-popup ref="deleteDialog" type="dialog">
				<uni-popup-dialog ref="inputClose"  mode="base" title="删除类别" :value="dialogText" @close="dialogClose" @confirm="dialogDeleteConfirm">
					<uni-forms-item label="是否确认删除类别" name="title" class="form">
					</uni-forms-item>
				</uni-popup-dialog>
			</uni-popup>
			
			<button @click="addItem">创建维修单</button>
		</uni-forms>
	</view>
</template>

<script>
	import {set, get} from '@/common/storage.js'
	export default {
		data() {
			return {
				value: 0,
				selectedItem: {
					name: '',
					buildingId: '',
					roomId: '',
					role:{},
					room:{}
				},
				formData: {
					title: '',
					detail: '',
					typeId: '',
					room:{}
				},
				serviceType: {
					id: '',
					name: ''
				},
				creatorId: 0,
				serviceTypeList:[],
				dialogText: '',
				msgType: 'success',
				type: 'center',
				messageText: '成功提示',
				buildingList:[],
				roomList:[]
			}
		},
		onLoad(param) {
			console.log(param)
			this.creatorId = param.creatorId
			this.listServiceType()
			this.loadBuildingList()
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
			listServiceType() {
				uni.request({
					// #ifdef H5
					url: 'api/serviceTypeList',
					// #endif
					// #ifdef MP-WEIXIN
					url: this.$api.defConfig.def().baseUrl + 'api/serviceTypeList',
					// #endif
					method: 'GET',
					success: (res) => {
						if (res.data.code === 200) {
							if (res.data.serviceTypeList) {
								for (let i = 0; i < res.data.serviceTypeList.length; i++) {
									res.data.serviceTypeList[i].text = res.data.serviceTypeList[i].name
									res.data.serviceTypeList[i].value = res.data.serviceTypeList[i].id
								}
							}
							this.serviceTypeList = res.data.serviceTypeList
						}
					},
					fail: (res) => {
						
					}
				})	
			},
			addItem() {
				if (typeof this.value === "undefined"  || this.value === '' || this.formData.title === '' || this.formData.detail === '') {
					uni.showToast({
					  title: '请填写完维修单内容再提交',
					  icon: 'error'
					})
					return
				}
				uni.request({
					// #ifdef H5
					url: 'api/service/save',
					// #endif
					// #ifdef MP-WEIXIN
					url: this.$api.defConfig.def().baseUrl + 'api/service/save',
					// #endif
					method: 'POST',
					data: {
					  typeId: this.value,
					  title: this.formData.title,
					  detail: this.formData.detail,
					  creatorId: get('loginInfo').id,
					  roomId: this.selectedItem.room.id
					},
					success: (res) => {
						uni.showToast({
						  title: '提交成功'
						})
						uni.reLaunch({
							url: '/pages/service/service'
						})
					},
				})
			},
			selectChange(e) {
				console.log(e)
				this.serviceType.id = this.value
			},
			addServieType() {
				this.serviceType.name = ''
				this.$refs.inputDialog.open()
			},
			updateServieType() {
				this.$refs.updateDialog.open()
				for (let i = 0; i < this.serviceTypeList.length; i++) {
					if (this.serviceTypeList[i].id === this.serviceType.id) {
						this.serviceType.name = this.serviceTypeList[i].name
					}
				} 
			},
			dialogInputConfirm() {
				console.log('点击确认 serviceType.name:' + this.serviceType.name)
				if (this.serviceType.name.trim() === '') {
					this.serviceType.name = ''
					uni.showToast({
					  title: '请正确输入',
					  icon: 'error'
					})
					return
				}
				for (let i = 0; i < this.serviceTypeList.length; i++) {
					if (this.serviceTypeList[i].name === this.serviceType.name.trim()) {
						uni.showToast({
						  title: '不能有重复类别',
						  icon: 'error'
						})
						return
					}
				}
				uni.request({
					// #ifdef H5
					url: 'api/serviceType/save',
					// #endif
					// #ifdef MP-WEIXIN
					url: this.$api.defConfig.def().baseUrl + 'api/serviceType/save',
					// #endif
					method: 'POST',
					data: {
					  name: this.serviceType.name
					},
					success: (res) => {
						uni.showToast({
						  title: '添加成功'
						})
						this.listServiceType()
					},
				})
			},	
			dialogClose() {
				console.log('点击关闭')
			},
			deleteServiceType() {
				console.log('删除的service type id:' + this.value)
				this.$refs.deleteDialog.open()
			},
			dialogDeleteConfirm() {
				if (this.value === '' || this.value === 0) {
					uni.showToast({
					  title: '请选择类别',
					  icon: 'error'
					})
					return
				}
				console.log('确认删除的service type id:' + this.value)
				uni.request({
					// #ifdef H5
					url: 'api/serviceType/delete',
					// #endif
					// #ifdef MP-WEIXIN
					url: this.$api.defConfig.def().baseUrl + 'api/serviceType/delete',
					// #endif
					method: 'POST',
					data: {
					  id: this.value
					},
					success: (res) => {
						uni.showToast({
						  title: '删除成功'
						})
						this.listServiceType()
					},
				})
			},
			dialogUpdateConfirm() {
				if (this.value === '') {
					uni.showToast({
					  title: '行选择要修改的类别',
					  icon: 'error'
					})
					return
				}
				uni.request({
					// #ifdef H5
					url: 'api/serviceType/update',
					// #endif
					// #ifdef MP-WEIXIN
					url: this.$api.defConfig.def().baseUrl + 'api/serviceType/update',
					// #endif
					method: 'POST',
					data: {
						id: this.value,
						name: this.serviceType.name
					},
					success: (res) => {
						uni.showToast({
						  title: '更新成功'
						})
						this.listServiceType()
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.form {
		color: $uni-color-primary
	}
	.demo-uni-row {
		margin-bottom: 10px;
		/* #ifdef MP-TOUTIAO || MP-QQ || MP-BAIDU */
		display: block;
		/* #endif */
	}
	/* #ifdef MP-ALIPAY || MP-WEIXIN */
	::v-deep .uni-row {
		margin-bottom: 10px;
	}

	/* #endif */

	.demo-uni-col {
		height: 36px;
		border-radius: 5px;
	}

	.dark_deep {
		background-color: #99a9bf;
	}

	.dark {
		background-color: #d3dce6;
	}

	.light {
		background-color: #e5e9f2;
	}

	.example-body {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		padding: 5rpx 10rpx 0;
		overflow: hidden;
	}
</style>
