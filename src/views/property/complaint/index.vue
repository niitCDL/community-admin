<template>
	<el-card>
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
					<el-form-item>
			  <el-select v-model="state.queryForm.communityId" placeholder="社区id">
				<el-option label="选择" value="0"></el-option>
			  </el-select>
			</el-form-item>
			<el-form-item>
			  <el-select v-model="state.queryForm.type" placeholder="投诉类型(0:物业服务，1:社区服务)">
				<el-option label="选择" value="0"></el-option>
			  </el-select>
			</el-form-item>
			<el-form-item>
			  <el-date-picker
				v-model="state.queryForm.updateTime"
				type="datetimerange"
				value-format="YYYY-MM-DD HH:mm:ss">
			  </el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList()">查询</el-button>
			</el-form-item>
			<el-form-item>
				<el-button v-auth="'property:complaint:save'" type="primary" @click="addOrUpdateHandle()">新增</el-button>
			</el-form-item>
			<el-form-item>
				<el-button v-auth="'property:complaint:delete'" type="danger" @click="deleteBatchHandle()">删除</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%" @selection-change="selectionChangeHandle">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="communityId" label="社区id" header-align="center" align="center"></el-table-column>
			<el-table-column prop="userId" label="投诉人id" header-align="center" align="center"></el-table-column>
			<el-table-column prop="type" label="投诉类型(0:物业服务，1:社区服务)" header-align="center" align="center"></el-table-column>
			<el-table-column prop="titile" label="投诉标题" header-align="center" align="center"></el-table-column>
			<el-table-column prop="content" label="投诉内容" header-align="center" align="center"></el-table-column>
			<el-table-column prop="imgs" label="图片" header-align="center" align="center"></el-table-column>
			<el-table-column prop="state" label="处理状态（0：未处理，1：处理中，2：已处理，3：已评价）" header-align="center" align="center"></el-table-column>
			<el-table-column prop="result" label="处理结果" header-align="center" align="center"></el-table-column>
			<el-table-column prop="employeeIds" label="处理人id，逗号分隔" header-align="center" align="center"></el-table-column>
			<el-table-column prop="handleTime" label="处理时间" header-align="center" align="center"></el-table-column>
			<el-table-column prop="evaluate" label="评价内容" header-align="center" align="center"></el-table-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
				<template #default="scope">
					<el-button v-auth="'property:complaint:update'" type="primary" link @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
					<el-button v-auth="'property:complaint:delete'" type="primary" link @click="deleteBatchHandle(scope.row.id)">删除</el-button>
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

<script setup lang="ts" name="Soft2242ComplaintIndex">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import AddOrUpdate from './add-or-update.vue'
import { IHooksOptions } from '@/hooks/interface'

const state: IHooksOptions = reactive({
	dataListUrl: '/property/complaint/page',
	deleteUrl: '/property/complaint',
	queryForm: {
		communityId: '', 
		type: '', 
		updateTime: ''
	}
})

const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle } = useCrud(state)
</script>
