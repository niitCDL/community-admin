import service from '@/utils/request'

/**
 * 根据id查询巡更计划
 * @param id  巡更计划id
 * @returns 返回Promise对象
 */
export const usePlanApi = (id: number) => {
	return service.get('/safe/plan/' + id)
}

/**
 * 根据小区获取该小区的巡更线路
 * @returns 返回Promise对象
 */
export const useGetPathListByComm = () => {
	return service.get('/sys/path/index/communityid')
}

/**
 * 根据角色id获取角色
 * @param id  小区id
 * @returns 返回Promise对象
 */
export const useUserListByRoleId = (id: number) => {
	return service.get('/sys/role/user/' + id)
}
/**
 *  修改添加巡更计划
 * @param dataForm 巡更计划对象
 * @returns promis对象
 */
export const usePlanSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/safe/plan', dataForm)
	} else {
		return service.post('/safe/plan', dataForm)
	}
}

