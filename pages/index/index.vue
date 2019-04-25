<template>
	<view class="page">
		<view class="search" @click="toSearch">
			<mSearch :show="false" backgroundColor="transparent" class="mySearch" :disabled="true"></mSearch>
		</view>
		<!-- 轮播图 start-->
		<swiper :indicator-dots="true" :autoplay="true" :circular="true" class="carousel">
			<swiper-item v-for="item in imgList" :key="item.id" @click="toMovieInfo(item.movieId)">
				<image :src="item.image" class="img"></image>
			</swiper-item>
		</swiper>
		<!-- 轮播 end -->
		<!-- 热门推荐 start-->
		<view class="bac-white hot">
			<view class="wrapper">
				<image src="../../static/img/icos/hot.png" class="icon"></image>
				<view class="title">
					热门推荐
				</view>
			</view>
		</view>
		<scroll-view scroll-x="true" class="hot-content bac-white">
			<view class="single-poster" v-for="(item, index) in hotList" :key="index" @click="toMovieInfo(item.id)">
				<view class="wrapper">
					<image :src="item.cover" class="poster-image"></image>
					<view class="name">
						{{item.name}}
					</view>
					<view class="rate">
						<uni-rate :value="item.score/2" size="14" margin="0" :disabled="true"></uni-rate>					
						<view class="text-rate">
							{{item.score}}
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<!-- 热门推荐 end -->
		<!-- 热门预告 start -->
		<view class="bac-white hot">
			<view class="wrapper">
				<image src="../../static/img/icos/yugao.png" class="icon"></image>
				<view class="title">
					热门预告
				</view>
			</view>
		</view>
		<scroll-view scroll-x="true" class="hot-content bac-white">
			<view v-for="item in trailerList" :key="item.id" class="single-poster">
				<view class="wrapper">
					<video 
					:id="item.id"
					class="movie"
					:poster="item.poster"
					:src="item.trailer"
					controls
					@play="myPlay(item.id)"
					>
					</video>
				</view>
			</view>
		</scroll-view>
		<!-- 热门预告 end -->
		<!-- 猜你喜欢 start-->
		<view class="bac-white hot">
			<view class="wrapper">
				<image src="../../static/img/icos/like.png" class="icon-like"></image>
				<view class="title">
					猜你喜欢
				</view>
			</view>
		</view>
		<view class="like-content bac-white" v-for="(item,index) in likeList" :key="item.id"  v-if="likeList && likeList.length">
			<image :src="item.cover" class="like-image" @click="toMovieInfo(item.id)"></image>
			<view class="movie-desc" @click="toMovieInfo(item.id)">
				<view class="title">{{item.name}}</view>
				<uni-rate :value="item.score/2" size="14" margin="0" :disabled="true"></uni-rate>
				<view class="tag">{{item.basicInfo}}</view>
				<view class="tag">{{item.releaseDate}}</view>
			</view>
			<view class="praise" @click="praise(index)">
				<image src="../../static/img/icos/praise.png" class="head"></image>
				<view class="click">点赞</view>
				<!-- #ifdef APP-PLUS || MP-WEIXIN -->
				<view :animation="animationDataArr[index]" class="animation-opacity click">+1</view>
				<!-- #endif -->
				<!-- #ifdef H5 -->
				<view class="animation-opacity click" :class="[
				{'animation-praise': currentIndex === index ? true : false }
				] ">+1</view>
				<!-- #endif -->
			</view>
		</view>
		<!-- 猜你喜欢 end -->
	</view>
</template>

<script>
import uniRate from "@/components/uni-rate/uni-rate.vue"
import mSearch from '@/components/mehaotian-search/mehaotian-search.vue'
export default {
	components: {
		uniRate,
		mSearch
	},
	data() {
		return {
			imgList: [],
			hotList: [],
			trailerList: [],
			likeList: [],
			animationData: {},
			animationDataArr: [],
			currentIndex: null
		}
	},
	onReady() {
		
	},
	onLoad() {
		uni.showLoading({
			title: '加载中'
		})
		// #ifdef APP-PLUS || MP-WEIXIN
		// 初始化动画对象 h5端不支持
		this.animation = uni.createAnimation({})
		// #endif
		// 获取轮播
		this.getCarousel()
		// 获取热门推荐
		this.getHotMovie('superhero')
		// 获取热门预告
		this.getHotMovie('trailer')
		// 获取猜你喜欢数据
		this.getLike()
	},
	// 下拉监听
	onPullDownRefresh() {
		this.getCarousel()
		this.getLike()
	},
	onUnload() {
		// 清除动画
	},
	methods: {
		myPlay(id) {
			// #ifndef MP-ALIPAY || MP-TOUTIAO
			let videContext = uni.createVideoContext(id)
			this.trailerList.forEach(v => {
				if(v.id !== id) {
					uni.createVideoContext(v.id).pause()
				}
			})
			// #endif
		},
		toSearch() {
			uni.switchTab({
				url: '../search/search'
            })
		},
		getCarousel() {
			let api = "/index/carousel/list"
			this.$http.post({api}).then(res => {
				this.imgList = res
			})
		},
		// 获取电影
		getHotMovie(type) {
			let api = "/index/movie/hot"
			this.$http.post({api, params: {type}}).then(res => {
				if(type === 'superhero') {
					this.hotList = res
				} else {
					this.trailerList = res
				}
			})
		},
		// 获取猜你喜欢
		getLike() {
			let api = '/index/guessULike'
			this.$http.post({api}).then(res => {
				this.likeList = res
				uni.stopPullDownRefresh()
				setTimeout(function () {
					uni.hideLoading();
				}, 500)
			})
		},
		// 点赞
		praise(index) {
			this.currentIndex = index
			setTimeout(() => {
				this.currentIndex = null
			}, 300)
			// #ifdef APP-PLUS || MP-WEIXIN
			// 动画
			this.animation.translateY(-62).opacity(1).step({
				duration: 300
			})
			// 导出动画
			this.animationData = this.animation
			this.animationDataArr[index] = this.animationData.export()
			// 还原动画
			setTimeout(() => {
				this.animation.translateY(0).opacity(0).step({
					duration: 0
				})
			this.animationDataArr[index] = this.animationData.export()
			}, 500)
			// #endif
		},
		// 跳转电影详情页
		toMovieInfo(id) {
			uni.navigateTo({
				url: '../movie/movie?vid=' + id
			})
		}
		
	}
}
</script>

<style lang="scss">
	.search{
		width: 600upx;
		position: absolute;
		/* #ifndef MP */
		top: 20upx;
		/* #endif */
		/* #ifdef MP */
		top: 0;
		/* #endif */
		left: 50%;
		transform: translateX(-50%);
		z-index: 9999;
		border-bottom: 0upx !important;
	}
	.active{
		.button-item{
			color: #fff !important;
		}
	}
	.carousel{
		width: 100%;
		height: 440upx;
		.img{
			width: 100%;
			height: 100%;
		}
	}
	// 热门推荐
	.hot{
		.wrapper{
			display: flex;
			align-items: center;
			justify-items: center;
			padding: 15upx;
			.icon{
				height: 50upx;
				width: 50upx;
			}
			.icon-like{
				width: 45upx;
				height: 45upx;
				padding-top: 5upx;
				padding-left: 5upx;
			}
			.title{
				font-size: 40upx;
				margin-left: 15upx;
				font-weight: 900;
			}
		}
	}
	// 热门推荐内容
	.hot-content{
		width: 100%;
		white-space: nowrap;
		.single-poster{
			display: inline-block;
			margin-left: 20upx;
			line-height: 40upx;
			&:last-child{
				margin-right: 20upx;
			}
			.wrapper{
				display: flex;
				flex-direction: column;
				.poster-image{
					width: 200upx;
					height: 270upx;
				}
				.name{
					font-weight: bold;
					margin-top: 10upx;
					text-align: center;
					width: 200upx;
					font-size: 28upx;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
				.rate{
					width: 200upx;
					display: flex;
					align-items: center;
					justify-content: center;
					.text-rate{
						font-size: 24upx;
						color: coral;
					}
				}
			}
		}
	}
	.movie{
		width: 350upx;
		height: 220upx;
	}
	.like-content{
		display: flex;
		padding: 20upx;
		.like-image{
			height: 240upx;
			width: 180upx;
			border-radius: 3%;
		}
		.movie-desc{
			width: 360upx;
			padding: 0upx 20upx;
			line-height: 45upx;
			.title{
				font-size: 32upx;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
			.tag{
				font-size: 26upx;
				color: #808080;
			}
		}
		.praise{
			flex: 1;
			border-left: 2px dashed #dbdbda;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			.head{
				height: 62upx;
				width: 62upx;
			}
			.click{
				font-size: 28upx;
				color: #feab2a;
			}
			.animation-opacity{
				transition: all .4s;
				font-weight: bold;
				opacity: 0;
			}
			.animation-praise{
				opacity: 1;
				transform: translateY(-150upx);
			}
		}
	}
</style>
