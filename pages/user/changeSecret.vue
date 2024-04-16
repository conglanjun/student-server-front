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
		<view class="content">
			<uni-forms :modelValue="formData">
				<uni-forms-item label="手机号" name="phone">
					<uni-easyinput type="text" v-model="formData.phone" placeholder="请输入手机号" />
				</uni-forms-item>
				<uni-forms-item label="修改密码" name="password">
					<uni-easyinput type="password" v-model="formData.password" placeholder="请输入密码" />
				</uni-forms-item>
				<uni-forms-item label="确认密码" name="repassword">
					<uni-easyinput type="password" v-model="formData.repassword" placeholder="请输入密码" />
				</uni-forms-item>
				<button @click="changeSecret">修改密码</button>
			</uni-forms>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				formData: {
					password: '',
					repassword: ''
				},
				routes: [
					{
						to: "/pages/index/index",
						name: "首页",
					}
				],
			}
		},
		methods: {
			changeSecret() {
				if (this.formData.password !== this.formData.repassword) {
					uni.showToast({
					  title: '两次密码不一致，修改失败',
					  icon: 'none'
					})
					return
				}
				uni.request({
					// #ifdef H5
					url: "api/user/changeSecret",
					// #endif
					// #ifdef MP-WEIXIN
					url: this.$api.defConfig.def().baseUrl + 'api/user/changeSecret',
					// #endif
					method: 'POST',
					data: {
						phone: this.formData.phone,
						password: this.formData.password,
					},
					success: (res) => {
					  if (res.data.code === 200) {
						uni.showToast({
						  title: '修改成功'
						})
						uni.navigateTo({
						  url: '/pages/user/login'
						})
					  } else if (res.data.code === 400) {
						uni.showToast({
						  title: res.data.message,
						  icon: 'none'
						 })
					  } else {
						uni.showToast({
						  title: '修改失败',
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

