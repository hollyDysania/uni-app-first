<template>
	<view class="movie-page page" v-if="movieInfo">
		<!-- 预告片 -->
		<view class="player">
			<video 
			id="myMovie"
			class="movie"
			:src="movieInfo.trailer"
			:poster="movieInfo.poster"
			controls
			></video>
		</view>
		<!-- 概述 -->
		<view class="desc">
			<navigator :url="'../cover-image/cover-image' + '?list=' + movieInfo.cover" open-type="navigate">
				<image :src="movieInfo.cover" class="movie-image"></image>
			</navigator>
			<view class="movie-desc">
				<view class="title">{{movieInfo.name}}</view>
				<view class="tag">{{movieInfo.originalName}}</view>
				<view class="tag">{{movieInfo.basicInfo}}</view>
				<view class="tag">{{movieInfo.totalTime}}</view>
				<view class="tag">{{movieInfo.releaseDate}}</view>
			</view>
		</view>
		<!-- 评分点赞数 -->
		<view class="rate-prised">
			<view class="title">综合评分：</view>
			<view class="content">
				<view class="rate">
					{{movieInfo.score}}
				</view>
				<view class="line"></view>
				<view class="prised">
					<uni-rate :value="movieInfo.score/2" size="24" margin="0" :disabled="true"></uni-rate>
					{{movieInfo.prisedCounts}}人点赞
				</view>
			</view>
		</view>
		<!-- 演员表 -->
		<view class="introduction">
			<view class="title">演员表</view>
			<scroll-view scroll-x="true" class="actor">
				<view class="actor-wrapper" v-for="(item, index) in actorList" :key="index" @click="preview(item.photo, actorImageList)">
					<image :src="item.photo" class="actor-image" mode="aspectFill"></image>
					<view class="name">
						{{item.name}}
					</view>
					<view class="name">{{item.actName}}</view>
				</view>
			</scroll-view>
		</view>
		<!-- 简介 -->
		<view class="introduction">
			<view class="title">剧情介绍</view>
			<text class="desc">{{movieInfo.plotDesc}}</text>
		</view>
		<!-- 剧照 -->
		<view class="introduction">
			<view class="title">剧照</view>
			<scroll-view scroll-x="true" class="actor">
				<view class="actor-wrapper" v-for="(item, index) in plotPics" :key="index" @click="preview(item, plotPics)">
					<image :src="item" class="movie-image" mode="aspectFill"></image>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
import uniRate from "@/components/uni-rate/uni-rate.vue"
export default {
	components: {
		uniRate
	},
	data() {
		return {
			vid: '',
			movieInfo: null,
			actorList: [],
			plotPics: []
		}
	},
	computed: {
		// 演员图片数组
		actorImageList() {
			return this.actorList.map(v => {
				return v.photo
			})
		}
	},
	// #ifndef MP-ALIPAY || MP-TOUTIAO
	// 页面初次渲染
	onReady() {
		// 创建视频上下文
		this.videoContext = uni.createVideoContext('myMovie')
		uni.showLoading({
			title: '加载中'
		})
	},
	onHide() {
		// 页面隐藏时 暂停播放
		this.videoContext.pause()
	},
	onShow() {
		// 再次显示继续播放
		this.videoContext && this.videoContext.play()
	},
	// #endif
	onLoad(query) {
		this.setNavBar()
		this.vid = query.vid
		this.getMovieInfo()
		this.getActors()
	},
	// 各端小程序 分享至好友或微信群
	onShareAppMessage(res) {
		return {
			title: this.movieInfo.name,
			path:  `http://47.96.100.173/movie/pages/movie/movie?vid=${this.vid}`
		}
	},
	// 监听导航栏 （pages.json中的导航栏配置对应）
	onNavigationBarButtonTap(e) {
		let _index = e.index
		if(_index !== 0) return
		uni.share({
			provider: "weixin",
			scene: "WXSenceTimeline",
			type: 0,
			href: `http://47.96.100.173/holly_movie?vid=${this.vid}`,
			title: `Holly Movie: 《${this.movieInfo.name}》`,
			summary: `Holly Movie: 《${this.movieInfo.name}》`,
			imageUrl: this.movieInfo.cover,
			success: function (res) {
				console.log("success:" + JSON.stringify(res));
			}
		})
	},
	methods: {
		// 导航栏配置
		setNavBar() {
			uni.setNavigationBarColor({
				frontColor: "#ffffff",
				backgroundColor: "#000000"
			})
		},
		// 电影详情
		getMovieInfo() {
			let api = '/search/trailer/' + this.vid
			this.$http.post({api}).then(res => {
				this.movieInfo = res
				this.plotPics = JSON.parse(res.plotPics)
				setTimeout(function () {
					uni.hideLoading()
				}, 500)
			})
		},
		// 获取演员
		getActors() {
			let api = `search/staff/${this.vid}/2`
			this.$http.post({api}).then(res => {
				this.actorList = res
			})
		},
		// 图片预览
		preview(current, urls) {
			uni.previewImage({
				current: current,
				urls: urls,
				indicator: "number"
			})
		}
	}
}
</script>

<style lang="scss">
.movie-page{
	.player{
		display: flex;
		justify-content: center;
		background-color: black;
		.movie{
			width: 100%;
			height: 440upx;
		}
	}
	.desc{
		display: flex;
		margin: 20upx;
		.movie-image{
			height: 270upx;
			width: 200upx;
			border-radius: 3%;
			// 防止图片被挤压
			flex-shrink: 0;
		}
		.movie-desc{
			display: flex;
			flex-direction: column;
			justify-content: center;
			padding: 0upx 20upx;
			line-height: 45upx;
			.title{
				margin-bottom: 10upx;
				font-size: 42upx;
				font-weight: bold;
			}
			.tag{
				font-size: 26upx;
				color: #808080;
			}
		}
	}
	.rate-prised{
		box-shadow: 0px 0px 10px rgba(0,0,0,0.1);
		margin: 0 20upx;
		padding: 20upx;
		background-color: #F4F4EC;
		border-radius: 3%;
		.title{
			color: #9B9B9B;
			font-size: 24upx;
		}
		.content{
			padding: 20upx;
			display: flex;
			.rate{
				font-size: 60upx;
				color: #FFC152;
				text-align: center;
				width: 240upx;
			}
			.prised{
				display: flex;
				width: 100%;
				flex-direction: column;
				justify-content: space-around;
				align-items: center;
				color: #9B9B9B;
				font-size: 24upx;
			}
			
		}
	}
	.introduction{
		margin: 20upx;
		.title{
			color: #007722;
			font-size: 30upx;
		}
		.desc{
			text-indent: 2em;
			color: #111;
			font-size: 24upx;
		}
		.actor{
			white-space: nowrap;
			.actor-wrapper{
				display: inline-block;
				margin-right: 15upx;
				padding: 20upx 0;
				.actor-image{
					width: 170upx;
					height: 240upx;
				}
				.movie-image{
					width: 340upx;
					height: 240upx;
				}
				.name{
					font-size: 26upx;
					color: #808080;
					text-align: center;
				}
			}
		}
	}
}
</style>
