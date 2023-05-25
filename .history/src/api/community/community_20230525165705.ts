import service from '@/utils/request'

export function getCommunityPage(page: number, limit: number, communityName: any) {
	return service.get(`/sys/community/page?page=${page}&limit=${limit}&communityName=${communityName}`)
}
export function getCommunityList() {
	return service.get('/sys/community/list')
}
// export const useSmsPlatformApi = (id: Number) => {
// 	return service.get('/message/sms/platform/' + id)
// }

// export const useSmsPlatformSubmitApi = (dataForm: any) => {
// 	if (dataForm.id) {
// 		return service.put('/message/sms/platform', dataForm)
// 	} else {
// 		return service.post('/message/sms/platform', dataForm)
// 	}
// }

// export const useSmsSendApi = (dataForm: any) => {
// 	return service.post('/message/sms/platform/send', dataForm)
// }