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
				<button class="container left-aligned-button uni-bg-blue1" @click="inputDialogToggle('add')" style="background-color: #b88e22;font-size: 12px; color: white;">新增维修类型</button>
				<uni-title type="h4" title="耗材列表" style="font-size: 12px"></uni-title>
			</view>
			<view class="uni-container">
				<uni-table ref="table" :loading="loading" border stripe emptyText="暂无更多数据">
					<uni-tr>
						<uni-th width="100" align="center">维修类型</uni-th>
						<uni-th width="80" align="center">操作</uni-th>
					</uni-tr>
					<uni-tr v-for="(item, index) in serviceTypeList" :key="index">
						<uni-td>{{ item.name }}</uni-td>
						<uni-td>
							<view class="uni-group">
								<button class="uni-button" size="mini" style="font-size: 8px; margin-right: 10px;" type="primary" @click="updateServieType(item)">更新</button>
								<button class="uni-button" size="mini" style="font-size: 8px" type="warn" @click="deleteServiceType(item)">删除</button>
							</view>
						</uni-td>
					</uni-tr>
				</uni-table>
				<uni-popup ref="inputDialog" type="dialog">
					<uni-popup-dialog ref="inputClose"  mode="base" title="新增类别" :value="dialogText" @close="inputDialogClose" @confirm="dialogInputConfirm">
						<uni-forms-item label="维修类别" name="title" class="form">
							<uni-easyinput type="text" v-model="serviceType.name" placeholder="请输入维修类别" />
						</uni-forms-item>
					</uni-popup-dialog>
				</uni-popup>
				
				<uni-popup ref="updateDialog" type="dialog">
					<uni-popup-dialog ref="inputClose"  mode="base" title="更新类别内容" :value="dialogText" @close="updateDialogClose" @confirm="dialogUpdateConfirm">
						<uni-forms-item label="维修类别内容" name="title" class="form">
							<uni-easyinput type="text" v-model="serviceType.name"/>
						</uni-forms-item>
					</uni-popup-dialog>
				</uni-popup>
				
				<uni-popup ref="deleteDialog" type="dialog">
					<uni-popup-dialog ref="inputClose"  mode="base" title="删除类别" :value="dialogText" @close="deleteDialogClose" @confirm="dialogDeleteConfirm">
						<uni-forms-item label="是否确认删除类别" name="title" class="form">
						</uni-forms-item>
					</uni-popup-dialog>
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
				dialogText: '',
				serviceType: {
					id: '',
					name: ''
				},
				serviceTypeList:[],
				loading: false,
				formData: {},
				routes: [
					{
						to: "/pages/index/index",
						name: "首页",
					},
				]
			}
		},
		onLoad() {
			this.listServiceType()	
		},
		methods: {			
			inputDialogClose() {
				this.$refs.inputDialog.close()
			},			
			updateDialogClose() {
				this.$refs.updateDialog.close()
				this.listServiceType()
			},			
			deleteDialogClose() {
				this.$refs.deleteDialog.close()
			},
			inputDialogToggle(type, item) {
				if (type === 'add') {
					this.serviceType = {}
					this.$refs.inputDialog.open()
				}
			},
			addServieType() {
				this.serviceType.name = ''
				this.$refs.inputDialog.open()
			},
			updateServieType(item) {
				this.serviceType = item
				this.$refs.updateDialog.open()
			},
			deleteServiceType(item) {
				console.log('删除的service type:' + item)
				this.serviceType = item 
				this.$refs.deleteDialog.open()
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
								this.serviceTypeList = res.data.serviceTypeList
							}
						}
					},
					fail: (res) => {
						
					}
				})	
			},
			dialogInputConfirm() {
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
			dialogUpdateConfirm() {
				if (this.serviceType.name === '') {
					uni.showToast({
					  title: '输入类别不能为空',
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
						id: this.serviceType.id,
						name: this.serviceType.name
					},
					success: (res) => {
						uni.showToast({
						  title: '更新成功'
						})
						this.listServiceType()
						this.serviceType = {}
					}
				})
			},
			dialogDeleteConfirm() {
				console.log('确认删除的service type id:' + this.serviceType.id)
				uni.request({
					// #ifdef H5
					url: 'api/serviceType/delete',
					// #endif
					// #ifdef MP-WEIXIN
					url: this.$api.defConfig.def().baseUrl + 'api/serviceType/delete',
					// #endif
					method: 'POST',
					data: {
					  id: this.serviceType.id
					},
					success: (res) => {
						uni.showToast({
						  title: '删除成功'
						})
						this.listServiceType()
						this.serviceType = {}
					},
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

