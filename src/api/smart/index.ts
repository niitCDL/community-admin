import service from '@/utils/request'

export const useSmartApi = (id: number) => {
	return service.get('/smart/deviceType/' + id)
}

export const useSmartSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/smart/deviceType', dataForm)
	} else {
		return service.post('/smart/deviceType', dataForm)
	}
}

export const getEnabledTypeList = () => {
	return service.get('/smart/deviceType/list')
}

export const useDeviceApi = (id: number) => {
	return service.get('/smart/device/' + id)
}

export const useDeviceSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/smart/device', dataForm)
	} else {
		return service.post('/smart/device', dataForm)
	}
}
