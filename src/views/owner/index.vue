<template>
	<el-card>
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item>
				<el-input v-model="state.queryForm.communityName" placeholder="请输入社区名"></el-input>
			</el-form-item>
			<el-form-item>
				<el-select v-model="state.queryForm.state" class="m-2" placeholder="Select" size="large">
					<el-option v-for="item in options" :key="item.key" :label="item.label" :value="item.key" />
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button v-auth="'owner:index:page'" type="primary" @click="getDataList()"><svg-icon icon="icon-search"></svg-icon>查询</el-button>
			</el-form-item>
			<el-form-item>
				<el-button v-auth="'owner:index:page'" @click="resetData()"><svg-icon icon="icon-reload"></svg-icon>重置</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%">
			<el-table-column type="index" label="序号" header-align="center" align="center" width="60"></el-table-column>
			<el-table-column label="昵称" header-align="center" align="center">
				<template #default="scope">
					<div class="test1">
						<el-avatar :size="40" :src="scope.row.avatar" />
						<span class="nicheng">{{ scope.row.username }}</span>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="houseName" label="房产名称" header-align="center" align="center"></el-table-column>
			<el-table-column prop="realName" label="姓名" header-align="center" width="70%" align="center"></el-table-column>
			<el-table-column prop="phone" label="手机号" header-align="center" width="120%" align="center"></el-table-column>
			<el-table-column prop="identityCard" label="身份证" header-align="center" align="center"></el-table-column>
			<fast-table-column prop="identity" label="类型" dict-type="owner_identity" width="100%"></fast-table-column>
			<el-table-column prop="updateTime" label="绑定日期" header-align="center" align="center"></el-table-column>
			<fast-table-column prop="state" label="状态" width="100%" dict-type="owner_state"></fast-table-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="200">
				<template #default="scope">
					<el-button v-auth="'owner:index:info'" type="primary" link @click="toInfo(scope.row.id)">查看</el-button>
					<el-button v-if="scope.row.state === 0" v-auth="'owner:index:apApply'" type="success" link @click="approvedApply(scope.row.id)"
						>通过</el-button
					>
					<el-button v-if="scope.row.state === 0" v-auth="'owner:index:reApply'" type="warning" link @click="refuseApply(scope.row.id)"
						>驳回</el-button
					>
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

<script setup lang="ts" name="OneOwnerIndex">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { IHooksOptions } from '@/hooks/interface'
import { apApply, reApply } from '@/api/owner/owner'
import { router } from '@/router'
const options = [
	{
		label: '未审核',
		key: 0
	},
	{
		label: '已通过',
		key: 1
	},
	{
		label: '未通过',
		key: 2
	}
]
const state: IHooksOptions = reactive({
	dataListUrl: '/one/owner/page',
	queryForm: {
		communityName: '',
		state: 1
	}
})
const approvedApply = (id: number) => {
	apApply(id).then((res: any) => {
		if (res.code == 0) {
			ElMessage.success('审批成功')
			getDataList()
		} else {
			ElMessage.error('审批失败')
		}
	})
}
const refuseApply = (id: number) => {
	reApply(id).then((res: any) => {
		if (res.code == 0) {
			ElMessage.success('审批成功')
			getDataList()
		} else {
			ElMessage.error('审批失败')
		}
	})
}
const resetData = () => {
	state.queryForm.communityName = ''
	state.queryForm.state = 1
	getDataList()
}
const toInfo = (id: any) => {
	localStorage.setItem('ownerId', id)
	router.push('info')
}
const { getDataList, sizeChangeHandle, currentChangeHandle, deleteBatchHandle } = useCrud(state)
</script>
<style scoped>
.nicheng {
	margin-left: 8px;
}
.test1 {
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
>
