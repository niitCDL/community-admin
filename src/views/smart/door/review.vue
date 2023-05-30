<template>
	<el-card>
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item>
				<el-input v-model="state.queryForm.ownerName" placeholder="业主名"></el-input>
			</el-form-item>
			<el-form-item>
				<el-select v-model="state.queryForm.communityId" placeholder="小区名" clearable>
					<el-option label="万象城" :value="1"></el-option>
					<el-option label="汤臣一品" :value="2"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-select v-model="state.queryForm.status" placeholder="审核状态" clearable>
					<el-option label="待审核" :value="0"></el-option>
					<el-option label="已通过" :value="1"></el-option>
					<el-option label="已驳回" :value="2"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList()">查询</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%" @selection-change="selectionChangeHandle">
			<el-table-column prop="ownerName" label="业主名" header-align="center" align="center"></el-table-column>
			<el-table-column prop="communityName" label="小区" header-align="center" align="center"></el-table-column>
			<el-table-column prop="houseNumber" label="房间号" header-align="center" align="center"></el-table-column>
			<el-table-column prop="face" label="是否有人脸" header-align="center" align="center">
				<template #default="scope">
					<el-tag v-if="scope.row.face === 0" type="error">未上传</el-tag>
					<el-tag v-if="scope.row.face === 1" type="success">已上传</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="finger" label="是否有指纹" header-align="center" align="center">
				<template #default="scope">
					<el-tag v-if="scope.row.finger === 0" type="error">未上传</el-tag>
					<el-tag v-if="scope.row.finger === 1" type="success">已上传</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="status" label="审核状态" header-align="center" align="center">
				<template #default="scope">
					<el-tag v-if="scope.row.status === 0" type="warning">待审核</el-tag>
					<el-tag v-if="scope.row.status === 1" type="success">已通过</el-tag>
					<el-tag v-if="scope.row.status === 2" type="error">已拒绝</el-tag>
				</template>
			</el-table-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
				<template #default="scope">
					<el-button v-if="scope.row.status == 0" v-auth="'smart:review:update'" type="primary" link @click="changeReviewStatus(scope.row.id, 1)"
						>通过</el-button
					>
					<el-button v-if="scope.row.status == 0" v-auth="'smart:review:update'" type="primary" link @click="changeReviewStatus(scope.row.id, 2)"
						>驳回</el-button
					>
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

<script setup lang="ts" name="SysDoorReviewIndex">
import { useCrud } from '@/hooks'
import { reactive } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import { changeReviewStatusApi } from '@/api/smart'
import { ElMessage } from 'element-plus/es'

const state: IHooksOptions = reactive({
	dataListUrl: '/smart/review/page',
	queryForm: {
		ownerName: '',
		status: '',
		communityId: ''
	}
})

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle } = useCrud(state)

const changeReviewStatus = (reviewId: number, status: number) => {
	changeReviewStatusApi({ id: reviewId, status }).then(res => {
		ElMessage.success({
			message: '操作成功',
			duration: 1000
		})
		getDataList()
	})
}
</script>
