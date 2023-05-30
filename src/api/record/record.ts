import service from '@/utils/request'

export const useRecordApi = (id: number) => {
	return service.get('/sys/record/' + id)
}

export const useRecordSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/sys/record', dataForm)
	} else {
		return service.post('/sys/record', dataForm)
	}
}