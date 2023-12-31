import service from '@/utils/request'
export const useCarApi = (id: number) => {
	return service.get('/sys/car/' + id)
}


export const useCarSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/sys/car', dataForm)
	} else {
		return service.post('/sys/car', dataForm)
	}
}
export function getUserList() {
	return service.post('one/user/list')
}
export function getCarVO(id: any) {
	return service.get(`sys/car/VO/${id}`)
}