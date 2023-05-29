import service from '@/utils/request'

export const useParkApi = (id: number) => {
	return service.get('/sys/park/' + id)
}

export const useParkSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/sys/park', dataForm)
	} else {
		return service.post('/sys/park', dataForm)
	}
}