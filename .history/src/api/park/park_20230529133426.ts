import service from '@/utils/request'

export const useParkApi = (id: number) => {
	return service.get('/admin-park/park/' + id)
}

export const useParkSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/admin-park/park', dataForm)
	} else {
		return service.post('/admin-park/park', dataForm)
	}
}