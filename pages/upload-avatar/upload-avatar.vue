<template>
	<view class="page page-fill">
		
		<view class="pending-wapper">
			<image id="face" :src="avatar" class="pending-face" mode="scaleToFill"></image>
		</view>
		
		<view class="notice">
			<view class="notice-words">
				* 请从相册中选择等比宽高的图片噢~
			</view>
		</view>
		
		<view class="footer-opertor">
			<view class="opertor-words" @click="change">
				重新选择
			</view>
			<view class="opertor-words" @click="upload">
				确认上传
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				avatar: ''
			}
		},
		onLoad(query) {
			this.avatar = query.path
		},
		methods: {
			// 重新选择
			change() {
				uni.chooseImage({
					count: 1,
					// 压缩
					sizeType: ['compressed'],
					success: res => {
						// 临时路径
						let path = res.tempFilePaths[0]
						this.avatar = path
					}
				})
			},
			// 上传头像
			upload() {
				// 应向服务器交互 uni.uploadFile()
				// 此处只做缓存
				let user = uni.getStorageSync('USER')
				user.faceImage = this.avatar
				uni.setStorageSync('USER', user)
				uni.navigateBack({
					delta: 1
				})
			}
		}
	}
</script>

<style lang="scss">
/* 页面铺满屏幕 */
.page-fill {
	width:100%;
	height: 100%;
	position: absolute;
	background: black;
}

.pending-wapper {
	display: flex;
	flex-direction: row;
	justify-content: center;
	
	margin-top: 40upx;
}
.pending-face {
	width: 600upx;
	height: 600upx;
}

.notice {
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
}

.notice-words {
	color: gray;
	font-size: 13px;
	margin-top: 30upx;
	width: 600upx;
}

/* 底部操作 start */
.footer-opertor {
	position: fixed;
	bottom: 0;
	
	border-top: #515050 solid 1px;
	width: 100%;
	
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	
	padding: 30upx;
}
.opertor-words {
	color: #e8e5e5;
	font-size: 16px;
	width: 200upx;
}
/* 底部操作 end */
</style>
