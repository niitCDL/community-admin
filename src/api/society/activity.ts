import service from '@/utils/request'
import cache from '@/utils/cache'
import constant from '@/utils/constant'
export const useDeleteApi = (id: number) => {
	return service.put('/soft2242/activity/type/delete/' + id)
}
export const useDeleteActivityApi = (id: number) => {
	return service.put('/soft2242/activity/delete/' + id)
}

// 活动修改新增
export const useActivitySubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/soft2242/activity', dataForm)
	} else {
		return service.post('/soft2242/activity', dataForm)
	}
}
// 活动类型修改新增
export const useActivityTypeSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/soft2242/activity/type', dataForm)
	} else {
		return service.post('/soft2242/activity/type', dataForm)
	}
}

export const useStatusApi = (id: number) => {
	return service.put('/soft2242/activity/type/status/' + id)
}
export const useActivityStatusApi = (id: number) => {
	return service.put('/soft2242/activity/status/' + id)
}

export const useTypeApi = (id: number) => {
	return service.get('/soft2242/activity/type/' + id)
}
export const useActivityListApi = () => {
	return service.get('/soft2242/activity/ActivityList')
}
export const useActivityTypeListApi = () => {
	return service.get('/soft2242/activity/type/TypeList')
}
