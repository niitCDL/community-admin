<template>
	<el-card>
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item>
				<el-select v-model="state.queryForm.communityId" placeholder="所属小区" clearable>
					<el-option v-for="item in communityList" :key="item.id" :label="item.communityName" :value="item.id" />
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-input v-model="state.queryForm.monitorName" placeholder="监控名称"></el-input>
			</el-form-item>
			<el-form-item>
				<el-select v-model="state.queryForm.status" placeholder="状态" clearable>
					<el-option label="正常" :value="0"></el-option>
					<el-option label="故障" :value="1"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-select v-model="state.queryForm.monitorType" placeholder="监控分组">
					<el-option v-for="item in monitorTypeList" :key="item.id" :label="item.type" :value="item.id" />
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList()">查询</el-button>
			</el-form-item>
			<el-form-item>
				<el-button v-auth="'sys:monitor:save'" type="primary" @click="addOrUpdateHandle()">新增</el-button>
			</el-form-item>
			<el-form-item>
				<el-button v-auth="'sys:monitor:delete'" type="danger" @click="deleteBatchHandle()">删除</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%" @selection-change="selectionChangeHandle">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="deviceName" label="设备名" header-align="center" align="center"></el-table-column>
			<el-table-column prop="monitorName" label="监控名称" header-align="center" align="center"></el-table-column>
			<el-table-column prop="communityName" label="所属小区" header-align="center" align="center"></el-table-column>
			<el-table-column prop="status" label="监控状态" header-align="center" align="center">
				<template #default="scope">
					<el-tag v-if="scope.row.status === 0" type="success">正常</el-tag>
					<el-tag v-if="scope.row.status === 1" type="error">故障</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="enabled" label="是否启用" header-align="center" align="center">
				<template #default="scope">
					<el-tag v-if="scope.row.enabled === 0" type="success">启用</el-tag>
					<el-tag v-if="scope.row.enabled === 1" type="error">禁用</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="monitorTypeName" label="监控分组" header-align="center" align="center"></el-table-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
				<template #default="scope">
					<el-button v-auth="'sys:monitor:update'" type="primary" link @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
					<el-button v-auth="'sys:monitor:delete'" type="primary" link @click="deleteBatchHandle(scope.row.id)">删除</el-button>
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
		<add-or-update ref="addOrUpdateRef" :monitor-type-list="monitorTypeList" @refreshDataList="getDataList"></add-or-update>
	</el-card>
</template>

<script setup lang="ts" name="Soft2242MonitorIndex">
import { useCrud } from '@/hooks'
import { onMounted, reactive, ref } from 'vue'
import AddOrUpdate from './add-or-update.vue'
import { IHooksOptions } from '@/hooks/interface'
import { getEnabledMonitorTypeList } from '@/api/smart'
import { getCommunityList } from '@/api/community/community'

const state: IHooksOptions = reactive({
	dataListUrl: '/smart/monitor/page',
	deleteUrl: '/smart/monitor',
	queryForm: {
		communityId: '',
		monitorName: '',
		status: '',
		monitorType: ''
	}
})

const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle } = useCrud(state)

let monitorTypeList = ref<any[]>([])

const getMonitorType = () => {
	getEnabledMonitorTypeList().then((res: any) => {
		monitorTypeList.value = res.data
	})
}

//获取所有小区列表
const communityList = ref<any[]>([])
const getCommunityLists = () => {
	getCommunityList().then(res => {
		communityList.value = res.data
	})
}

onMounted(() => {
	getCommunityLists()
	getMonitorType()
})
</script>
