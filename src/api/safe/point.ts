import service from "@/utils/request"

/**
 *  修改添加巡检项目
 * @param dataForm 巡检项目对象
 * @returns promis对象
 */
export const usePointSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/safe/point', dataForm)
	} else {
		return service.post('/safe/point', dataForm)
	}
}

export const usePointApi = (id: number) => {
	return service.get('/safe/point/' + id)
}

export const useCommuntiySearchApi=()=>{
    return service.get('/safe/point/communties')
    
}