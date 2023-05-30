<template>
	<el-card>
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item>
				<el-input v-model="state.queryForm.parkName" placeholder="停车场名称" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<el-input v-model="state.queryForm.licence" placeholder="车牌号" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<el-input v-model="state.queryForm.doorName" placeholder="设备名称" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList()">查询</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%" @selection-change="selectionChangeHandle">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="parkName" label="停车场名称" header-align="center" align="center"></el-table-column>
			<el-table-column prop="licence" label="车牌号" header-align="center" align="center" width="130"></el-table-column>
			<el-table-column prop="doorName" label="设备名" header-align="center" align="center"></el-table-column>
			<el-table-column prop="accessTime" label="进入时间" header-align="center" align="center"></el-table-column>
			<el-table-column prop="leaveTime" label="离开时间" header-align="center" align="center"></el-table-column>
			<el-table-column label="停留时长" header-align="center" align="center">
				<template #default="{ row }"> {{ computedTime(row) }} 小时 </template>
			</el-table-column>
			<el-table-column prop="price" label="收费金额" header-align="center" align="center" width="100"></el-table-column>
			<el-table-column prop="type" label="车辆类型" header-align="center" align="center">
				<template #default="{ row }">
					<el-tag v-if="row.type == 0" type="success">临时车辆</el-tag>
					<el-tag v-if="row.type == 1" type="primary">固定车辆</el-tag>
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
	</el-card>
</template>

<script setup lang="ts" name="Soft2242RecordIndex">
import { useCrud } from '@/hooks'
import { reactive, ref, computed } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import moment from 'moment'
import { useRecordApi, useRecordSubmitApi } from '@/api/record/record'

const state: IHooksOptions = reactive({
	dataListUrl: '/sys/parkRecord/page',
	queryForm: {
		parkName: '',
		licence: '',
		doorName: '',
		type: '',
		duration: ''
	}
})
const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}
const computedTime = row => {
	let startTime = new Date(Date.parse(row.accessTime)).getTime()
	let endTime = new Date(Date.parse(row.leaveTime)).getTime()
	let time = endTime - startTime
	let second
	return hour
}
const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle } = useCrud(state)
</script>
