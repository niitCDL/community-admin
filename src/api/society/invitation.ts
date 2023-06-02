import service from '@/utils/request'
import cache from '@/utils/cache'
import constant from '@/utils/constant'
export const useInvHistoryApi = (id: number) => {
	return service.get('/soft2242/visitor/' + id)
}
export const useActivityListApi = () => {
	return service.get('')
}
export const useActivityTypeListApi = () => {
	return service.get('')
}
