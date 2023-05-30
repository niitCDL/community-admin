<template>
	<el-card>
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item>
				<el-date-picker
					v-model="state.queryForm.createTime"
					type="datetime"
					placeholder="开始时间"
					format="YYYY/MM/DD hh:mm:ss"
					value-format="YYYY-MM-DD hh:mm:ss"
				/>
			</el-form-item>
			<el-form-item>
				<el-date-picker
					v-model="state.queryForm.endTime"
					type="datetime"
					placeholder="结束时间"
					format="YYYY/MM/DD hh:mm:ss"
					value-format="YYYY-MM-DD hh:mm:ss "
				/>
			</el-form-item>

			<el-form-item>
				<el-button @click="getDataList()">查询</el-button>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="addOrUpdateHandle()">重置</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%" @selection-change="selectionChangeHandle">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="id" label="序号" header-align="center" align="center" width="60"></el-table-column>
			<el-table-column prop="communityName" label="所属社区" header-align="center" align="center"></el-table-column>
			<el-table-column prop="houseNumber" label="授权楼栋" header-align="center" align="center"></el-table-column>
			<el-table-column prop="owner" label="授权人" header-align="center" align="center" width="70"></el-table-column>

			<el-table-column prop="validTime" label="有效时间" header-align="center" align="center"></el-table-column>
			<el-table-column prop="doorIds" label="授权位置" header-align="center" align="center"></el-table-column>

			<el-table-column prop="count" label="开门次数" header-align="center" align="center"></el-table-column>

			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="250">
				<template #default="scope">
					<el-button type="primary" link @click="addOrUpdateHandle(scope.row.id)">查看开门记录</el-button>
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
		<add-or-update ref="addOrUpdateRef" @refresh-data-list="getDataList"></add-or-update>
	</el-card>
</template>

<script setup lang="ts" name="SysUserIndex">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import AddOrUpdate from './invitationDetails.vue'
import { IHooksOptions } from '@/hooks/interface'
// import constant from '@/utils/constant'
import { useDeleteActivityApi, useActivityStatusApi } from '@/api/society/activity'
import { ElMessage, UploadProps } from 'element-plus'
import cache from '@/utils/cache'

const state: IHooksOptions = reactive({
	dataListUrl: '/soft2242/visitor/invitation/page',
	deleteUrl: '',
	queryForm: {
		username: '',
		mobile: '',
		gender: ''
	}
})

const uploadUserExcelUrl = import.meta.env.VITE_API_URL + '/soft2242/order/import?accessToken=' + cache.getToken()

const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle } = useCrud(state)
</script>
