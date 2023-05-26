import service from '@/utils/request'

/**
 * 根据id查询巡检项目
 * @param id  巡检项目id
 * @returns 返回Promise对象
 */
export const useInspectionApi = (id: number) => {
	return service.get('/safe/inspectionitem/' + id)
}

/**
 *  修改添加巡检项目
 * @param dataForm 巡检项目对象
 * @returns promis对象
 */
export const useInspectionSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/safe/inspectionitem', dataForm)
	} else {
		return service.post('/safe/inspectionitem', dataForm)
	}
}