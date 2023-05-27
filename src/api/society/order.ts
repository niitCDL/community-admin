import service from '@/utils/request'
import cache from '@/utils/cache'
import constant from '@/utils/constant'

export const useUserExportApi = () => {
	location.href = constant.apiUrl + '/soft2242/order/export?accessToken=' + cache.getToken()
}
