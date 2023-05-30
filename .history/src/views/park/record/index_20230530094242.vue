<template>
	<el-card>
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item>
				<el-input v-model="state.queryForm.carId" placeholder="车辆id"></el-input>
			</el-form-item>
			<el-form-item>
				<el-input v-model="state.queryForm.doorId" placeholder="设备id"></el-input>
			</el-form-item>
			<el-form-item>
				<el-input v-model="state.queryForm.type" placeholder="车辆类型（0：临时车辆 1：固定车辆）"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList()">查询</el-button>
			</el-form-item>
			<el-form-item>
				<el-button v-auth="'soft2242:record:save'" type="primary" @click="addOrUpdateHandle()">新增</el-button>
			</el-form-item>
			<el-form-item>
				<el-button v-auth="'soft2242:record:delete'" type="danger" @click="deleteBatchHandle()">删除</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%" @selection-change="selectionChangeHandle">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="parkName" label="停车场名称" header-align="center" align="center"></el-table-column>
			<el-table-column prop="licence" label="车牌号" header-align="center" align="center"></el-table-column>
			<el-table-column prop="doorName" label="设备名" header-align="center" align="center"></el-table-column>
			<el-table-column prop="accessTime" label="进入时间" header-align="center" align="center"></el-table-column>
			<el-table-column prop="leaveTime" label="离开时间" header-align="center" align="center"></el-table-column>
			<el-table-column prop="price" label="收费金额" header-align="center" align="center"></el-table-column>
			<el-table-column prop="type" label="车辆类型" header-align="center" align="center">
				<template #default="{ row }">
					<el-tag v-if="row.type == 0" type="success">闲置</el-tag>
					<el-tag v-if="row.type == 1" type="primary">已租</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="deleted" label="删除标识（0：未删除 1：已删除）" header-align="center" align="center"></el-table-column>
			<el-table-column prop="creator" label="创建者" header-align="center" align="center"></el-table-column>
			<el-table-column prop="createTime" label="创建时间" header-align="center" align="center"></el-table-column>
			<el-table-column prop="updater" label="更新者" header-align="center" align="center"></el-table-column>
			<el-table-column prop="updateTime" label="更新时间" header-align="center" align="center"></el-table-column>
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

const state: IHooksOptions = reactive({
	dataListUrl: '/sys/parkRecord/page',
	queryForm: {
		carId: '',
		doorId: '',
		type: ''
	}
})

const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle } = useCrud(state)
</script>
