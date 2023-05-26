<script setup lang="ts" name="MessageSmsLogIndex">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import Detail from './detail.vue'
import { IHooksOptions } from '@/hooks/interface'

const state: IHooksOptions = reactive({
	dataListUrl: '/sys/community/page',
	//deleteUrl: '/message/sms/log',
	queryForm: {
		platformId: '',
		platform: ''
	}
})

const detailRef = ref()
const detailHandle = (row: any) => {
	detailRef.value.init(row)
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle } = useCrud(state)
</script>

<template>
	<div>楼宇管理</div>
	<el-card>
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item>
				<el-input v-model="state.queryForm.id" placeholder="社区ID"></el-input>
			</el-form-item>
			<el-form-item>
				<fast-select v-model="state.queryForm.communityName" dict-type="sms_platform" clearable placeholder="社区名称"></fast-select>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList()">查询</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%" @selection-change="selectionChangeHandle">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="id" label="社区ID" header-align="center" align="center" width="80"></el-table-column>
			<fast-table-column prop="communityName" label="社区名字" dict-type="sms_platform"></fast-table-column>
			<el-table-column prop="address" label="社区地址" header-align="center" align="center"></el-table-column>
			<el-table-column prop="communityImgs" label="社区图片" header-align="center" align="center">
				<template #default="scope">
					<img :src="scope.row.communityImgs" alt="图片" style="width: 120px; height: 120px" />
				</template>
			</el-table-column>
			<el-table-column prop="coverArea" label="社区面积" align="center"></el-table-column>
			<el-table-column prop="content" label="备注" align="center"></el-table-column>
			<el-table-column prop="createTime" label="创建时间" header-align="center" align="center"></el-table-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
				<template #default="scope">
					<el-button type="primary" link @click="detailHandle(scope.row)">详情</el-button>
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

		<!-- 详情 -->
		<detail ref="detailRef"></detail>
	</el-card>
</template>

<style scoped></style>

