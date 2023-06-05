import appPackage from '../../package.json'
import cache from '@/utils/cache'

/**
 * 常量
 */
export default {
	// 应用标题
	appTitle: '智慧社区',

	// 收缩标题
	logoTitle: 'Smart',

	// 描述信息
	appDesc: '基于 Vue3、TypeScript、Element Plus、Vue Router、Pinia、Axios、Vite 等开发的智慧社区后台管理系统',

	// 版本号
	version: appPackage.version,

	// API 地址
	apiUrl: import.meta.env.VITE_API_URL,

	// 文件上传地址
	uploadUrl: import.meta.env.VITE_API_URL + '/sys/file/upload?accessToken=' + cache.getToken(),

	// 导入用户 excel 文件
	uploadUserExcelUrl: import.meta.env.VITE_API_URL + '/sys/user/import?accessToken=' + cache.getToken(),

	// 环境变量
	env: {
		DEV: import.meta.env.DEV,
		PROD: import.meta.env.PROD
	}
}
