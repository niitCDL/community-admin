import service from '@/utils/request'


export const apApply = (data:any) => {
	return service.post('/one/owner/approvedApply',{id:data})
}
export const reApply = (data:any) => {
	return service.post('/one/owner/refuseApply',{id:data})
}