<template>
	<el-card>
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item>
				<el-input v-model="state.queryForm.deviceId" placeholder="设备主键"></el-input>
			</el-form-item>
			<el-form-item>
				<el-input v-model="state.queryForm.doorName" placeholder="门禁名称"></el-input>
			</el-form-item>
			<el-form-item>
				<el-select v-model="state.queryForm.communityId" placeholder="所属小区">
					<el-option label="万象城" :value="1"></el-option>
					<el-option label="汤臣一品" :value="2"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList()">查询</el-button>
			</el-form-item>
			<el-form-item>
				<el-button v-auth="'sys:door:save'" type="primary" @click="addOrUpdateHandle()">新增</el-button>
			</el-form-item>
			<el-form-item>
				<el-button v-auth="'sys:door:delete'" type="danger" @click="deleteBatchHandle()">删除</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%" @selection-change="selectionChangeHandle">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="doorName" label="门禁名称" header-align="center" align="center"></el-table-column>
			<el-table-column prop="deviceName" label="设备" header-align="center" align="center"></el-table-column>
			<el-table-column prop="communityName" label="所属小区" header-align="center" align="center"></el-table-column>
			<el-table-column prop="sysCode" label="配置码" header-align="center" align="center"></el-table-column>
			<el-table-column prop="onlineStatus" label="在线状态" header-align="center" align="center">
				<template #default="{ row }">
					<el-switch :model-value="row.onlineStatus" :active-value="0" :inactive-value="1" @change="handleStatusChange($event, row)" />
				</template>
			</el-table-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
				<template #default="scope">
					<el-button v-auth="'sys:door:update'" type="primary" link @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
					<el-button v-auth="'sys:door:delete'" type="primary" link @click="deleteBatchHandle(scope.row.id)">删除</el-button>
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

<script setup lang="ts" name="SysDoorIndex">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import AddOrUpdate from './add-or-update.vue'
import { IHooksOptions } from '@/hooks/interface'
import { ElMessage } from 'element-plus'
import { useDoorSubmitApi } from '@/api/smart'

const state: IHooksOptions = reactive({
	dataListUrl: '/smart/door/page',
	deleteUrl: '/smart/door',
	queryForm: {
		deviceId: '',
		doorName: '',
		communityId: ''
	}
})

const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle } = useCrud(state)

// 修改状态
const handleStatusChange = (status: number, row: any) => {
	row['onlineStatus'] = status
	useDoorSubmitApi(row).then((res: any) => {
		if (res.code == 0) {
			ElMessage.success({
				message: '操作成功',
				duration: 500
			})
		}
	})
}
</script>
