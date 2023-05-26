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

export const getDeviceList = () => {
	return service.get('/smart/device/list')
}

export const useMeterApi = (id: number) => {
	return service.get('/smart/meter/' + id)
}

export const useMeterSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/smart/meter', dataForm)
	} else {
		return service.post('/smart/meter', dataForm)
	}
}

export const useMonitorApi = (id: number) => {
	return service.get('/smart/monitor/' + id)
}

export const useMonitorSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/smart/monitor', dataForm)
	} else {
		return service.post('/smart/monitor', dataForm)
	}
}

export const useMonitorTypeApi = (id: number) => {
	return service.get('/smart/monitorType/' + id)
}

export const useMonitorTypeSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/smart/monitorType', dataForm)
	} else {
		return service.post('/smart/monitorType', dataForm)
	}
}

export const getEnabledMonitorTypeList = () => {
	return service.get('/smart/monitorType/list')
}
