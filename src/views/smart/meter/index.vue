<template>
	<el-card>
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item>
				<el-input v-model="state.queryForm.meterName" placeholder="仪表名称"></el-input>
			</el-form-item>
			<el-form-item>
				<el-select v-model="state.queryForm.communityId" placeholder="所属小区" clearable>
					<el-option label="万象城" :value="1"></el-option>
					<el-option label="汤臣一品" :value="2"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-select v-model="state.queryForm.meterType" placeholder="仪表位置" clearable>
					<el-option label="房间表" :value="0"></el-option>
					<el-option label="公摊表" :value="1"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-select v-model="state.queryForm.onlineStatus" placeholder="在线状态" clearable>
					<el-option label="在线" :value="0"></el-option>
					<el-option label="离线" :value="1"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-select v-model="state.queryForm.gateStatus" placeholder="通电状态" clearable>
					<el-option label="合闸" :value="0"></el-option>
					<el-option label="关闸" :value="1"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList()">查询</el-button>
			</el-form-item>
			<el-form-item>
				<el-button v-auth="'sys:meter:save'" type="primary" @click="addOrUpdateHandle()">新增</el-button>
			</el-form-item>
			<el-form-item>
				<el-button v-auth="'sys:meter:delete'" type="danger" @click="deleteBatchHandle()">删除</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%" @selection-change="selectionChangeHandle">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="deviceName" label="设备名" header-align="center" align="center"></el-table-column>
			<el-table-column prop="meterName" label="仪表名称" header-align="center" align="center"></el-table-column>
			<el-table-column prop="communityName" label="所属小区" header-align="center" align="center"></el-table-column>
			<el-table-column prop="meterType" label="仪表位置" header-align="center" align="center">
				<template #default="scope">
					<el-tag v-if="scope.row.meterType === 0" type="success">房间表</el-tag>
					<el-tag v-if="scope.row.meterType === 1" type="warning">公摊表</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="price" label="价格" header-align="center" align="center"></el-table-column>
			<el-table-column prop="startNum" label="开始数值" header-align="center" align="center"></el-table-column>
			<el-table-column prop="nowNum" label="当前数值" header-align="center" align="center"></el-table-column>
			<el-table-column prop="max" label="最大数值" header-align="center" align="center"></el-table-column>
			<el-table-column prop="totalUse" label="总用量" header-align="center" align="center"></el-table-column>
			<el-table-column prop="onlineStatus" label="在线状态" header-align="center" align="center">
				<template #default="scope">
					<el-tag v-if="scope.row.onlineStatus === 0" type="success">在线</el-tag>
					<el-tag v-if="scope.row.onlineStatus === 1" type="error">离线</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="gateStatus" label="通电状态" header-align="center" align="center">
				<template #default="scope">
					<el-tag v-if="scope.row.gateStatus === 0" type="success">合闸</el-tag>
					<el-tag v-if="scope.row.gateStatus === 1" type="error">关闸</el-tag>
				</template>
			</el-table-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
				<template #default="scope">
					<el-button v-auth="'sys:meter:update'" type="primary" link @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
					<el-button v-auth="'sys:meter:delete'" type="primary" link @click="deleteBatchHandle(scope.row.id)">删除</el-button>
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

<script setup lang="ts" name="Soft2242MeterIndex">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import AddOrUpdate from './add-or-update.vue'
import { IHooksOptions } from '@/hooks/interface'

const state: IHooksOptions = reactive({
	dataListUrl: '/smart/meter/page',
	deleteUrl: '/smart/meter',
	queryForm: {
		meterName: '',
		communityId: '',
		meterType: '',
		onlineStatus: '',
		gateStatus: ''
	}
})

const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle } = useCrud(state)
</script>
