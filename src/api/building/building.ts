import service from '@/utils/request'

export const useBuildingApi = (id: number) => {
	return service.get('/sys/building/' + id)
}

export const useBuildingSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/sys/building', dataForm)
	} else {
		return service.post('/sys/building', dataForm)
	}
}
// export function saveBuilding(data: any) {
// 	return service.post('/building', data)
// }
// export function updateBuilding(data: any) {
// 	return service.put('/building', data)
// }
// export function deleteBuilding(id: any) {
// 	return service.delete(`/building/${id}`)
// }
// export function deleteBuildingBatch(ids: any) {
// 	return service.delete(`/building`, ids)
// }
// export function importBuilding(file: any) {
// 	return service.post('/building/import', file)
// }
// export function exportBuilding() {
// 	return service.get('/building/export')
// }