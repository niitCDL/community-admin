import service from '@/utils/request'

export const useRecordApi = (id: number) => {
	return service.get('/soft2242/record/' + id)
}

export const useRecordSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/soft2242/record', dataForm)
	} else {
		return service.post('/soft2242/record', dataForm)
	}
}