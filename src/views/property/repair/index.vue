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
					collapse-tags
					collapse-tags-tooltip
					:max-collapse-tags="3"
				/>
			</el-form-item>
			<el-form-item>
				<el-select v-model="state.queryForm.state" placeholder="处理状态">
					<el-option label="未处理" value="0"></el-option>
					<el-option label="处理中" value="1"></el-option>
					<el-option label="已处理" value="2"></el-option>
					<el-option label="已评价" value="3"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-select v-model="state.queryForm.type" placeholder="报修类型">
					<el-option label="公共报修" value="0"></el-option>
					<el-option label="个人报修" value="1"></el-option>
				</el-select>
			</el-form-item>

			<el-form-item >
				<el-date-picker v-model="state.queryForm.createTime" type="datetimerange" placeholder="选择日期" value-format="YYYY-MM-DD HH:mm:ss"></el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList()">查询</el-button>
			</el-form-item>
			<el-form-item>
				<!-- <el-button v-auth="'property:repair:save'" type="primary" @click="addOrUpdateHandle()">新增</el-button> -->
			</el-form-item>
			<el-form-item>
				<el-button v-auth="'property:repair:delete'" type="danger" @click="deleteBatchHandle()">删除</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%" @selection-change="selectionChangeHandle">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="id" label="序号" header-align="center" align="center"></el-table-column>
	
			<el-table-column prop="communityName" label="所属小区" header-align="center" align="center"></el-table-column>
			<fast-table-column prop="type" label="报修类型" dict-type="repair_type"></fast-table-column>
			<el-table-column prop="userName" label="报修人" header-align="center" align="center"></el-table-column>
			<el-table-column prop="createTime" label="报修时间" header-align="center" align="center"></el-table-column>
			<el-table-column prop="employeeNames" label="处理人" header-align="center" align="center"></el-table-column>
			<el-table-column prop="handleTime" label="处理时间" header-align="center" align="center"></el-table-column>
			<fast-table-column prop="state" label="状态" dict-type="hand_status"></fast-table-column>
			
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
				<template #default="scope">
					<!-- <el-button v-auth="'property:repair:update'" type="primary" link @click="addOrUpdateHandle(scope.row.id)">修改</el-button> -->
					<el-button v-auth="'property:repair:delete'" type="primary" link @click="addOrUpdateHandle(scope.row.id)">分配</el-button>
					<el-button v-auth="'property:repair:delete'" type="primary" link @click="deleteBatchHandle(scope.row.id)">删除</el-button>
					<el-button v-auth="'property:repair:delete'" type="primary" link @click="info(scope.row)">查看</el-button>
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

<script setup lang="ts" name="Soft2242RepairIndex">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import AddOrUpdate from './add-or-update.vue'
import { IHooksOptions } from '@/hooks/interface'
import { useGetCommunityList, userGetCommunityOption, useSetInfo } from '../property'
import { router } from '@/router'
import { ElMessage, ElMessageBox } from 'element-plus'

const state: IHooksOptions = reactive({
	dataListUrl: '/property/repair/page',
	deleteUrl: '/property/repair',
	queryForm: {
		communityId: '',
		title: '',
		state: '',
		createTime: ''
	}
})

const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}
let options = []
options = userGetCommunityOption()
//详情
const info = (data: any) => {
	// console.log(data)
	useSetInfo(data)
	router.push('/property/repair/info')
}
//分配
const open = (id?: number) => {
	addOrUpdateRef.value.init(id)
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle } = useCrud(state)
</script>
