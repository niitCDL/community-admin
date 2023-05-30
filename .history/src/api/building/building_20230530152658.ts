import service from '@/utils/request'
import cache from '@/utils/cache'
import constant from '@/utils/constant'
import axios from 'axios'

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
export function getBuildingList() {
	return service.get('sys/building/list')
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
export function importBuilding(file: any) {
	return service.post('/sys/building/import', file)
}
const http = axios.create({
	baseURL: constant.apiUrl + '/sys/building/export?accessToken=' + cache.getToken(),
	headers: { Authorization: getToken() }
  })
export const exportBuilding = () => {
	  return http({
		method: 'get',
		url: '/sys/building/export',
		responseType: 'blob'
	  })
	//return service.get('/sys/building/export')
	//location.href = constant.apiUrl + '/sys/building/export?accessToken=' + cache.getToken()
}