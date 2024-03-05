<template>
	<view class="content form">
		<uni-forms :modelValue="formData">
			<uni-forms-item label="手机号" name="phone" class="form">
				<uni-easyinput type="text" v-model="formData.phone" placeholder="请输入手机号登录" />
			</uni-forms-item>
			<uni-forms-item label="密码" name="password">
				<uni-easyinput type="password" v-model="formData.password" placeholder="请输入密码" />
			</uni-forms-item>
			<button @click="login">登录</button>
		</uni-forms>
		<navigator url="/pages/user/register">
			注册账号	
		</navigator>
	</view>
</template>

<script>
	import {set, get} from '@/common/storage.js'
	export default {
		data() {
			// return {
			// 	title: 'Hello',
			// 	buttonText: "按钮",
			// 	buttondisble: false,
			// 	value: 5
			// }
			return {
				formData: {
					phone: '',
					password: ''
				}
			}
		},
		onLoad() {
			
		},
		methods: {
			// goto(url) {
			// 	console.log("按钮被点击了，传入参数是：" + url)
			// },
			// changeRate(e) {
			// 	if (e) {
			// 		console.log("rate v:" + e?.value)
			// 	}
			// }
			login() {
			  uni.request({
				// #ifdef H5
				url: 'api/login',
				// #endif
				// #ifdef MP-WEIXIN
				url: this.$api.defConfig.def().baseUrl + 'api/login',
				// #endif
				method: 'POST',
				data: {
				  phone: this.formData.phone,
				  password: this.formData.password
				},
				success: (res) => {
				  if (res.data.code === 200) {
					if (res.data.userServiceResult.status === "NOTLOGIN") {
						// redirect to register page
						uni.navigateTo({
						  url: '/pages/user/register'
						})
						uni.showToast({
						  title: '未找到用户，请注册!',
						  icon: 'none'
						})
					} else if (res.data.userServiceResult.status === "INCORRECTPASSWORD") {
						uni.showToast({
						  title: '密码错误请重新登录!',
						  icon: 'error'
						})
					} else {
						set('loginInfo', res.data.userServiceResult.user)
						set('isLogin', true)
						uni.showToast({
						  title: '登录成功'
						})
						console.log(get('isLogin'))
						console.log(get('loginInfo'))
						uni.reLaunch({
						  url: '/pages/index/index'
						});
					}
				  } else {
					uni.showToast({
					  title: '登录失败',
					  icon: 'fail'
					})
				  }
				},
				fail: (err) => {
				  console.log(err)
				  uni.showToast({
					title: '网络错误',
					icon: 'error'
				  })
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
</style>
