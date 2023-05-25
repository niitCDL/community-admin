<template>
	<el-card>
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item>
				<el-input v-model="state.queryForm.deviceName" placeholder="设备名称"></el-input>
			</el-form-item>
			<el-form-item>
				<el-select v-model="state.queryForm.status" placeholder="设备状态" clearable>
					<el-option label="正常" value="0"></el-option>
					<el-option label="故障" value="1"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-select v-model="state.queryForm.deviceType" placeholder="设备类别" clearable>
					<el-option v-for="item in deviceTypeList" :key="item.id" :label="item.type" :value="item.id" />
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-select v-model="state.queryForm.communityId" placeholder="设备所属小区" clearable>
					<el-option label="选择" value="0"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-input v-model="state.queryForm.address" placeholder="设备位置"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList()">查询</el-button>
			</el-form-item>
			<el-form-item>
				<el-button v-auth="'smart:device:save'" type="primary" @click="addOrUpdateHandle()">新增</el-button>
			</el-form-item>
			<el-form-item>
				<el-button v-auth="'smart:device:delete'" type="danger" @click="deleteBatchHandle()">删除</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%" @selection-change="selectionChangeHandle">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="deviceTypeName" label="类别" header-align="center" align="center" width="100"></el-table-column>
			<el-table-column prop="deviceName" label="设备名称" header-align="center" align="center"></el-table-column>
			<el-table-column prop="communityName" label="小区" header-align="center" align="center"></el-table-column>
			<el-table-column prop="address" label="设备位置" header-align="center" align="center"></el-table-column>
			<el-table-column prop="qrCode" label="设备二维码" header-align="center" align="center"></el-table-column>
			<el-table-column prop="status" label="状态" header-align="center" align="center" width="80">
				<template #default="scope">
					<el-tag v-if="scope.row.status === 0" type="success">正常</el-tag>
					<el-tag v-if="scope.row.status === 1" type="error">故障</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="createTime" label="创建时间" header-align="center" align="center"></el-table-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
				<template #default="scope">
					<el-button v-auth="'smart:device:update'" type="primary" link @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
					<el-button v-auth="'smart:device:delete'" type="primary" link @click="deleteBatchHandle(scope.row.id)">删除</el-button>
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
		<add-or-update ref="addOrUpdateRef" :device-type-list="deviceTypeList" @refreshDataList="getDataList"></add-or-update>
	</el-card>
</template>

<script setup lang="ts" name="SmartDeviceIndex">
import { useCrud } from '@/hooks'
import { reactive, ref, onMounted } from 'vue'
import AddOrUpdate from './add-or-update.vue'
import { IHooksOptions } from '@/hooks/interface'
import { getEnabledTypeList } from '@/api/smart'

const state: IHooksOptions = reactive({
	dataListUrl: '/smart/device/page',
	deleteUrl: '/smart/device',
	queryForm: {
		deviceName: '',
		status: '',
		deviceType: '',
		communityId: '',
		address: ''
	}
})

const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle } = useCrud(state)

interface deviceTypeEntity {
	id?: number
	creator?: number
	updater?: number
	createTime?: Date
	updateTime?: Date
	deleted?: number
	type?: string
	des?: string
	enabled?: number
	orderd?: number
}

let deviceTypeList = ref<deviceTypeEntity[]>([])

const getDeviceType = () => {
	getEnabledTypeList().then((res: any) => {
		deviceTypeList.value = res.data
		console.log(deviceTypeList)
	})
}

onMounted(() => {
	getDeviceType()
})
</script>
