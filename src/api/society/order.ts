﻿import service from '@/utils/request'
import cache from '@/utils/cache'
import constant from '@/utils/constant'

export const useOrderExportApi = () => {
	location.href = constant.apiUrl + '/soft2242/order/export?accessToken=' + cache.getToken()
}
export const useRecordExportApi = () => {
	location.href = constant.apiUrl + '/soft2242/order/exportCount?accessToken=' + cache.getToken()
}

// export const useOrgListApi = () => {
// 	return service.get('/sys/org/list')
// }

export const useOrderSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/soft2242/order', dataForm)
	} else {
		return service.post('/soft2242/order', dataForm)
	}
}

export const useOrderApi = (id: number) => {
	return service.get('/soft2242/order/' + id)
}
export const useHouseListApi = () => {
	return service.get('/soft2242/order/list')
}
export const useCommunityListApi = () => {
	return service.get('/soft2242/order/community')
}
export const useDeleteORderApi = (id: number) => {
	return service.put('/soft2242/order/delete/' + id)
}
