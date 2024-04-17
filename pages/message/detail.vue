<template>
	<view>
		<uni-nav-bar dark :fixed="true" shadow background-color="#007AFF" status-bar left-icon="left" left-text="返回" title="导航栏" @clickLeft="back" />
		<view style="margin-bottom:22px;">
			<uni-text>
				<span style="font-size: 14px; color: #606266;">留言标题: 	{{item.title}}</span>
			</uni-text>
		</view>
		<view style="margin-bottom:22px;">
			<uni-text>
				<span style="font-size: 14px; color: #606266;">留言内容: 	{{item.message}}</span>
			</uni-text>
		</view>
		<view class="comment">
		   <hb-comment ref="hbComment" @add="sendComment" @del="delcomment" @like="like" @focusOn="focusOn" :deleteTip="'确认删除？'"
			   :cmData="commentData" v-if="commentData"></hb-comment>
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
				commentData: '',
				res:'',
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
			
			
			// demo
			this.res = {
				"readNumer": 193,
				"commentList": [{
						"id": 1, // 唯一主键
						"owner": false, // 是否是拥有者，为true则可以删除，管理员全部为true
						"hasLike": false, // 是否点赞
						"likeNum": 2, // 点赞数量
						// "avatarUrl": "https://inews.gtimg.com/newsapp_ls/0/13797755537/0", // 评论者头像地址
						"nickName": "超长昵称超长...", // 评论者昵称，昵称过长请在后端截断
						"content": "啦啦啦啦", // 评论内容
						"parentId": null, // 所属评论的唯一主键
						"createTime": "2021-07-02 16:32:07" // 创建时间
					},
					{
						"id": 2,
						"owner": false,
						"hasLike": false,
						"likeNum": 2,
						"avatarUrl": "https://inews.gtimg.com/newsapp_ls/0/13797761970/0",
						"nickName": "寂寞无敌",
						"content": "我是评论的评论",
						"parentId": 1,
						"createTime": "2021-07-02 17:05:50"
					},
					{
						"id": 4,
						"owner": true,
						"hasLike": true,
						"likeNum": 1,
						"avatarUrl": "https://inews.gtimg.com/newsapp_ls/0/13797763270/0",
						"nickName": "name111",
						"content": "评论啦啦啦啦啦啦啦啦啦啦",
						"parentId": null,
						"createTime": "2021-07-13 09:37:50"
					},
					{
						"id": 5,
						"owner": false,
						"hasLike": false,
						"likeNum": 0,
						"avatarUrl": "https://inews.gtimg.com/newsapp_ls/0/13797755537/0",
						"nickName": "超长昵称超长...",
						"content": "超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论超长评论",
						"parentId": null,
						"createTime": "2021-07-13 16:04:35"
					},
					{
						"id": 13,
						"owner": false,
						"hasLike": false,
						"likeNum": 0,
						"avatarUrl": "https://inews.gtimg.com/newsapp_ls/0/13797755537/0",
						"nickName": "超长昵称超长...",
						"content": "@寂寞无敌 你怕不是个大聪明",
						"parentId": 1,
						"createTime": "2021-07-14 11:01:23"
					}
				]
			}
			// this.commentData = {
			//     "readNumer": this.res.readNumer,
			//     "commentSize": this.res.commentList.length,
			//     "comment": this.getTree(this.res.commentList)
			// }
			this.getCommentList()
			
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
			},
			getTree(data) {
			    let result = [];
			    let map = {};
			    data.forEach(item => {
			        map[item.id] = item;
			    });
			    data.forEach(item => {
			        let parent = map[item.parentId];
			        if (parent) {
			            (parent.children || (parent.children = [])).push(item);
			        } else {
			            result.push(item);
			        }
			    });
			    return result;
			},
			bindTextAreaBlur: function (e) {
				console.log(e.detail.value)
			},
			focusOn(){
				// this.$refs.hbComment.focusOn();
			},
			sendComment(data){
				console.log(data)
				uni.request({
					// #ifdef H5
					url: 'api/comment/save',
					// #endif
					// #ifdef MP-WEIXIN
					url: this.$api.defConfig.def().baseUrl + 'api/comment/save',
					// #endif
					method: 'POST',
					data: {
					  articleId: this.item.id,
					  commentUserId: this.loginInfo.id,
					  parentId: data.pId,
					  content: data.content,
					  like: '[]',
					  status: 1
					},
					success: (res) => {
						this.$refs.hbComment.closeInput();
						this.getCommentList();
					},
				})
			},
			delcomment(data){
				uni.request({
					// #ifdef H5
					url: 'api/comment/delete/' + data,
					// #endif
					// #ifdef MP-WEIXIN
					url: this.$api.defConfig.def().baseUrl + 'api/comment/delete/' + data,
					// #endif
					method: 'DELETE',
					success: (res) => {
						if (res.data.code === 200) {
							this.getCommentList();
						}
					},
				})
			},
			getCommentList(){
				uni.request({
					// #ifdef H5
					url: 'api/comment/list?messageId=' + this.item.id + '&userId=' + this.loginInfo.id,
					// #endif
					// #ifdef MP-WEIXIN
					url: this.$api.defConfig.def().baseUrl + 'api/comment/list?messageId=' + this.item.id + '&userId=' + this.loginInfo.id,
					// #endif
					method: 'GET',
					success: (res) => {
						if (res.data.code === 200) {
							console.log(res.data)
							for(let i = 0; i < res.data.commentDataList?.length; i++) {
								res.data.commentDataList[i].createTime = res.data.commentDataList[i].displayCreateTime
								res.data.commentDataList[i].updateTime = res.data.commentDataList[i].displayUpdateTime
							}
							this.commentData = {
								"readNumer": res.data.readNumer,
								"commentSize": res.data.commentDataList?.length,
								"comment": this.getTree(res.data.commentDataList)
							}
						}
					},
				})
			},
			like(data) {
				console.log(data)
				uni.request({
					// #ifdef H5
					url: 'api/comment/like?commentId=' + data + '&userId=' + this.loginInfo.id,
					// #endif
					// #ifdef MP-WEIXIN
					url: this.$api.defConfig.def().baseUrl + 'api/comment/like?commentId=' + data + '&userId=' + this.loginInfo.id,
					// #endif
					method: 'GET',
					success: (res) => {
						if (res.data.code === 200) {
							this.getCommentList()
						}
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
