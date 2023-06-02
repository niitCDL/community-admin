<template>
	<el-card>
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item>
				<el-input v-model="state.queryForm.licence" placeholder="车牌号" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<el-input v-model="state.queryForm.realName" placeholder="用户名字" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<el-input v-model="state.queryForm.brand" placeholder="品牌" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList()">查询</el-button>
			</el-form-item>
			<el-form-item>
				<el-button v-auth="'sys:car:save'" type="primary" @click="addOrUpdateHandle()">新增</el-button>
			</el-form-item>
			<el-form-item>
				<el-button v-auth="'sys:car:delete'" type="danger" @click="deleteBatchHandle()">删除</el-button>
			</el-form-item>
			<el-form-item v-auth="'sys:car:import'">
				<el-upload :action="uploadCarportExceUrl" :before-upload="beforeUpload" :on-success="handleSuccess" :show-file-list="false">
					<el-button type="info">导入</el-button>
				</el-upload>
			</el-form-item>
			<el-form-item>
				<el-button v-auth="'sys:car:export'" type="success" @click="downloadExcel()">导出</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%" @selection-change="selectionChangeHandle">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="realName" label="车主" header-align="center" align="center"></el-table-column>
			<el-table-column prop="phone" label="联系方式" header-align="center" align="center"></el-table-column>
			<el-table-column prop="licence" label="车牌号" header-align="center" align="center"></el-table-column>
			<el-table-column prop="brand" label="品牌" header-align="center" align="center"></el-table-column>
			<el-table-column prop="specification" label="型号" header-align="center" align="center" width="80"></el-table-column>
			<el-table-column prop="color" label="颜色" header-align="center" align="center" width="80"></el-table-column>
			<el-table-column prop="deadline" label="保险截止日期" header-align="center" align="center"></el-table-column>
			<el-table-column prop="annualTime" label="年审日期" header-align="center" align="center"></el-table-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="130">
				<template #default="scope">
					<el-button v-auth="'sys:car:update'" type="primary" link @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
					<el-button v-auth="'sys:car:delete'" type="primary" link @click="deleteBatchHandle(scope.row.id)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination
			:current-page="state.page"
			:page-sizes="state.pageSizes"
			:page-size="state.limit"
			:total="state.total"
			layout="total, sizes, prev, pager, next, jumper"
			@size-change="sizeChangeHandle"
			@current-change="currentChangeHandle"
		>
		</el-pagination>

		<!-- 弹窗, 新增 / 修改 -->
		<add-or-update ref="addOrUpdateRef" @refreshDataList="getDataList"></add-or-update>
	</el-card>
</template>

<script setup lang="ts" name="Admin-parkParkIndex">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import AddOrUpdate from './add-or-update.vue'
import { IHooksOptions } from '@/hooks/interface'
import constant from '@/utils/constant'
import { useUserExportApi } from '@/api/sys/user'
import { ElMessage, UploadProps } from 'element-plus'
import axios from 'axios'
import cache from '@/utils/cache'

const state: IHooksOptions = reactive({
	dataListUrl: '/sys/car/page',
	deleteUrl: '/sys/car/delete',
	queryForm: {
		realName: '',
		licence: '',
		brand: ''
	}
})

const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}

const downloadExcel = () => {
	useUserExportApi()
	return
}

const handleSuccess: UploadProps['onSuccess'] = (res, file) => {
	if (res.code !== 0) {
		ElMessage.error('上传失败：' + res.msg)
		return false
	}

	ElMessage.success({
		message: '上传成功',
		duration: 500,
		onClose: () => {
			getDataList()
		}
	})
}

const beforeUpload: UploadProps['beforeUpload'] = file => {
	if (file.size / 1024 / 1024 / 1024 / 1024 > 1) {
		ElMessage.error('文件大小不能超过100M')
		return false
	}
	return true
}
//导入
const uploadCarExceUrl = constant.apiUrl + '/sys/car/import?accessToken=' + cache.getToken()
//导出
const downloadExcel = () => {
	const url = constant.apiUrl + '/sys/carport/export?accessToken=' + cache.getToken()
	axios
		.get(url, { responseType: 'blob' })
		.then(response => {
			const filename = '车位信息.xlsx' // 下载文件的默认文件名
			const blob = new Blob([response.data])
			const link = document.createElement('a')
			link.href = URL.createObjectURL(blob)
			link.download = filename
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)
		})
		.catch(error => {
			console.error(error)
		})
}
const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle } = useCrud(state)
</script>
