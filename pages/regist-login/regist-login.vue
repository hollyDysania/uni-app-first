<template>
	<view class="body">
		<form @submit="submit">
			<view class="face-wapper">
				<image src="../../static/img/icos/default-face.png" class="face"></image>
			</view>
			
			<view class="info-wapper">
				<label class="words-lbl">账号</label>
				<input name="username" type="text" value="" class="input" placeholder="请输入用户名" placeholder-class="graywords"/>
			</view>
			
			<view class="info-wapper" style="margin-top: 40upx;">
				<label class="words-lbl">密码</label>
				<input name="password" type="text" value="" password="true" class="input" placeholder="请输入密码" placeholder-class="graywords"/>
			</view>
			
			<button type="primary" form-type="submit" style="margin-top: 60upx;width: 90%;">注册/登录</button>
		</form>
		
		
		<!-- 第三方登录H5不支持，所以隐藏掉 -->
		<!-- #ifndef H5 -->
			<view class="third-wapper">
				
				<view class="third-line">
					<view class="single-line">
						<view class="line"></view>
					</view>
					
					<view class="third-words">第三方账号登录</view>
					
					<view class="single-line">
						<view class="line"></view>
					</view>
				</view>
				
				<view class="third-icos-wapper">
					<!-- 5+app 用qq/微信/微博 登录 小程序用微信小程序登录 h5不支持 -->
					<!-- #ifdef APP-PLUS -->
						<image src="../../static/img/icos/weixin.png"  @click="appOAuthLogin('weixin')" class="third-ico"></image>
						<image src="../../static/img/icos/QQ.png" @click="appOAuthLogin('qq')" class="third-ico" style="margin-left: 80upx;"></image>
						<image src="../../static/img/icos/weibo.png"  @click="appOAuthLogin('sinaweibo')" class="third-ico" style="margin-left: 80upx;"></image>
					<!-- #endif -->
					<!-- #ifdef MP-WEIXIN -->
						<button open-type='getUserInfo' @getuserinfo="wxLogin" class="third-btn-ico">
						</button>
					<!-- #endif -->
				</view>
			</view>
		<!-- #endif -->
	</view>
</template>

<script>
	class UserInfo {
		id = 'UID' + ((+new Date() + '').slice(6, -1));
		modifySex = 3;
		birthday = '9012-21-21';
		constructor(nickname, faceImage) {
			this.nickname = nickname
			this.faceImage = faceImage
		}
	} 
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			submit(e) {
				let {username, password} = e.detail.value
				if(!username || !password) {
					uni.showToast({
						title: '请输入用户名与密码',
						icon: 'none',
						duration: 800
					})
					return
				}
				this.registLogin(username, password)
			},
			registLogin(username, password) {
				// 本地缓存登录
				// 用户信息缓存
				uni.setStorageSync("USER", new UserInfo(username, 'http://img5.imgtn.bdimg.com/it/u=2557475870,1515901425&fm=26&gp=0.jpg'))
				// 登录成功跳转到我的
				uni.showToast({
					title: '登录成功',
					icon: "none",
					duration: 800
				})
				uni.switchTab({
					url: '../personal/personal'
				})
			},
			// 微信登录
			wxLogin(e) {
				let { userInfo, } = e.detail
				// 获取code
				uni.login({
					provider: 'weixin',
					success: function({code}) {
						// 拿到code向后台发送请求
						// 由于没有接口直接缓存数据
						uni.setStorageSync("USER", new UserInfo(userInfo.nickName, userInfo.avatarUrl))
						// 登录成功跳转到我的
						uni.showToast({
							title: '登录成功',
							icon: "none",
							duration: 800
						})
						uni.switchTab({
							url: '../personal/personal'
						})
					}
				})
			},
			// APP第三方登录
			appOAuthLogin(type) {
				// 授权
				uni.login({
					provider: type,
					success: e => {
						console.log(e, 333)
						// 获取用户信息
						uni.getUserInfo({
							provider: type,
							success: info => {
								let userInfo = info.userInfo
								let user = null
								if(type === 'weixin') {
									user = new UserInfo(userInfo.nickName, userInfo.avatarUrl)
								} else if(type === 'qq') {
									user = new UserInfo(userInfo.nickname, userInfo.figureurl_qq_2)
								} else if(type === 'sinaweibo') {
									user = new UserInfo(userInfo.nickname, userInfo.avatar_large)
								}
								// 需要与后台交互暂无接口仅前端缓存
								uni.setStorageSync("USER", user)
								// 登录成功跳转到我的
								uni.showToast({
									title: '登录成功',
									icon: "none",
									duration: 800
								})
								uni.switchTab({
									url: '../personal/personal'
								})
							} 
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
.body {
	border-top: solid 1px #DBDBDA;
	padding: 0 40upx;
}

/* 头像 start */
.face-wapper {
	display: flex;
	flex-direction: row;
	justify-content: center;
	
	margin-top: 120upx;
	margin-bottom: 120upx;
}

.face {
	width: 160upx;
	height: 160upx;
}
/* 头像 end */

/* 注册登录 start */
.info-wapper {
	display: flex;
	flex-direction: row;
	justify-content: center;
	
	border-bottom: solid 1px #DBDBDA;
	
	padding-bottom: 20upx;
}

.words-lbl {
	color: #808080;
}

.input {
	width: 500upx;
	margin-left: 40upx;
}

.graywords {
	color: #EAEAEA;
}

/* 注册登录 end */

/* 第三方登录 start */
.third-wapper {
	width: 100%;
	/* 固定底部 */
	/* bottom: 0;
	position: fixed; */
	
	margin-top: 60upx;
	
}

.third-line {
	display: flex;
	flex-direction: row;
	justify-content: center
}

.third-words {
	color: #A9A9A9;
	font-size: 13px;
	
	display: flex;
	flex-direction: column;
	justify-content: center;
}

.single-line {
	padding: 15upx 20upx;
	width: 25%;
	align-items: center;
}

.third-icos-wapper {
	margin-top: 30upx;
	
	display: flex;
	flex-direction: row;
	justify-content: center
}

.third-ico {
	width: 60upx;
	height: 60upx;
}

.third-btn-ico {
	background-image:url(http://122.152.205.72:88/group1/M00/00/05/CpoxxFxFO-yAOjTaAAATCIZEzRU503.png);
	width: 60upx;
	height: 60upx;
	background-color: white;
	background-size: 60upx 60upx;
	background-repeat:no-repeat;
	border:none;
	padding: 0;
}
button::after{
	border: none;
}
/* 第三方登录 end */
</style>
