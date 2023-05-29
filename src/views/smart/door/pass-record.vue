<template>
	<el-card>
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item>
				<el-select v-model="state.queryForm.userId" placeholder="业主名" clearable filterable>
					<el-option label="张之维" :value="1"></el-option>
					<el-option label="王晓刚" :value="2"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-select v-model="state.queryForm.doorId" placeholder="闸机" clearable>
					<el-option v-for="item in doorList" :key="item.id" :label="item.doorName" :value="item.id" />
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-select v-model="state.queryForm.passWay" placeholder="出入方式" clearable>
					<el-option label="刷卡" :value="0"></el-option>
					<el-option label="人脸" :value="1"></el-option>
					<el-option label="指纹" :value="2"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-select v-model="state.queryForm.communityId" placeholder="小区" clearable filterable>
					<el-option label="万象城" :value="1"></el-option>
					<el-option label="汤臣一品" :value="2"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList()">查询</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%" @selection-change="selectionChangeHandle">
			<el-table-column prop="username" label="业主" header-align="center" align="center"></el-table-column>
			<el-table-column prop="doorName" label="出入门禁" header-align="center" align="center"></el-table-column>
			<el-table-column prop="passWay" label="出入方式" header-align="center" align="center">
				<template #default="scope">
					<el-tag v-if="scope.row.passWay === 0" type="info">刷卡</el-tag>
					<el-tag v-if="scope.row.passWay === 1" type="success">人脸</el-tag>
					<el-tag v-if="scope.row.passWay === 2" type="warning">指纹</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="communityName" label="通行小区" header-align="center" align="center"></el-table-column>
			<el-table-column prop="createTime" label="创建时间" header-align="center" align="center"></el-table-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
				<template #default="scope">
					<el-button v-auth="'sys:pass:info'" type="primary" link @click="addOrUpdateHandle(scope.row.id)">详情</el-button>
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

<script setup lang="ts" name="SysPassIndex">
import { useCrud } from '@/hooks'
import { onMounted, reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import { getAllDoor } from '@/api/smart'
import { ElMessage } from 'element-plus/es'

const state: IHooksOptions = reactive({
	dataListUrl: '/smart/pass/page',
	queryForm: {
		userId: '',
		doorId: '',
		passWay: '',
		communityId: ''
	}
})

const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle } = useCrud(state)

const doorList = ref<any[]>([])

const getDoorList = () => {
	getAllDoor().then((res: any) => {
		if (res.code != 0) {
			ElMessage.success({
				message: '接口异常',
				duration: 500
			})
		}
		doorList.value = res.data
	})
}

onMounted(() => {
	getDoorList()
})
</script>
