<template>
	<view class="page page-fill" v-if="userInfo">
		<view class="page-block info-list">
			<!-- 头像 -->
			
			<view class="item-wapper face-line-upbottom">
				<view class="info-words">头像</view>
				
				<view class="right-wapper">
					<image :src="userInfo.faceImage" class="face" @click="setAvatar"></image>
					<view class="arrow-block">
						<image src="../../static/img/icos/left-gray-arrow.png" class="arrow-ico"></image>
					</view>
				</view>
			</view>
			
			<view class="line-top">
				<view class="line"></view>
			</view>
			
			<!-- 昵称 -->
			<view class="item-wapper">
				<view class="info-words">昵称</view>
				
				<view class="right-wapper">
					<view class="gray-fields">
						{{userInfo.nickname}}
					</view>
					<view class="arrow-block">
						<image src="../../static/img/icos/left-gray-arrow.png" class="arrow-ico"></image>
					</view>
				</view>
			</view>
			
			<view class="line-top">
				<view class="line"></view>
			</view>
			
			<!-- 生日 -->
			<view class="item-wapper">
				<view class="info-words">生日</view>
				
				<view class="right-wapper">
					<view class="gray-fields">
						{{userInfo.birthday}}
					</view>
					<view class="arrow-block">
						<image src="../../static/img/icos/left-gray-arrow.png" class="arrow-ico"></image>
					</view>
				</view>
			</view>
			
			<view class="line-top">
				<view class="line"></view>
			</view>
			
			<!-- 性别 -->
			<view class="item-wapper">
				<view class="info-words">性别</view>
				
				<view class="right-wapper">
					<view class="gray-fields">
						
						<view v-if="userInfo.sex == 1">
							男
						</view>
						<view v-else-if="userInfo.sex == 0">
							女
						</view>
						<view v-else>
							未选择
						</view>
						
					</view>
					<view class="arrow-block">
						<image src="../../static/img/icos/left-gray-arrow.png" class="arrow-ico"></image>
					</view>
				</view>
			</view>
			
		</view>
		
		<view class="footer-wapper">
			<view class="footer-words" @click="cleanStorage">
				清理缓存
			</view>
			<view class="footer-words" style="margin-top: 10upx;" @click="cleanStorage">
				退出登录
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: null
			}
		},
		onShow() {
			let user = uni.getStorageSync('USER')
			if(user) {
				this.userInfo = user
			}
    },
    methods: {
		cleanStorage() {
			uni.removeStorageSync('USER')
			uni.showToast({
				title: '清理缓存成功',
				icon: "none",
				duration: 800
			})
			// 跳转重新加载
			uni.reLaunch({
				url: '../personal/personal'
			})
		},
		setAvatar() {
			uni.showActionSheet({
				itemList: [
					'查看我的头像',
					'从相册选择上传'
				],
				success: (res) => {
					let index = res.tapIndex
					if(index === 0) {
						// 预览头像
						uni.previewImage({
							current: this.userInfo.faceImage,
							urls: [this.userInfo.faceImage]
						})
					} else {
						// 选择上传头像
						uni.chooseImage({
							count: 1,
							// 压缩
							sizeType: ['compressed'],
							success: res => {
								// 临时路径
								let path = res.tempFilePaths[0]
								// 跳转至上传头像
								uni.navigateTo({
									url: '../upload-avatar/upload-avatar?path=' + path 
								})
							}
						})
					}
				}
			})
		}
    }
}
</script>

<style lang="scss">
.page-fill {
	width:100%;
	height: 100%;
}

.info-list {
	/* margin-top: 20upx; */
	padding: 0upx 30upx;
}

.info-words {
	color: #333333;
	font-size: 16px;
	width: 25%;
	line-height: 80upx;
	/* font-weight: bold; */
}

.face {
	width: 80upx;
	height: 80upx;
	border-radius: 50%;
}

.arrow-block {
	margin-left: 10upx;
	line-height: 86upx;
}

.arrow-ico {
	width: 30upx;
	height: 30upx;
}

.item-wapper {
	display: flex;
	/* margin-top: 20upx; */
	flex-direction: row;
	justify-content: flex-start;
}

.face-line-upbottom {
	margin-top: 20upx;
	/* margin-bottom: 20upx; */
	padding-top: 20upx;
	padding-bottom: 20upx;
}

.line-top {
	/* margin-top: 20upx; */
}

.right-wapper {
	width: 80%;
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
}

.gray-fields {
	font-size: 14px;
	color: darkgray;
	line-height: 80upx;
}

/* 底部操作 start */
.footer-wapper {
	position: fixed;
	bottom: 0;
	
	display: flex;
	flex-direction: column;
	width: 100%;
}
.footer-words {
	text-align: center;
	background-color: white;
	padding: 20upx;
	
	color: #333333;
	font-size: 16px;
}
/* 底部操作 end */
</style>
