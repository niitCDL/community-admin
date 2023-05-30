import service from "@/utils/request"

/**
 *  修改添加巡检项目
 * @param dataForm 巡检项目对象
 * @returns promis对象
 */
export const usePathSubmitApi = (dataForm: any) => {
	console.log("aa------------------"+dataForm.pointIds);
	
	if (dataForm.id) {
		return service.put('/safe/path', dataForm)
	} else {
		return service.post('/safe/path', dataForm)
	}
}

export const usePathApi = (id: number) => {
	return service.get('/safe/path/' + id)
}

export const usePointSearchApi=(communityId:any)=>{
    return service.get('/safe/path/points/'+communityId)
    
}

export const useItemsSearchApi=(communityId:any)=>{
    return service.get('/safe/path/items/'+communityId)
    
}

export const usePointByIds=(elementIds:Array<Number>)=>{
	return service.get('/safe/path/point/'+elementIds)
}