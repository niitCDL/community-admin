import service from '@/utils/request'
export const useCarportApi = (id: number) => {
	return service.get('/sys/carport/' + id)
}


export const useCarportSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/sys/carport', dataForm)
	} else {
		return service.post('/sys/carport', dataForm)
	}
}