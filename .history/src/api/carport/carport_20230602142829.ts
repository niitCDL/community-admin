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
export function getParkList() {
	return service.get('sys/park/list')
}
export function getOwnerList() {
	return service.post('one/owner/list')
}
export function getCarList() {
	return service.get('sys/car/list')
}
export function getCarList() {
	return service.get('sys/car/list')
}
export function getCarList() {
	return service.get('sys/car/list')
}