import service from '@/utils/request'

export function getCommunityPage(page: number, limit: number, communityName: any) {
	return service.get(`/sys/community/page?page=${page}&limit=${limit}&communityName=${communityName}`)
}
export function getCommunityList() {
	return service.get('/sys/community/list')
}
