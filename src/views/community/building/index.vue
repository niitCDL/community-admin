<template>
	<el-card>
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item>
				<el-input v-model="state.queryForm.communityName" placeholder="小区名称" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<el-input v-model="state.queryForm.units" placeholder="层数" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<el-input v-model="state.queryForm.buildingName" clearable placeholder="楼宇名称"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList()">查询</el-button>
			</el-form-item>
			<el-form-item>
				<el-button v-auth="'sys:building:save'" type="primary" @click="addOrUpdateHandle()">新增</el-button>
			</el-form-item>
			<el-form-item>
				<el-button v-auth="'sys:building:delete'" type="danger" @click="deleteBatchHandle()">删除</el-button>
			</el-form-item>
			<el-form-item v-auth="'sys:building:import'">
				<el-upload :action="uploadBuildingExceUrl" :before-upload="beforeUpload" :on-success="handleSuccess" :show-file-list="false">
					<el-button type="info">导入</el-button>
				</el-upload>
			</el-form-item>
			<el-form-item>
				<el-button v-auth="'sys:building:export'" type="success" @click="downloadExcel()">导出</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%" @selection-change="selectionChangeHandle">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<!-- <el-table-column type="index" label="编号" header-align="center" align="center" width="80"></el-table-column> -->
			<el-table-column prop="communityName" label="小区名称" header-align="center" align="center"></el-table-column>
			<el-table-column prop="buildingName" label="楼宇名称" header-align="center" align="center"></el-table-column>
			<el-table-column prop="units" label="层数" header-align="center" align="center" width="110"></el-table-column>
			<el-table-column prop="usedArea" label="占地面积" header-align="center" align="center"></el-table-column>
			<el-table-column prop="content" label="备注" header-align="center" align="center"></el-table-column>
			<el-table-column prop="createTime" label="创建时间" header-align="center" align="center" width="180"></el-table-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
				<template #default="scope">
					<el-button v-auth="'sys:building:update'" type="primary" link @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
					<el-button v-auth="'sys:building:delete'" type="primary" link @click="deleteBatchHandle(scope.row.id)">删除</el-button>
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
		<add-or-update ref="addOrUpdateRef" @refresh-data-list="getDataList"></add-or-update>
	</el-card>
</template>

<script setup lang="ts" name="SysUserIndex">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import AddOrUpdate from './add-or-update.vue'
import { IHooksOptions } from '@/hooks/interface'
import constant from '@/utils/constant'
import { useUserExportApi } from '@/api/sys/user'
import { ElMessage, UploadProps } from 'element-plus'
import { importBuilding, exportBuilding } from '@/api/building/building'
import axios from 'axios'
import cache from '@/utils/cache'

const state: IHooksOptions = reactive({
	dataListUrl: '/sys/building/page',
	deleteUrl: '/sys/building/delete',
	queryForm: {
		units: '',
		communityName: '',
		buildingName: ''
	}
})

const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}

//导入
const uploadBuildingExceUrl = constant.apiUrl + '/sys/building/import?accessToken=' + cache.getToken()
const downloadExcel = () => {
	//exportBuilding()
	const url = constant.apiUrl + '/sys/building/export?accessToken=' + cache.getToken()
	axios
		.get(url, { responseType: 'blob' })
		.then(response => {
			const filename = '楼宇信息.xlsx' // 下载文件的默认文件名
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

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle } = useCrud(state)
</script>
