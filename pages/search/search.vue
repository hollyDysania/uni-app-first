<template>
	<view class="page search-page">
		<mSearch :show="false" @search="search($event)" placeholder="搜预告" backgroundColor="#C6C6C6" class="search-movie"></mSearch>
		<view class="bac-white hot">
			<view class="wrapper">
				<image src="../../static/img/icos/timeline.png" class="icon-like"></image>
				<view class="title">
					热门搜索
				</view>
			</view>
		</view>
		<view class="like-content bac-white" v-for="item in searchList" :key="item.id" @click="toMovieInfo(item.id)">
			<image :src="item.cover" class="like-image"></image>
			<view class="movie-desc">
				<view class="title">{{item.name}}</view>
				<uni-rate :value="item.score/2" size="14" margin="0" :disabled="true"></uni-rate>
				<view class="tag">{{item.basicInfo}}</view>
				<view class="tag">{{item.releaseDate}}</view>
			</view>
		</view>
	</view>
</template>

<script>
import mSearch from '@/components/mehaotian-search/mehaotian-search.vue'
import uniRate from "@/components/uni-rate/uni-rate.vue"
export default {
    components: {
        mSearch,
		uniRate
    },
	data() {
		return {
			searchList: [],
			// 搜索内容
			keywords: '',
			page: 1,
			total: 1,
			pageSize: 9
			
		}
	},
	onLoad() {
		uni.showLoading({
			title: '加载中'
		})
		// 获取热门搜索
		this.getSearch()
	},
	onReachBottom() {
		this.page++
		console.log(this.total, this.searchList.length, 5555)
		if(this.total <= this.searchList.length) {
			uni.showToast({
				title: '已加载全部',
				duration: 500
			})
		} else {
			console.log('翻页')
			this.getSearch()
		}
		
	},
	methods: {
		// 搜索
		search(e, val) {
			// 清空原数据
			this.searchList = []
			this.keywords = e
			this.page = 1
			this.getSearch()
		},
		// 获取猜你喜欢
		getSearch() {
			uni.showLoading({
				title: '加载中'
			})
			let api = '/search/list'
			let params = {
				keywords: this.keywords,
				page: this.page,
				pageSize: this.pageSize
			}
			this.$http.post({api, params}).then(res => {
				let data = res.rows
				console.log('数据返回')
				this.searchList = this.searchList.concat(data)
				this.total = res.records
				let timer = null
				if(timer) {
					clearTimeout(timer)
				}
				timer = setTimeout(function () {
					uni.hideLoading()
				}, 500)
			})
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
.search-page{
	.hot{
		.wrapper{
			display: flex;
			align-items: center;
			justify-items: center;
			padding: 15upx;
			.icon-like{
				width: 45upx;
				height: 45upx;
				padding-top: 5upx;
				padding-left: 5upx;
			}
			.title{
				font-size: 35upx;
				margin-left: 15upx;
				color: #3F51B5;
			}
		}
	}
	.search-movie{
		width: 100%;
	}
	.like-content{
		display: flex;
		padding: 30upx 50upx;
		.like-image{
			height: 240upx;
			width: 180upx;
			border-radius: 3%;
		}
		.movie-desc{
			flex: 1;
			padding: 0upx 45upx;
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
	}
}
</style>
