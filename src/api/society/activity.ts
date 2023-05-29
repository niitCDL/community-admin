import service from '@/utils/request'
import cache from '@/utils/cache'
import constant from '@/utils/constant'
export const useDeleteApi = (id: number) => {
	return service.put('/soft2242/activity/type/delete/' + id)
}

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

export const useTypeApi = (id: number) => {
	return service.get('/soft2242/activity/type/' + id)
}
