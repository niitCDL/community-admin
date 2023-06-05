import service from '@/utils/request'

export const useComplaintApi = (id: number) => {
	return service.get('/property/complaint/' + id)
}

export const useComplaintSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/property/complaint', dataForm)
	} else {
		return service.post('/property/complaint', dataForm)
	}
}