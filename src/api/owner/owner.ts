import service from '@/utils/request'


export const apApply = (data:any) => {
	return service.post('/one/owner/approvedApply',{id:data})
}
export const reApply = (data:any) => {
	return service.post('/one/owner/refuseApply',{id:data})
}
export const oInfo = (id:any) =>{
	return service.get("/one/owner/"+id)
}
export const ownerFamily =(data:any)=>{
	return service.post("/one/owner/findFamily",data, {headers : {'Content-Type': 'application/x-www-form-urlencoded'}})
}
export const deFamily=(data:any)=>{
	return service.post("/one/owner/deFamily",{id:data}, {headers : {'Content-Type': 'application/x-www-form-urlencoded'}})
}