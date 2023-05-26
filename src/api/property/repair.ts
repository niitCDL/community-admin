import service from '@/utils/request'

export const useRepairApi = (id: number) => {
	return service.get('/property/repair/' + id)
}

export const useRepairSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/property/repair', dataForm)
	} else {
		return service.post('/property/repair', dataForm)
	}
}