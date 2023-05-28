<template>
	<el-card>
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item>
				<el-select-v2
					v-model="state.queryForm.communityId"
					:options="options"
					placeholder="选择小区"
					style="width: 240px"
					multiple
				/>
			</el-form-item>

			<el-form-item>
				<el-input v-model="state.queryForm.title" placeholder="标题"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList()">查询</el-button>
			</el-form-item>
			<el-form-item>
				<el-button v-auth="'property:notice:save'" type="primary" @click="addOrUpdateHandle()">新增</el-button>
			</el-form-item>
			<el-form-item>
				<el-button v-auth="'property:notice:delete'" type="danger" @click="deleteBatchHandle()">删除</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%" @selection-change="selectionChangeHandle">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="id" label="序号" header-align="center" align="center"></el-table-column>
			<el-table-column prop="title" label="通知标题" header-align="center" align="center"></el-table-column>
			<el-table-column prop="communityName" label="所属小区" header-align="center" align="center"></el-table-column>
			<fast-table-column prop="type" label="通知类型" dict-type="notice_type"></fast-table-column>
			<!-- <fast-table-column prop="type" label="通知类型" dict-type="type"></fast-table-column> -->
			<el-table-column prop="userName" label="发布人" header-align="center" align="center"></el-table-column>
			<el-table-column prop="publishTime" label="发布时间" header-align="center" align="center"></el-table-column>
			<fast-table-column prop="review" label="状态" dict-type="review_status"></fast-table-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="300">
				<template #default="scope">
					<el-button v-auth="'property:notice:update'" type="primary" link @click="addOrUpdateHandle(scope.row.id)">编辑</el-button>
					<el-button v-auth="'property:notice:delete'" type="primary" link @click="deleteBatchHandle(scope.row.id)">删除</el-button>
					<el-button v-auth="'property:notice:delete'" type="primary" link @click="review(scope.row)">审核</el-button>
					<el-button v-auth="'property:notice:delete'" type="primary" link @click="info(scope.row)">查看</el-button>
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

<script setup lang="ts" name="Soft2242NoticeIndex">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import AddOrUpdate from './add-or-update.vue'
import { IHooksOptions } from '@/hooks/interface'
import { ElMessageBox } from 'element-plus'
import service from '@/utils/request'
import { useNoticeSubmitApi } from '@/api/property/notice'
import { dataType } from 'element-plus/es/components/table-v2/src/common'
import { router } from '@/router'
import { useGetCommunityList, userGetCommunityOption, useSetInfo } from '../property'

const state: IHooksOptions = reactive({
	dataListUrl: '/property/notice/page',
	deleteUrl: '/property/notice',
	queryForm: {
		communityId: '',
		title: '',
		content: ''
	}
})

const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}

// 实现审核功能
const review = (dataForm?: any) => {
	ElMessageBox.confirm('判断这个公告是否可以通过？', '确认信息', {
		type: 'info',
		distinguishCancelAndClose: true,
		cancelButtonText: '不通过',
		confirmButtonText: '通过'
	})
		.then(() => {
			dataForm.review = 1
			useNoticeSubmitApi(dataForm)
				.then(() => {
					alert('审核成功')
				})
				.catch(error => {
					alert(error)
				})
		})
		.catch(action => {
			if (action === 'cancel') {
				dataForm.review = 2
				useNoticeSubmitApi(dataForm)
					.then(() => {
						alert('审核成功')
					})
					.catch(error => {
						alert(error)
					})
			}
		})
}
let communities

communities = useGetCommunityList()

let options = []
options = userGetCommunityOption()

//详情
const info = (data: any) => {
	// console.log(data)
	useSetInfo(data)
	router.push('/property/notice/info')
}
const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle } = useCrud(state)
</script>
