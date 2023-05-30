<template>
	<el-card>
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item>
				<el-input v-model="state.queryForm.communityName" placeholder="社区名称"></el-input>
				<!-- <fast-select v-model="state.queryForm.communityName" clearable placeholder="社区名称"></fast-select> -->
			</el-form-item>
			<el-form-item>
				<el-input v-model="state.queryForm.address" placeholder="社区地址" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList()">查询</el-button>
			</el-form-item>
			<el-form-item>
				<el-button v-auth="'sys:community:save'" type="primary" @click="addOrUpdateHandle()">新增</el-button>
			</el-form-item>
			<el-form-item>
				<el-button v-auth="'sys:community:delete'" type="danger" @click="deleteBatchHandle()">删除</el-button>
			</el-form-item>
			<el-form-item v-auth="'sys:community:import'">
				<el-upload :action="constant.uploadCommunityExcelUrl" :before-upload="beforeUpload" :on-success="handleSuccess" :show-file-list="false">
					<el-button type="info">导入</el-button>
				</el-upload>
			</el-form-item>
			<el-form-item>
				<el-button v-auth="'sys:community:export'" type="success" @click="downloadExcel()">导出</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%" @selection-change="selectionChangeHandle">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<!-- <el-table-column prop="id" label="编号" header-align="center" align="center" width="80"></el-table-column> -->
			<fast-table-column prop="communityName" label="社区名称" dict-type="sms_platform"></fast-table-column>
			<el-table-column prop="address" label="社区地址" header-align="center" align="center"></el-table-column>
			<el-table-column prop="communityImgs" label="社区图片" header-align="center" align="center">
				<template #default="scope">
					<el-image :src="scope.row.communityImgs" alt="图片" class="w-[40px] h-[20px]" />
				</template>
			</el-table-column>
			<el-table-column prop="coverArea" label="社区面积" align="center"></el-table-column>
			<el-table-column prop="content" label="备注" align="center"></el-table-column>
			<el-table-column prop="createTime" label="创建时间" header-align="center" align="center"></el-table-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
				<template #default="scope">
					<el-button v-auth="'sys:community:update'" type="primary" link @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
					<el-button v-auth="'sys:community:delete'" type="primary" link @click="deleteBatchHandle(scope.row.id)">删除</el-button>
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

<script setup lang="ts">
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
	dataListUrl: '/sys/community/page',
	deleteUrl: '/sys/community/delete',
	queryForm: {
		address: '',
		communityName: ''
	}
})

const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}

const downloadExcel = () => {
	//exportBuilding()
	const url = constant.apiUrl + '/sys/community/export?accessToken=' + cache.getToken()
	axios
		.get(url, { responseType: 'blob' })
		.then(response => {
			const filename = 'data.xlsx' // 下载文件的默认文件名
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
//导入
// const uploadUserExceUrl =
// const url = constant.apiUrl + '/sys/community/export?accessToken=' + cache.getToken()

// const handleSuccess = () => {
//   ElMessage.success({
//     message: '上传成功！',
//     duration: 500,
//     onClose: () => {
//       getData()
//     }
//   })
// }

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle } = useCrud(state)
</script>

<style scoped></style>
