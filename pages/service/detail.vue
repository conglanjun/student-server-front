<template>
	<view>
		<uni-nav-bar dark :fixed="true" shadow background-color="#007AFF" status-bar left-icon="left" left-text="返回" title="导航栏" @clickLeft="back" />
		<view class="page_pingjia1">
			<uni-forms :modelValue="item">
				<uni-forms-item label="维修单标题" name="title" class="form">
					<uni-easyinput type="text" v-model="item.title" :disabled="disableEvaluate"/>
				</uni-forms-item>
				<uni-forms-item label="维修单详情" name="detail">
					<uni-easyinput type="textarea" v-model="item.detail" :disabled="disableEvaluate"/>
				</uni-forms-item>
				<!-- <uni-forms-item label="创建时间" name="displayCreateTime">
					<uni-easyinput type="text" v-model="item.displayCreateTime" :disabled="true"/>
				</uni-forms-item> -->
				
				<view style="margin-bottom:22px;">
					<uni-text>
						<span style="font-size: 14px; color: #606266;">创建时间: 	{{item.displayCreateTime}}</span>
					</uni-text>
				</view>
				<!-- <uni-forms-item label="状态" name="displayStatus"> -->
					<!-- <uni-easyinput type="text" v-model="item.displayStatus" :disabled="true"/> -->
				<view style="margin-bottom:22px;">
					<uni-text>
						<span style="font-size: 14px; color: #606266;">状态: 	{{item.displayStatus}}</span>
					</uni-text>
				</view>
				<view v-show="showReject" style="margin-bottom:22px;">
					<uni-text>
						<span style="font-size: 14px; color: #606266;">拒单详情: 	{{item.rejectDetail}}</span>
					</uni-text>
				</view>
				<!-- </uni-forms-item> -->
								
				<view style="margin-bottom:22px;">
					<uni-text>
						<span style="font-size: 14px; color: #606266;">寝室: 	{{item.displayRoomInfo}}</span>
					</uni-text>
				</view>
				<view style="margin-bottom:22px;">
					<uni-text>
						<span style="font-size: 14px; color: #606266;">创建者: 	{{item.creator.name}}</span>
					</uni-text>
				</view>
				<view>
					<uni-text>
						<span style="font-size: 14px; color: #606266;">报修人电话: 	{{item.creator.phone}}</span>
					</uni-text>
				</view>
				<view >
					<uni-text>
						<span style="font-size: 14px; color: #606266;">评分: {{item.rate}}</span>
					</uni-text>
				</view>
				<view>
					<uni-rate :count="item.count" activeColor="#ffee00" v-model="item.rate" :disabled="disableEvaluate || !beforeFinished" @change="change"></uni-rate>
				</view>
				
				<uni-forms-item label="维修单留言">
					<uni-easyinput type="textarea" height="170" v-model="item.comment" :disabled="disableEvaluate || !beforeFinished" placeholder="其他想说的..."></uni-easyinput >
				</uni-forms-item>
				<uni-forms-item label="分配维修人员" v-show="showDispatch">
					<uni-data-select :disabled="!dispatchMaintainer"
						v-model="selectedMaintainerId"
						:localdata="maintainerList"
						@change="selectChange"
						style="width: 150px;"
					  ></uni-data-select>
				</uni-forms-item>
				
				<view>
					<uni-text>
						<span style="font-size: 14px; color: #606266;">报修人电话: 	{{item.selectedMaintainerPhone}}</span>
					</uni-text>
				</view>
				
				<uni-popup ref="rejectDialog" type="dialog">
					<uni-popup-dialog mode="base" title="拒单原因" :value="rejectDialogText" @close="rejectDialogClose" @confirm="rejectDialogConfirm">
						<uni-forms-item label="拒单原因" name="title" class="form">
							<uni-easyinput type="text" v-model="item.rejectDetail" placeholder="请输入拒绝订单原因" />
						</uni-forms-item>
					</uni-popup-dialog>
				</uni-popup>
			</uni-forms>
			<button class="anniu" v-show="!dispatchMaintainer && !dispatchDone" type="success" style="width: 80vw;font-size: 12px; background-color: #4ba5f6;" :disabled="disableEvaluate || !beforeFinished" @click="evaluationFinish">更新评价</button>
			<button class="anniu" v-show="dispatchMaintainerManage" type="success" style="width: 80vw;font-size: 12px; background-color: #02bb18;" @click="dispatchMaintain">分配维修</button>
			<button class="anniu" v-show="dispatchDone" type="success" style="width: 80vw;font-size: 12px; background-color: #990033; color: aliceblue;" @click="dispatchFinish">完成</button>
			<button class="anniu" v-show="!disableEvaluate" type="success" style="width: 80vw;font-size: 12px; background-color: #990033; color: aliceblue;" @click="deleteItem">删除</button>
			<button class="anniu" v-show="canReceive && !dispatchDone && !isDone" type="success" style="width: 80vw;font-size: 12px; background-color: #02bb18;" @click="receive('RECEIVEDORDER')">接单</button>
			<button class="anniu" v-show="canReceive && !dispatchDone && !isDone" type="success" style="width: 80vw;font-size: 12px; background-color: #990033;" @click="rejectReceive">拒绝接单</button>
			<button class="anniu" v-show="canHandle" type="success" style="width: 80vw;font-size: 12px; background-color: #02bb18;" @click="receive('HANDLING')">维修中</button>
		</view>
	</view>
</template>

<script>
	import {set, get} from '@/common/storage.js'
	export default {
		data() {
			return {
				rejectDialogText: '',
				value: '',
				comment:'',
				item:{
					title: '',
					id: '',
					detail:'',
					rate:'',
					creator: {},
					comment:'',
					selectedMaintainerPhone:''
				},
				disableEvaluate: true,
				maintainerList: [],
				dispatchMaintainer: false,
				dispatchMaintainerManage: false,
				dispatchDone: false,
				beforeFinished: true,
				selectedMaintainerId: '',
				selectedMaintainerPhone: '',
				showDispatch: false,
				canReceive: false,
				showReject: false,
				canHandle: false,
				isDone: false,
			}
		},
		onLoad(param){
			this.listUser('maintainer')
			console.log(param)
			if (param.type === 'dispatch' || param.type === 'myDispatch') {
				this.showDispatch = true
			}
			if (param.type === 'myDispatch') {
				this.canReceive = true
			}
			this.item.id = param.id
			uni.request({
				// #ifdef H5
				url: 'api/service/' + this.item.id,
				// #endif
				// #ifdef MP-WEIXIN
				url: this.$api.defConfig.def().baseUrl + 'api/service/' + this.item.id,
				// #endif
				method: 'GET',
				success: (res) => {
					if (res.data.code === 200) {
						if (typeof res.data.serviceData.rate === 'undefined' || res.data.serviceData.rate === null || res.data.serviceData.rate === 'null') {
							res.data.serviceData.rate = 0
						}
						console.log(res.data.serviceData)
						this.item = res.data.serviceData
						console.log(this.item)
						if (loginInfo?.role?.name === "student" && loginInfo?.id === this.item.creator?.id) {
							this.disableEvaluate = false
						}
						if (res.data.serviceData.status === "HANDLING") {
							this.dispatchDone = true
						}
						if (res.data.serviceData.status === "REJECTORDER") {
							this.showReject = true
						}
						if (res.data.serviceData.status === "RECEIVEDORDER") {
							this.canReceive = false
						}
						
						this.selectedMaintainerId = res.data.serviceData?.maintainer?.id
						this.selectedMaintainerPhone = res.data.serviceData?.maintainer?.phone
						this.item.selectedMaintainerPhone = res.data.serviceData?.maintainer?.phone
						console.log("this.selectedMaintainerId:" + this.selectedMaintainerId)
						console.log("this.selectedMaintainerPhone:" + this.selectedMaintainerPhone)
						console.log("this.item.comment:" + this.item.comment)
						if (typeof this.item.selectedMaintainerPhone === 'undefined' || this.item.selectedMaintainerPhone === null || this.item.selectedMaintainerPhone === 'null' || this.item.selectedMaintainerPhone === '') {
							this.item.selectedMaintainerPhone = '无';
						}
						if (typeof this.item.comment === 'undefined' || this.item.comment === null || this.item.comment === 'null' || this.item.comment === 'NULL' || this.item.comment === '') {
							this.item.comment = '无';
						}
						if (res.data.serviceData.status === 'DONE') {
							this.beforeFinished = true
						} else {
							this.beforeFinished = false
						}
						if (res.data.serviceData.status === 'FINISHED' || res.data.serviceData.status === 'DONE') {
							this.isDone = true
						}
						if (loginInfo?.role?.name === "maintainer" && res.data.serviceData.status === "RECEIVEDORDER") {
							this.canHandle = true
						}
					}
				},
				fail: (res) => {
					
				}
			})
			var loginInfo = get('loginInfo')
			if (loginInfo?.role?.name === "admin" || loginInfo?.role?.name === 'dormitory-manager') {
				this.disableEvaluate = false
			} else{
				this.disableEvaluate = true
			}
			this.dispatchMaintainer = false
			if (loginInfo?.role?.name === "maintenance-manager" || loginInfo?.role?.name === 'maintainer') {
				this.dispatchMaintainer = true
			}
			this.dispatchMaintainerManage = false
			if (loginInfo?.role?.name === "maintenance-manager") {
				this.dispatchMaintainerManage = true
			}
		},
		methods: {
			listUser(type) {
				let roleId = 0;
				if (type === 'maintainer') {
					roleId = 5;
				}
				// list user
				uni.request({
					// #ifdef H5
					url: "api/userList?roleId=" + roleId,
					// #endif
					// #ifdef MP-WEIXIN
					url: this.$api.defConfig.def().baseUrl + 'api/userList?roleId=' + roleId,
					// #endif
					success: (res) => {
						if (res.data.userDataList) {
							for (let i = 0; i < res.data.userDataList.length; i++) {
								res.data.userDataList[i].text = res.data.userDataList[i].name
								res.data.userDataList[i].value = res.data.userDataList[i].id
							}
						}
						this.maintainerList = res.data.userDataList
						console.log(this.maintainerList)
					}
				})	
			},
			change(e) {
				console.log(e)
				this.item.rate = e?.value
			},
			selectChange(v) {
				console.log('value:' + v)
				this.selectedMaintainerId = v
			},
			deleteItem() {
				uni.request({
					// #ifdef H5
					url: 'api/service/delete/' + this.item.id,
					// #endif
					// #ifdef MP-WEIXIN
					url: this.$api.defConfig.def().baseUrl + 'api/service/delete/' + this.item.id,
					// #endif
					method: 'DELETE',
					success: (res) => {
						uni.showToast({
						  title: '删除成功'
						})
						uni.navigateTo({
							url: '/pages/service/service'
						})
					},
				})
			},
			rejectDialogClose() {
				this.$refs.rejectDialog.close()
			},
			rejectDialogConfirm() {
				this.receive('REJECTORDER')
			},
			rejectReceive() {
				this.$refs.rejectDialog.open()
			},
			dispatchMaintain() {
				uni.request({
					// #ifdef H5
					url: 'api/service/update',
					// #endif
					// #ifdef MP-WEIXIN
					url: this.$api.defConfig.def().baseUrl + 'api/service/update',
					// #endif
					method: 'POST',
					data: {
					  id: this.item.id,
					  maintainerId: this.selectedMaintainerId,
					  status: 'PENDINGORDER'
					},
					success: (res) => {
						uni.showToast({
						  title: '分配成功'
						})
						uni.navigateTo({
							url: '/pages/service/service'
						})
					},
				})
			},
			receive(status) {
				let data = {
				  "id": this.item.id,
				  "maintainerId": this.selectedMaintainerId,
				  "status": status
				}
				if (status === 'REJECTORDER') {
					data.rejectDetail = this.item.rejectDetail
				}
				uni.request({
					// #ifdef H5
					url: 'api/service/update',
					// #endif
					// #ifdef MP-WEIXIN
					url: this.$api.defConfig.def().baseUrl + 'api/service/update',
					// #endif
					method: 'POST',
					data: data,
					success: (res) => {
						uni.showToast({
						  title: '分配成功'
						})
						uni.redirectTo({
							url: '/pages/service/myDispatch'
						})
					},
				})
			},
			dispatchFinish() {
				uni.request({
					// #ifdef H5
					url: 'api/service/update',
					// #endif
					// #ifdef MP-WEIXIN
					url: this.$api.defConfig.def().baseUrl + 'api/service/update',
					// #endif
					method: 'POST',
					data: {
					  id: this.item.id,
					  status: 'DONE'
					},
					success: (res) => {
						uni.showToast({
						  title: '完成'
						})
						uni.redirectTo({
							url: '/pages/service/myDispatch'
						})
					},
				})
			},
			evaluationFinish() {
				uni.request({
					// #ifdef H5
					url: 'api/service/update',
					// #endif
					// #ifdef MP-WEIXIN
					url: this.$api.defConfig.def().baseUrl + 'api/service/update',
					// #endif
					method: 'POST',
					data: {
					  id: this.item.id,
					  rate: this.item.rate,
					  comment: this.item.comment,
					  status: 'FINISHED'
					},
					success: (res) => {
						uni.showToast({
						  title: '完成'
						})
						uni.navigateTo({
							url: '/pages/service/service'
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