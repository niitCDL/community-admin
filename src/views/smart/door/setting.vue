<template>
	<el-card>
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item>
				<el-select v-model="state.queryForm.id" placeholder="选择门禁" clearable>
					<el-option v-for="item in doorList" :key="item.id" :label="item.doorName" :value="item.id" />
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-select v-model="state.queryForm.communityId" placeholder="所属小区" clearable>
					<el-option label="万象城" :value="1"></el-option>
					<el-option label="汤臣一品" :value="2"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList()">查询</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%" @selection-change="selectionChangeHandle">
			<el-table-column type="index" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="doorName" label="门禁名称" header-align="center" align="center"></el-table-column>
			<el-table-column prop="communityName" label="所属小区" header-align="center" align="center"></el-table-column>
			<el-table-column label="欠费禁入" prop="allowOwed" align="center">
				<template #default="{ row }">
					<el-switch :model-value="row.allowOwed" :active-value="0" :inactive-value="1" @change="handleStatusChange($event, 'allowOwed', row)" />
				</template>
			</el-table-column>
			<el-table-column label="访客审核" prop="allowVisit" align="center">
				<template #default="{ row }">
					<el-switch :model-value="row.allowVisit" :active-value="0" :inactive-value="1" @change="handleStatusChange($event, 'allowVisit', row)" />
				</template>
			</el-table-column>
			<el-table-column label="访客手机号" prop="needTel" align="center">
				<template #default="{ row }">
					<el-switch :model-value="row.needTel" :active-value="0" :inactive-value="1" @change="handleStatusChange($event, 'needTel', row)" />
				</template>
			</el-table-column>
			<el-table-column label="访客身份证" prop="needIdCard" align="center">
				<template #default="{ row }">
					<el-switch :model-value="row.needIdCard" :active-value="0" :inactive-value="1" @change="handleStatusChange($event, 'needIdCard', row)" />
				</template>
			</el-table-column>
			<el-table-column label="人脸识别" prop="allowFace" align="center">
				<template #default="{ row }">
					<el-switch :model-value="row.allowFace" :active-value="0" :inactive-value="1" @change="handleStatusChange($event, 'allowFace', row)" />
				</template>
			</el-table-column>
			<el-table-column label="指纹识别" prop="allowFinger" align="center">
				<template #default="{ row }">
					<el-switch :model-value="row.allowFinger" :active-value="0" :inactive-value="1" @change="handleStatusChange($event, 'allowFinger', row)" />
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

<script setup lang="ts" name="SysDoorIndex">
import { useCrud } from '@/hooks'
import { onMounted, reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import { changeSettings, getAllDoor } from '@/api/smart'
import { ElMessage } from 'element-plus/es'

const state: IHooksOptions = reactive({
	dataListUrl: '/smart/doorSetting/page',
	queryForm: {
		id: '',
		communityId: ''
	}
})

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle } = useCrud(state)

// 修改状态
const handleStatusChange = (status: number, field: string, row: any) => {
	row[field] = status
	changeSettings(row).then((res: any) => {
		if (res.code == 0) {
			ElMessage.success({
				message: '操作成功',
				duration: 500
			})
		}
	})
}

const doorList = ref<any[]>([])

const getDoorList = () => {
	getAllDoor().then((res: any) => {
		if (res.code != 0) {
			ElMessage.success({
				message: '接口异常',
				duration: 500
			})
		}
		doorList.value = res.data
	})
}

onMounted(() => {
	getDoorList()
})
</script>
