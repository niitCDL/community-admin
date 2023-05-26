<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" draggable>
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="120px" @keyup.enter="submitHandle()">
			<el-form-item prop="buildingName" label="楼宇名称">
				<el-input v-model="dataForm.buildingName" placeholder="楼宇名称"></el-input>
			</el-form-item>
			<el-form-item prop="units" label="所在单元">
				<el-input v-model="dataForm.units" placeholder="所在单元"></el-input>
			</el-form-item>
			<!-- <el-form-item prop="orgId" label="所属机构">
				<el-tree-select
					v-model="dataForm.orgId"
					:data="orgList"
					value-key="id"
					check-strictly
					:render-after-expand="false"
					:props="{ label: 'name', children: 'children' }"
					style="width: 100%"
				/>
			</el-form-item> -->
			<el-form-item prop="usedArea" label="占地面积">
				<el-input v-model="dataForm.usedArea" placeholder="占地面积"></el-input>
			</el-form-item>
			<el-form-item prop="content" label="备注">
				<el-input v-model="dataForm.content" placeholder="备注"></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="visible = false">取消</el-button>
			<el-button type="primary" @click="submitHandle()">确定</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus/es'
import { useOrgListApi } from '@/api/sys/orgs'
import { useBuildingApi, useBuildingSubmitApi } from '@/api/building/building'
import { usePostListApi } from '@/api/sys/post'
import { useRoleListApi } from '@/api/sys/role'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const postList = ref<any[]>([])
const roleList = ref<any[]>([])
const orgList = ref([])
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	buildingName: '',
	units: '',
	usedArea: '',
	content: ''
})

const init = (id?: number) => {
	visible.value = true
	dataForm.id = ''

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}

	// id 存在则为修改
	// if (id) {
	// 	getUser(id)
	// }

	// getOrgList()
	// getPostList()
	// getRoleList()
}

// 获取岗位列表
// const getPostList = () => {
// 	return usePostListApi().then(res => {
// 		postList.value = res.data
// 	})
// }

// 获取角色列表
// const getRoleList = () => {
// 	return useRoleListApi().then(res => {
// 		roleList.value = res.data
// 	})
// }

// 获取机构列表
// const getOrgList = () => {
// 	return useOrgListApi().then(res => {
// 		orgList.value = res.data
// 	})
// }

// 获取信息
const getBuilding = (id: number) => {
	useBuildingApi(id).then(res => {
		Object.assign(dataForm, res.data)
	})
}

const dataRules = ref({
	username: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	realName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	mobile: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	orgId: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
})

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}

		useBuildingSubmitApi(dataForm).then(() => {
			ElMessage.success({
				message: '操作成功',
				duration: 500,
				onClose: () => {
					visible.value = false
					emit('refreshDataList')
				}
			})
		})
	})
}

defineExpose({
	init
})
</script>
