<script lang="ts" setup>
//添加删除url和查询对象类型
import { IHooksOptions } from '@/hooks/interface'
import { reactive, ref } from 'vue'
//增删改查方法
import { useCrud } from '@/hooks'
//添加修改组件
import AddOrUpdate from './add-or-update.vue'
import { getCommunityList } from '@/api/community/community'

const state: IHooksOptions = reactive({
	dataListUrl: '/safe/plan/page',
	deleteUrl: '/safe/plan',
	queryForm: {
		communityId: '',
		planName: '',
		name: ''
	}
})
const communityList = ref<any[]>([])
getCommunityList().then(res => {
	communityList.value = res.data
})
const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle } = useCrud(state)

const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}
</script>

<template>
	<el-card>
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item>
				<el-select v-model="state.queryForm.communityId" class="m-2" placeholder="选择小区" clearable>
					<el-option v-for="item in communityList" :key="item.id" :label="item.communityName" :value="item.id" />
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-input v-model="state.queryForm.planName" placeholder="计划名" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<el-input v-model="state.queryForm.name" placeholder="巡检人名" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList()">查询</el-button>
			</el-form-item>
			<el-form-item>
				<el-button v-auth="'sys:user:save'" type="primary" @click="addOrUpdateHandle()">新增</el-button>
			</el-form-item>
			<el-form-item>
				<el-button v-auth="'sys:user:delete'" type="danger" @click="deleteBatchHandle()">批量删除</el-button>
			</el-form-item>
		</el-form>

		<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%" @selection-change="selectionChangeHandle">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="communityName" label="所属小区" header-align="center" align="center"></el-table-column>
			<el-table-column prop="planName" label="计划名" header-align="center" align="center"></el-table-column>
			<el-table-column prop="planCycle" label="周期" dict-type="user_status" align="center">
				<template #default="{ row }">
					<el-tag v-if="row.planCycle == 0">每天</el-tag>
					<el-tag v-if="row.planCycle == 1" type="success">每周</el-tag>
					<el-tag v-if="row.planCycle == 2" type="danger">每月</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="wayName" label="执行线路" header-align="center" align="center"></el-table-column>
			<el-table-column prop="realname" label="执行人" header-align="center" align="center"></el-table-column>
			<el-table-column prop="notes" label="备注" header-align="center" align="center"></el-table-column>
			<el-table-column prop="status" label="状态" dict-type="user_status" align="center">
				<template #default="{ row }">
					<el-tag v-if="row.status == 1" type="success">启用</el-tag>
					<el-tag v-if="row.status == 0" type="danger">禁用</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="createTime" label="创建时间" header-align="center" align="center" width="180"></el-table-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
				<template #default="scope">
					<el-button v-auth="'sys:user:update'" type="primary" link @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
					<el-button v-auth="'sys:user:delete'" type="primary" link @click="deleteBatchHandle(scope.row.id)">删除</el-button>
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
		<AddOrUpdate ref="addOrUpdateRef" @refresh-data-list="getDataList"></AddOrUpdate>
	</el-card>
</template>

<style scoped></style>
