import service from '@/utils/request'
export const useCommunityApi = (id: number) => {
	return service.get('/sys/community/' + id)
}


export const useCommunitySubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/sys/community', dataForm)
	} else {
		return service.post('/sys/community', dataForm)
	}
}

// export function getCommunityPage(page: number, limit: number, communityName: any) {
// 	return service.get(`/sys/community/page?page=${page}&limit=${limit}&communityName=${communityName}`)
// }
export function getCommunityList() {
	return service.get('/sys/community/list')
}
// export function saveCommunity(data: any) {
// 	return service.post('/community', data)
// }
// export function updateCommunity(data: any) {
// 	return service.put('/community', data)
// }
// export function deleteCommunity(id: any) {
// 	return service.delete(`/community/${id}`)
// }
// export function deleteCommunityBatch(ids: any) {
// 	return service.delete(`/community`, ids)
// }
export function importCommunity(file: any) {
	return service.post('/community/import', file)
}
// export function exportCommunity() {
// 	return service.get('/community/export')
// }