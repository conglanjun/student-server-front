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
						@change="selectChange"
						style="width: 150px;"
					  ></uni-data-select>
					  <view><span>请注意：非学校人员不可以选择宿舍</span></view>
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
				routes: [
					{
						to: "/pages/index/index",
						name: "首页",
					}
					// {
					// 	to: "",
					// 	name: "菜单 A",
					// },
					// {
					// 	to: "",
					// 	name: "菜单 B",
					// },
				],
				building: {
					id: '',
					name: ''
				},
				selectedBuiildingId: '',
				buildingList:[]
			}
		},
		onLoad() {
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
			selectChange(e) {
				console.log(e)
				this.building.id = this.selectedBuiildingId
			},
			register() {
				if (this.formData.password !== this.formData.repassword) {
					uni.showToast({
					  title: '两次密码不一致，注册失败',
					  icon: 'none'
					})
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
						buildingId: this.building.id
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


