<template>
	<el-dialog v-model="visible" width="70%" title="访客开门记录" :close-on-click-modal="false" draggable>
		<el-table :data="state.dataList" stripe border header-align="center" align="center" style="width: 100%">
			<el-table-column prop="name" label="访客姓名" width="180" border header-align="center" align="center" />
			<el-table-column prop="phone" label="访客手机号" width="180" border header-align="center" align="center" />
			<el-table-column prop="doorIds" label="开门位置" width="180" border header-align="center" align="center" />
			<el-table-column prop="updateTime" label="开门时间" width="180" border header-align="center" align="center" />
		</el-table>
	</el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus/es'
import { useCommunityListApi } from '@/api/society/order'
import { useInvHistoryApi } from '@/api/society/invitation'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)

const dataFormRef = ref()
const state = reactive({
	createdIsNeed: true,
	dataListLoading: true,
	dataListUrl: import.meta.env.VITE_API_URL + '/soft2242/order/record',
	dataList: [],
	queryForm: { createTime: '', endTime: '' }
})

const dataForm = reactive({
	id: 1,
	ownerId: 0,
	name: '汪涵',
	phone: '1231414',
	doorIds: '1',
	status: 0,
	count: 11,
	deleted: 0,
	createTime: '2023-05-25 19:44:19',
	creator: 10000,
	updater: 10000,
	updateTime: '2023-05-25 19:44:19'
})

const init = (id?: number) => {
	visible.value = true
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}
	// id 存在则为修改
	if (id) {
		// getList(id)
		// 获取表单数据
		getDateListList(id)
	}
}
// 获取开门记录列表
const getDateListList = (id: number) => {
	return useInvHistoryApi(id).then(res => {
		state.dataList = res.data
		console.log(res.data) // 打印列表数据列表格式 可以使用jqGrid或其他数据
		console.log(state.dataList)
	})
}
// 获取开门记录
const getList = (id: number) => {
	return useInvHistoryApi(id).then(res => {
		Object.assign(dataForm, res.data)
	})
}

defineExpose({
	init
})
</script>
