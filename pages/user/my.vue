<template>
	<view>
		<uni-nav-bar dark :fixed="true" shadow background-color="#007AFF" status-bar left-icon="left" left-text="返回" title="导航栏" @clickLeft="back" />
		<view class="content">
			<uni-forms-item label="姓名" name="name">
				<uni-easyinput type="text" v-model="user.name" :disabled="true"/>
			</uni-forms-item>
			<uni-forms-item label="手机号" name="phone">
				<uni-easyinput type="text" v-model="user.phone" :disabled="true"/>
			</uni-forms-item>
			<uni-forms-item label="权限" name="role">
				<uni-easyinput type="text" v-model="user.role.displayName" :disabled="true"/>
			</uni-forms-item>
			<uni-forms-item label="宿舍" name="displayRoomInfo">
				<uni-easyinput type="text" v-model="user.displayRoomInfo" :disabled="true"/>
			</uni-forms-item>
			<button @click="loginout">退出登录</button>
		</view>
	</view>
</template>

<script>
	import {get, del} from '@/common/storage.js'
	export default {
		data() {
			return {
				user:{
					name:'',
					phone:'',
					role: {}
				},
			}
		},
		onLoad() {
			var isLogin = get('isLogin')
			console.log(isLogin)
			var loginInfo = get('loginInfo')
			console.log(loginInfo)
			if (isLogin && loginInfo) {
				this.user = loginInfo
				if (this.user.room === 'undefined' || this.user.room === null || this.user.room === 'null') {
					this.user.room = {
						name: '无',
						description: '未分配'
					}
				}
			} else {
				uni.showToast({
				  title: '请登录！',
				  icon: 'none'
				})
				setTimeout(()=>{
					uni.navigateTo({
					  url: '/pages/user/login'
					})
				}, 1000)
			}
		},
		methods: {
			loginout() {
				del('isLogin')
				del('loginInfo')
				var isLogin = get('isLogin')
				console.log(isLogin)
				var loginInfo = get('loginInfo')
				console.log(loginInfo)
				uni.navigateTo({
				  url: '/pages/user/login'
				})
				uni.showToast({
				  title: '退出成功，请重新登录！'
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
</style>
