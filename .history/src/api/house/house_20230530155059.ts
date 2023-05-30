import service from '@/utils/request'
export const useHouseApi = (id: number) => {
	return service.get('/sys/house/' + id)
}


export const useHouseSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/sys/house', dataForm)
	} else {
		return service.post('/sys/house', dataForm)
	}
}
export function importHouse(file: any) {
	return service.post('/sys/house/import', file)
  }