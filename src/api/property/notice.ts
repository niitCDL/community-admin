import service from '@/utils/request'

export const useNoticeApi = (id: number) => {
	return service.get('/property/notice/' + id)
}

export const useNoticeSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/property/notice', dataForm)
	} else {
		return service.post('/property/notice', dataForm)
	}
}