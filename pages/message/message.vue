<template>
	<view>
		<view>
			<button class="container right-aligned-button uni-bg-blue1" @click="addMessage" style="background-color: #b88e22;font-size: 12px; color: white;width: 80ps;">我要留言</button>
			<button class="container right-aligned-button uni-bg-blue1" @click="homePage" style="background-color: #007FD9;font-size: 12px; color: white; margin-right: 100px;">首页</button>
			<uni-title type="h1" title="留言区"></uni-title>
		</view>
		<uni-list v-for="(item, index) in items">
			<uni-list-item badgeText="done" :style="{'background-color': item.color}" :title="item.title" :note="item.displayMessage" clickable  @click="onClick(item.id)" ></uni-list-item>
		</uni-list>
	</view>
</template>

<script>
	import {set, get} from '@/common/storage.js'
	export default {
		data() {
			return {
				items:[],
				creatorId: ''
			}
		},
		onLoad() {
			this.loadMessageList()
			this.userInfo = get('loginInfo')
		},
		methods: {
			homePage() {
				uni.reLaunch({
					url: '/pages/index/index'
				})
			},
			onClick(id) {
				uni.navigateTo({
				  url: '/pages/message/detail?id=' + id
				})
			},
			addMessage() {
				uni.navigateTo({
					url: "/pages/message/addMessage?creatorId=" + this.userInfo.id
				})
			},
			loadMessageList(param) {
				let userInfo = get('loginInfo')
				var requestUrl = 'api/messageList'
				uni.request({
					// #ifdef H5
					url: requestUrl,
					// #endif
					// #ifdef MP-WEIXIN
					url: this.$api.defConfig.def().baseUrl + requestUrl,
					// #endif
					method: 'GET',
					success: (res) => {
						if (res.data.code === 200) {
							this.items = res.data.messageDataList
							console.log(this.items)
						}
					},
					fail: (res) => {
						
					}
				})
			}
		}
	}
</script>

<style>
@import '../../common/uni.css';

.center{text-align: center; vertical-align:middle;}
.container { position: relative; } 
.right-aligned-button { position: absolute; right: 0; }
.left-aligned-button { position: absolute; left: 0; }
</style>
