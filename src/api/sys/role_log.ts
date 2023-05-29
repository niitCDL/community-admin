import service from '@/utils/request'


export const useRoleLogUpdate = (dataForm: any) => {
	return service.put('/sys/role/log', dataForm)
}
export const useRoleLogApi = (id: number) => {
	return service.get('/sys/role/log/' + id)
}