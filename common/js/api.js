// 对uni.request二次封装
const baseUrl = 'https://www.imovietrailer.com/superhero/'
export const request = {
	post: function({api, method = "POST", params, header = {'content-type':'application/x-www-form-urlencoded'}}) {
		return new Promise((resolve, reject) => {
			let defaultParams = {
				// qq: 由于是使用的别人的接口 此处不公开展示
			}
			let data = Object.assign(defaultParams,params)
			let url = baseUrl + api
			uni.request({
				url,
				data,
				method,
				header,
				success: (res) => {
					if(res.data.status === 200) {
						resolve(res.data.data)
					} else {
						reject(res.data.msg)
					}
				}
			})
		})
	}
}
