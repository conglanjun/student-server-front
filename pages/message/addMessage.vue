<template>
	<view>
		<uni-nav-bar dark :fixed="true" shadow background-color="#007AFF" status-bar left-icon="left" left-text="返回" title="导航栏" @clickLeft="back" />
		<uni-forms :modelValue="formData">
			<uni-forms-item label="留言标题" name="title" class="form">
				<uni-easyinput type="text" v-model="formData.title" placeholder="请输入留言标题" />
			</uni-forms-item>
			<uni-forms-item label="留言详情" name="message">
				<uni-easyinput type="textarea" v-model="formData.message" placeholder="请输入留言详情" />
			</uni-forms-item>
						
			<!-- <uni-popup ref="deleteDialog" type="dialog">
				<uni-popup-dialog ref="inputClose"  mode="base" title="删除留言" :value="dialogText" @close="dialogClose" @confirm="dialogDeleteConfirm">
					<uni-forms-item label="是否确认删除留言" name="title" class="form">
					</uni-forms-item>
				</uni-popup-dialog>
			</uni-popup> -->
			
			<!-- <button @click="uploadImage">上传图片</button> -->
			<button @click="addItem">创建留言</button>
		</uni-forms>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				formData: {
					title: '',
					message: ''
				},
				dialogText: '',
				creatorId: ''
			}
		},
		onLoad(param) {
			this.creatorId = param.creatorId
		},
		methods: {
			dialogClose() {
				console.log('点击关闭')
			},
			addItem() {
				if (this.formData.title === '' || this.formData.message === '') {
					uni.showToast({
					  title: '请填写完留言内容再提交',
					  icon: 'error'
					})
					return
				}
				uni.request({
					// #ifdef H5
					url: 'api/message/save',
					// #endif
					// #ifdef MP-WEIXIN
					url: this.$api.defConfig.def().baseUrl + 'api/message/save',
					// #endif
					method: 'POST',
					data: {
					  title: this.formData.title,
					  message: this.formData.message,
					  userId: this.creatorId,
					},
					success: (res) => {
						uni.showToast({
						  title: '提交成功'
						})
						uni.reLaunch({
							url: '/pages/message/message'
						})
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
			// dialogDeleteConfirm() {
			// 	uni.request({
			// 		// #ifdef H5
			// 		url: 'api/message/delete/' + this.creatorId,
			// 		// #endif
			// 		// #ifdef MP-WEIXIN
			// 		url: this.$api.defConfig.def().baseUrl + 'api/message/delete/' + this.creatorId,
			// 		// #endif
			// 		method: 'DELETE',
			// 		success: (res) => {
			// 			uni.showToast({
			// 			  title: '删除成功'
			// 			})
			// 			uni.navigateTo({
			// 				url: '/pages/message/message'
			// 			})
			// 		},
			// 	})
			// },
		}
	}
</script>

<style>

</style>
