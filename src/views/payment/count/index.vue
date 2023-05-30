<template>
	<el-card>
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item>
				<el-date-picker
					v-model="state.queryForm.createTime"
					type="datetime"
					placeholder="开始时间"
					format="YYYY/MM/DD hh:mm:ss"
					value-format="YYYY-MM-DD h:m:s a"
				/>
			</el-form-item>
			<el-form-item>
				<el-date-picker
					v-model="state.queryForm.endTime"
					type="datetime"
					placeholder="结束时间"
					format="YYYY/MM/DD hh:mm:ss"
					value-format="YYYY-MM-DD h:m:s a"
				/>
			</el-form-item>

			<el-form-item>
				<el-button @click="query()">查询</el-button>
			</el-form-item>
			<el-form-item>
				<el-button v-auth="'sys:user:export'" type="success" @click="downloadExcel()">导出</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%" @selection-change="selectionChangeHandle">
			<!-- <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column> -->
			<fast-table-column prop="endTime" label="时间" dict-type="user_gender"></fast-table-column>

			<el-table-column prop="communityName" label="小区" header-align="center" align="center"></el-table-column>
			<el-table-column prop="houseNumber" label="户号" header-align="center" align="center"></el-table-column>
			<el-table-column prop="propertyFee" label="物业费" header-align="center" align="center"></el-table-column>
			<el-table-column prop="electricFee" label="电费" header-align="center" align="center"></el-table-column>
			<el-table-column prop="waterFee" label="水费" header-align="center" align="center"></el-table-column>
			<el-table-column prop="count" label="合计金额" dict-type="user_gender"></el-table-column>
			<el-table-column prop="percent" label="支付率" dict-type="user_gender"></el-table-column>
		</el-table>
	</el-card>
</template>

<script setup lang="ts" name="SysUserIndex">
import { useCrud } from '@/hooks'
import { reactive, ref, onMounted } from 'vue'
// import { IHooksOptions } from '@/hooks/interface'
// import constant from '@/utils/constant'
import { useRecordExportApi } from '@/api/society/order'
import { ElMessage, UploadProps } from 'element-plus'
import cache from '@/utils/cache'
import axios from 'axios'

onMounted(() => {
	query()
})
const state = reactive({
	createdIsNeed: true,
	dataListLoading: true,
	dataListUrl: import.meta.env.VITE_API_URL + '/soft2242/order/record',
	dataList: [],
	queryForm: { createTime: '', endTime: '' }
})

const query = () => {
	if (!state.dataListUrl) {
		return
	}

	state.dataListLoading = true

	axios
		.get(state.dataListUrl)
		.then(res => {
			state.dataList = res.data.data
		})
		.finally(() => {
			state.dataListLoading = false
		})
}

const uploadUserExcelUrl = import.meta.env.VITE_API_URL + '/soft2242/order/import?accessToken=' + cache.getToken()

const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}

const downloadExcel = () => {
	useRecordExportApi()
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

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle } = useCrud(state)
</script>
