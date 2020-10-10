import * as baseUrl from './baseUrl.js'
import http from '../utils/request.js'
import qs from 'qs'

const api = {
	getBannerList: () => http.get(baseUrl.GET_BANNER_LIST), // 获取banner
	guideApply: (params) => http.post(baseUrl.GUIDE_APPLY, params)
}
export default api