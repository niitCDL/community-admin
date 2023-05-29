<script lang="ts" setup>
//添加删除url和查询对象类型
import { IHooksOptions } from '@/hooks/interface'
import { reactive, ref } from 'vue'
//增删改查方法
import { useCrud } from '@/hooks'
//添加修改组件
import AddOrUpdate from './add-or-update.vue'
import { useCommuntiySearchApi } from '@/api/safe/point'
const communities = ref<any[]>([])
useCommuntiySearchApi().then(res => {
	communities.value = res.data
})

console.log(communities)
const state: IHooksOptions = reactive({
	dataListUrl: '/safe/path/page',
	deleteUrl: '/safe/path',
	queryForm: {
		communityIds: []
	}
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
			<!-- <el-form-item>
				<el-input v-model="state.queryForm.communityId" placeholder="小区名" clearable></el-input>
			</el-form-item> -->
			<el-form-item>
				<el-select v-model="state.queryForm.communityIds" multiple placeholder="请选择社区" class="select-list">
					<el-option v-for="option in communities" :key="option.id" :label="option.communityName" :value="option.id"></el-option>
				</el-select>
			</el-form-item>

			<!-- <el-form-item>
				<fast-select v-model="state.queryForm.gender" dict-type="user_gender" clearable placeholder="性别"></fast-select>
			</el-form-item> -->
			<el-form-item>
				<el-button @click="getDataList()">查询</el-button>
			</el-form-item>

			<el-form-item>
				<el-button v-auth="'safe:path:save'" type="primary" @click="addOrUpdateHandle()">新增</el-button>
			</el-form-item>
			<el-form-item>
				<el-button v-auth="'safe:path:delete'" type="danger" @click="deleteBatchHandle()">批量删除</el-button>
			</el-form-item>
		</el-form>

		<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%" @selection-change="selectionChangeHandle">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="id" label="序号" header-align="center" align="center"></el-table-column>
			<el-table-column prop="communityName" label="所属小区" header-align="center" align="center"></el-table-column>
			<el-table-column prop="wayName" label="巡更路线" header-align="center" align="center"></el-table-column>

			<el-table-column prop="status" label="状态" dict-type="user_status" align="center">
				<template #default="{ row }">
					<el-tag v-if="row.status == 1" type="success">启用</el-tag>
					<el-tag v-if="row.status == 0" type="danger">禁用</el-tag>
				</template>
			</el-table-column>

			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
				<template #default="scope">
					<!-- <el-button type="primary" link @click="deleteBatchHandle(scope.row.id)">巡更地图</el-button> -->
					<el-button v-auth="'safe:point:update'" type="primary" link @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
					<el-button v-auth="'safe:point:delete'" type="primary" link @click="deleteBatchHandle(scope.row.id)">删除</el-button>
					<!-- <el-button type="primary" link @click="deleteBatchHandle(scope.row.id)">巡更记录</el-button> -->
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

<style scoped>
.select-list {
	max-height: 60px; /* 限制下拉框高度 */
	overflow-y: auto; /* 启用垂直滚动条 */
}
</style>
