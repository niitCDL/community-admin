export const isExternalLink = (path: string): boolean => {
	return /^(https?:|mailto:|tel:)/.test(path)
}

export const validateEmail = (rule: any, value: any, callback: (e?: Error) => any) => {
	const reg =
		/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

	if (reg.test(value)) {
		callback()
	} else {
		callback(new Error('邮箱格式错误'))
	}
}

export const validatePassword = (rule: any, value: any, callback: (e?: Error) => any) => {
	if (value.length < 4) {
		callback(new Error('密码长度不足4位'))
	} else {
		callback()
	}
}

export const validateMobile = (mobile: string): boolean => {
	return /^1[3456789]\d{9}$/.test(mobile)
}
