<template>
	<el-card>
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item>
				<el-select v-model="state.queryForm.parkName" placeholder="停车场名称">
					<el-option label="选择" value="0"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList()">查询</el-button>
			</el-form-item>
			<el-form-item>
				<el-button v-auth="'sys:park:save'" type="primary" @click="addOrUpdateHandle()">新增</el-button>
			</el-form-item>
			<el-form-item>
				<el-button v-auth="'sys:park:delete'" type="danger" @click="deleteBatchHandle()">删除</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%" @selection-change="selectionChangeHandle">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="parkName" label="停车场名称" header-align="center" align="center"></el-table-column>
			<el-table-column prop="contactPhone" label="联系电话" header-align="center" align="center"></el-table-column>
			<el-table-column prop="address" label="地址" header-align="center" align="center"></el-table-column>
			<el-table-column prop="carportNumber" label="车位数量" header-align="center" align="center"></el-table-column>
			<el-table-column prop="status" label="状态" header-align="center" align="center">
				<template #default="{ row }">
					<el-tag v-if="row.status == 0" type="success">开启</el-tag>
					<el-tag v-if="row.status == 1" type="danger">关闭</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="parkImg" label="停车场图" header-align="center" align="center">
				<template #default="scope">
					<el-image :src="scope.row.parkImg" alt="图片" class="w-[40px] h-[20px]" />
				</template>
			</el-table-column>
			<el-table-column prop="content" label="备注" header-align="center" align="center"></el-table-column>
			<el-table-column prop="price" label="单价" header-align="center" align="center" width="80"></el-table-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
				<template #default="scope">
					<el-button v-auth="'sys:park:update'" type="primary" link @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
					<el-button v-auth="'sys:park:delete'" type="primary" link @click="deleteBatchHandle(scope.row.id)">删除</el-button>
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

<script setup lang="ts" name="Admin-parkParkIndex">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import AddOrUpdate from './add-or-update.vue'
import { IHooksOptions } from '@/hooks/interface'

const state: IHooksOptions = reactive({
	dataListUrl: '/sys/park/page',
	deleteUrl: '/sys/park/delete',
	queryForm: {
		communityName: '',
		parkName: ''
	}
})

const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle } = useCrud(state)
</script>
