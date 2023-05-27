<script lang="ts" setup>
//添加删除url和查询对象类型
import { IHooksOptions } from '@/hooks/interface'
import { reactive, ref } from 'vue'
//增删改查方法
import { useCrud } from '@/hooks'
//添加修改组件
import AddOrUpdate from './add-or-update.vue'

const state: IHooksOptions = reactive({
	dataListUrl: '/safe/inspectionitem/page',
	deleteUrl: '/safe/inspectionitem',
	queryForm: {
		communityName: '',
		name: ''
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
			<el-form-item>
				<el-input v-model="state.queryForm.communityName" placeholder="小区名" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<el-input v-model="state.queryForm.name" placeholder="巡检项目名" clearable></el-input>
			</el-form-item>
			<!-- <el-form-item>
				<fast-select v-model="state.queryForm.gender" dict-type="user_gender" clearable placeholder="性别"></fast-select>
			</el-form-item> -->
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
			<el-table-column prop="name" label="巡检项目名" header-align="center" align="center"></el-table-column>
			<el-table-column prop="type" label="规格型号" dict-type="user_gender"></el-table-column>
			<el-table-column prop="factory" label="品牌厂商" header-align="center" align="center"></el-table-column>
			<el-table-column prop="insuranceFactory" label="维保厂商" header-align="center" align="center"> </el-table-column>
			<el-table-column prop="photo" label="项目图片" header-align="center" align="center">
				<template #default="{ row }">
					<el-image class="w-[40px] h-[20px]" :src="row.photo" />
				</template>
			</el-table-column>

			<el-table-column prop="note" label="备注" header-align="center" align="center"></el-table-column>
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
