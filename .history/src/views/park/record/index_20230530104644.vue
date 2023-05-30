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
				<template #default="{ row }"> {{ row.duration }} 分钟 </template>
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
import { reactive, ref } from 'vue'
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

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle } = useCrud({
	...state,
	async getDataList() {
		this.dataListLoading = true
		const { code, data, total } = await this.$axios.post(this.dataListUrl, this.queryForm)
		this.dataListLoading = false
		if (code === 200) {
			this.total = total
			this.dataList = data.map((item: any) => {
				const entranceTime = moment(item.accessTime)
				const exitTime = moment(item.leaveTime)
				const durationMs = exitTime.diff(entranceTime)
				const durationMin = moment.duration(durationMs).asMinutes()
				return {
					...item,
					duration: durationMin.toFixed(0) // 四舍五入到最近的整数
				}
			})
		}
	}
})
</script>
