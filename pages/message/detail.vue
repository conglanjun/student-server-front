<template>
	<view>
		<view class="page_pingjia1">
			<uni-forms :modelValue="item">
				<uni-forms-item label="留言标题" name="title" class="form">
					<uni-easyinput type="text" v-model="item.title" :disabled="!canDone"/>
				</uni-forms-item>
				<uni-forms-item label="留言详情" name="message">
					<uni-easyinput type="textarea" v-model="item.message" :disabled="!canDone"/>
				</uni-forms-item>				
				<view style="margin-bottom:22px;">
					<uni-text>
						<span style="font-size: 14px; color: #606266;">创建时间: 	{{item.displayCreateTime}}</span>
					</uni-text>
				</view>
			</uni-forms>
			
			<view>
				<uni-row class="demo-uni-row">
					<uni-col :span="12">
						<button class="anniu" :disabled="!canDone" type="success" style=" margin: 10px 10px;font-size: 10px; background-color: #4ba5f6; color: aliceblue;" @click="update">修改</button>
					</uni-col>
					<uni-col :span="12">
						<button class="anniu" :disabled="!canDelete" type="success" style="margin: 10px 10px;font-size: 10px; background-color: #990033; color: aliceblue;" @click="deleteItem">删除</button>
					</uni-col>
				</uni-row>
			</view>
		</view>
	</view>
</template>

<script>
	import {set, get} from '@/common/storage.js'
	export default {
		data() {
			return {
				item:{
					title: '',
					id: '',
					message:'',
				},
				canDone: false,
				canDelete: false,
			}
		},
		onLoad(param){
			this.item.id = param.id
			var loginInfo = get('loginInfo')
			this.loginInfo = loginInfo
			uni.request({
				// #ifdef H5
				url: 'api/message/get/' + this.item.id,
				// #endif
				// #ifdef MP-WEIXIN
				url: this.$api.defConfig.def().baseUrl + 'api/message/get/' + this.item.id,
				// #endif
				method: 'GET',
				success: (res) => {
					if (res.data.code === 200) {
						this.item = res.data.messageData
						if (loginInfo?.id === this.item?.user.id) {
							this.canDone = true
							this.canDelete = true
						}
					}
				},
			})
		},	
		methods: {
			update() {
				uni.request({
					// #ifdef H5
					url: 'api/message/save',
					// #endif
					// #ifdef MP-WEIXIN
					url: this.$api.defConfig.def().baseUrl + 'api/message/save',
					// #endif
					method: 'POST',
					data: {
					  id: this.item.id,
					  title: this.item.title,
					  message: this.item.message,
					  createTime: this.item.createTime,
					  userId: this.loginInfo?.id
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
			deleteItem() {
				uni.request({
					// #ifdef H5
					url: 'api/message/delete/' + this.item.id,
					// #endif
					// #ifdef MP-WEIXIN
					url: this.$api.defConfig.def().baseUrl + 'api/message/delete/' + this.item.id,
					// #endif
					method: 'DELETE',
					success: (res) => {
						uni.showToast({
						  title: '删除成功'
						})
						uni.reLaunch({
							url: '/pages/message/message'
						})
					},
				})
			}
		}
	}
</script>


<style lang="scss">
	.page_pingjia1 {
		background-color: #F4F4F6;
		width: 100vw;
		height: 100vh;
		padding-top: 30px;
		padding-left: 20px;

		.jianjie {
			background-color: #ffffff;
			width: 85vw;
			height: 15vh;
			border-radius: 10px;
			display: flex;
			padding-left: 17px;

		}

		.anniu {
			margin-left: 15px;
			margin-top: 20px;
		}

		.zhiliang {
			margin-top: 30px;
			display: flex;
			justify-content: space-around;
		}

		.taidu {
			padding-top: 25px;

			display: flex;
			justify-content: space-around;
		}

		.shuru {
			width: 75vw;
			margin-top: 30px;
			margin-left: 27px;


		}

		.shangmen {
			padding-top: 30px;
			margin-left: 25px;
		}

		.xx {
			margin-left: 175px;
			margin-top: -20px;
		}

		.pingjia {
			height: 60vh;
			background-color: #ffffff;
			width: 90vw;
			margin-top: 20px;
			border-radius: 10px;
		}

		.shuzi {
			color: #ff0000;
		}

		.jiage {
			font-size: 12px;
			color: #ff0000;
		}

		.heti {
			margin-top: 20px;
			display: flex;
		}

		.name {
			font-weight: 900;
		}

		.touxiang {
			margin-top: 10px;

		}

		.zhuti {
			margin-left: 45px;
			margin-top: 20px;
		}

	}
</style>
