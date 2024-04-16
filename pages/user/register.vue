<template>
	<view>
		<uni-nav-bar dark :fixed="true" shadow background-color="#007AFF" status-bar left-icon="left" left-text="返回" title="导航栏" @clickLeft="back" />
		<view class="content">
			<uni-forms :modelValue="formData">
				<uni-forms-item label="姓名" name="name">
					<uni-easyinput type="text" v-model="formData.name" placeholder="请输入姓名" />
				</uni-forms-item>
				<uni-forms-item label="手机号" name="phone">
					<uni-easyinput type="text" v-model="formData.phone" placeholder="请输入手机号" />
				</uni-forms-item>
				<uni-forms-item label="密码" name="password">
					<uni-easyinput type="password" v-model="formData.password" placeholder="请输入密码" />
				</uni-forms-item>
				<uni-forms-item label="确认密码" name="repassword">
					<uni-easyinput type="password" v-model="formData.repassword" placeholder="请输入密码" />
				</uni-forms-item>
				<uni-forms-item label="分配宿舍" name="building">
					<uni-data-select
						v-model="selectedBuiildingId"
						:localdata="buildingList"
						@change="selectBuildingChange"
						style="width: 150px;"
					  ></uni-data-select>
					  <view><span>请注意：非学校人员不可以选择宿舍</span></view>
				</uni-forms-item>
				<uni-forms-item label="分配寝室" name="room">
					<uni-data-select
						v-model="selectedRoomId"
						:localdata="roomList"
						@change="selectRoomChange"
						style="width: 150px;"
					  ></uni-data-select>
				</uni-forms-item>
				
				<button @click="register">注册</button>
			</uni-forms>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				formData: {
					name: '',
					phone: '',
					password: '',
					repassword: ''
				},
				building: {
					id: '',
					name: ''
				},
				selectedBuiildingId: '',
				selectedRoomId: '',
				buildingList:[],
				roomList:[],
				buildingId: '',
				roomId: '',
				roleId: '',
			}
		},
		onLoad() {
			this.loadBuildingList()
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
								if (res.data.roleList[i].name === 'student')
								this.roleId = res.data.roleList[i].id
							}
						}
					}
				}
			})
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
			selectBuildingChange(e) {
				console.log(e)
				this.buildingId = e
				this.loadRoomList()
				this.roomId = ''
			},
			selectRoomChange(e) {
				console.log(e)
				this.roomId = e
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
			register() {
				if (this.formData.password === "" || this.formData.repassword === "") {
					uni.showToast({
					  title: '密码不能为空',
					  icon: 'none'
					})
					return
				}
				if (this.formData.password !== this.formData.repassword) {
					uni.showToast({
					  title: '两次密码不一致，注册失败',
					  icon: 'none'
					})
					return
				}
				uni.request({
					// #ifdef H5
					url: "api/save/user",
					// #endif
					// #ifdef MP-WEIXIN
					url: this.$api.defConfig.def().baseUrl + 'api/save/user',
					// #endif
					method: 'POST',
					data: {
						name: this.formData.name,
						phone: this.formData.phone,
						password: this.formData.password,
						buildingId: this.building.id,
						roomId: this.roomId,
						roleId: this.roleId
					},
					success: (res) => {
					  if (res.data.code === 200) {
						uni.navigateTo({
						  url: '/pages/user/login'
						})
						uni.showToast({
						  title: '注册成功'
						})
					  } else if (res.data.code === 400) {
						uni.showToast({
						  title: res.data.message,
						  icon: 'none'
						 })
					  } else {
						uni.showToast({
						  title: '注册失败',
						  icon: 'none'
						})
					  }
					},
					fail: (err) => {
					  console.log(err)
					  uni.showToast({
						title: '网络错误',
						icon: 'none'
					  })
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
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
	
	.uni-form-item .title {
		padding: 20rpx 0;
	}
</style>


