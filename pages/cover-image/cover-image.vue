<template>
	<view class="cover-image">
		<image class="image" mode="widthFix" :src="imageUrl" @longpress="operator"></image>
	</view>
</template>

<script>
export default {
	data() {
		return {
			imageUrl: ''
		}
	},
	onLoad(query) {
		this.imageUrl = query.list
	},
	methods: {
		// 长按图片
		operator() {
			// #ifndef H5
			let _this = this
			// 长按弹起菜单
			uni.showActionSheet({
				itemList: ['保存到本地'],
				success: function (res) {
					// 下载文件
					uni.downloadFile({
						url: _this.imageUrl,
						success: (res) => {
							console.log(res.tempFilePath)
							// 拿到物理路径保存至本地
							uni.saveImageToPhotosAlbum({
								filePath: res.tempFilePath,
								success: function () {
									uni.showToast({
										icon: "none",
										title: '保存成功',
										duration: 800,
										
									});
								}
							})				
						}
					})
				},
				fail: function (res) {
					console.log(res.errMsg)
				}
			})
			// #endif
		}
	}
}
</script>

<style lang="scss">
.cover-image{
	background: #000;
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>
