<template>
	<el-dialog v-model="visible" title="装修验收提示" :close-on-click-modal="false">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" @keyup.enter="submitHandle()">
			<el-form-item label="验收人" prop="employeeIds">
				<!-- <el-select-v2 ref="v2" v-model="dataForm.employeeIds" :options="options" style="width: 240px" multiple /> -->
				<el-select v-model="dataForm.employeeIds" multiple placeholder="验收人" style="width: 240px">
					<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
				</el-select>
			</el-form-item>
		</el-form>
		<template #footer>
			<!-- <el-button @click="visible = false">取消</el-button> -->
			<el-button type="primary" @click="submitHandle()">确定</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus/es'
import { useRepairApi, useRepairSubmitApi } from '@/api/property/repair'
import { useGetListOption, userGetCommunityOption } from '../property'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()
const v2 = ref()

const dataForm = reactive({
	id: '',
	communityId: '',
	userId: '',
	type: '',
	category: '',
	place: '',
	title: '',
	content: '',
	imgs: '',
	state: '',
	employeeIds: '',
	result: '',
	handleTime: '',
	evaluate: '',
	evaluateTime: '',
	deleted: '',
	createTime: '',
	updateTime: '',
	creator: '',
	updater: ''
})

const init = (id?: number) => {
	visible.value = true
	dataForm.id = ''

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}

	if (id) {
		getRepair(id)
	}
}

const getRepair = (id: number) => {
	useRepairApi(id).then(res => {
		Object.assign(dataForm, res.data)
	})
}

const dataRules = ref({
	employeeIds: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
})
let a = 10000

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}

		useRepairSubmitApi(dataForm).then(() => {
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
let options = []
options = useGetListOption()
defineExpose({
	init
})
</script>
