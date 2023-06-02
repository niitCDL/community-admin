<script lang="ts" setup>
//添加删除url和查询对象类型
import { IHooksOptions } from '@/hooks/interface'
import { reactive, ref, watch } from 'vue'
//增删改查方法
import { useCrud } from '@/hooks'

//弹窗打开关闭
const visible = ref(false)

const state: IHooksOptions = reactive({
	dataListUrl: '/safe/record/page',
	deleteUrl: '/safe/record',
	queryForm: {
		pointId: ''
	}
})

const props = defineProps({
	id: {
		type: Number,
		default: null
	}
})
const init = (id?: number) => {
	if (id) {
		console.log(id)
		state.queryForm.pointId = id
		getDataList()
		console.log(state.dataList)
	}
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle } = useCrud(state)
defineExpose({ visible, init })
</script>

<template>
	<el-dialog v-model="visible">
		<el-card>
			<el-form :inline="true" :model="state.queryForm"> </el-form>
			<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%" @selection-change="selectionChangeHandle">
				<el-table-column prop="id" label="序号" header-align="center" align="center"></el-table-column>
				<el-table-column prop="realname" label="巡更人" header-align="center" align="center"></el-table-column>
				<el-table-column prop="phone" label="手机号" header-align="center" align="center"></el-table-column>
				<el-table-column prop="inspectorTime" label="巡更时间" header-align="center" align="center"></el-table-column>
				<el-table-column prop="inspectorResult" label="巡检结果" header-align="center" align="center"></el-table-column>
				<el-table-column prop="photo" label="上传照片" header-align="center" align="center"></el-table-column>
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
	</el-dialog>
</template>

<style scoped>
.select-list {
	max-height: 60px; /* 限制下拉框高度 */
	overflow-y: auto; /* 启用垂直滚动条 */
}
</style>
