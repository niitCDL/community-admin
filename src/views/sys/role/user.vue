<template>
	<el-card>
		<el-form :inline="true" :model="state.queryForm">
			<el-form-item>
				<el-input v-model="state.queryForm.username" placeholder="用户名"></el-input>
			</el-form-item>
			<el-form-item>
				<el-input v-model="state.queryForm.phone" placeholder="手机号"></el-input>
			</el-form-item>
			<el-form-item>
				<fast-select v-model="state.queryForm.gender" dict-type="user_gender" clearable placeholder="性别"></fast-select>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList()">查询</el-button>
			</el-form-item>
			<fast-user :role-id="props.roleId" @select="userHandle"></fast-user>
			<el-form-item>
				<el-button type="danger" @click="deleteByIdList()">删除</el-button>
			</el-form-item>
		</el-form>
		<el-table
			v-loading="state.dataListLoading"
			:data="state.dataList"
			border
			style="width: 100%"
			@selection-change="selectionChangeHandle"
			@sort-change="sortChangeHandle"
		>
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="username" label="用户名" header-align="center" align="center"></el-table-column>
			<el-table-column prop="phone" label="手机号" header-align="center" align="center"></el-table-column>
			<el-table-column prop="realName" label="姓名" header-align="center" align="center"></el-table-column>
			<fast-table-column prop="gender" label="性别" dict-type="user_gender"></fast-table-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
				<template #default="scope">
					<el-button type="primary" link @click="deleteById(scope.row.id)">删除</el-button>
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

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import FastUser from '@/components/fast-user/src/fast-user.vue'
import { useRoleUserSubmitApi } from '@/api/sys/role'
import { ElMessage } from 'element-plus/es'
import service from '@/utils/request'

const props = defineProps({
	roleId: {
		type: Number,
		required: true
	}
})

const state: IHooksOptions = reactive({
	dataListUrl: '/sys/user/page/byRoleId',
	queryForm: {
		roleId: props.roleId,
		username: '',
		phone: '',
		gender: ''
	}
})

const { getDataListSelections, getDataList, sizeChangeHandle, selectionChangeHandle, sortChangeHandle, currentChangeHandle, deleteBatchHandle } =
	useCrud(state)

const useDelete = (data: any) => {
	service.delete('/sys/role/unbindingRole', { data }).then(() => {
		ElMessage.success({
			message: '操作成功',
			duration: 500,
			onClose: () => {
				getDataList()
			}
		})
	})
}

const deleteByIdList = () => {
	const data: any = {
		roleId: props.roleId,
		adminIdList: getDataListSelections()
	}
	useDelete(data)
}

const deleteById = (id: number | string) => {
	const data: any = {
		roleId: props.roleId,
		adminIdList: [id]
	}
	useDelete(data)
}

const userHandle = (userIdList: number[]) => {
	console.log(userIdList)
	useRoleUserSubmitApi(props.roleId, userIdList).then(() => {
		ElMessage.success({
			message: '操作成功',
			duration: 500,
			onClose: () => {
				getDataList()
			}
		})
	})
}
</script>
