import service from '@/utils/request'
export const useMallApi = (id: number) => {
	return service.get('/sys/mall/' + id)
}


export const useMallSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/sys/mall', dataForm)
	} else {
		return service.post('/sys/mall', dataForm)
	}
}

// export function getCommunityPage(page: number, limit: number, communityName: any) {
// 	return service.get(`/sys/community/page?page=${page}&limit=${limit}&communityName=${communityName}`)
// }
export function getMallList() {
	return service.get('/sys/mall/list')
}
export function getUserList() {
	return service.get('/one/user/list')
}
// export function saveMall(data: any) {
// 	return service.post('/mall', data)
// }
// export function updateMall(data: any) {
// 	return service.put('/mall', data)
// }
// export function deleteMall(id: any) {
// 	return service.delete(`/mall/${id}`)
// }
// export function deleteMallBatch(ids: any) {
// 	return service.delete(`/mall`, ids)
// }
export function importMall(file: any) {
	return service.post('/sys/mall/import', file)
}
// export function exportMall() {
// 	return service.get('/sys/mall/export')
// }