<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" @keyup.enter="submitHandle()">
	    				<el-form-item label="id" prop="id">
					<el-input v-model="dataForm.id" placeholder="id"></el-input>
				</el-form-item>
				<el-form-item label="社区id" prop="communityId">
					<el-input v-model="dataForm.communityId" placeholder="社区id"></el-input>
				</el-form-item>
				<el-form-item label="投诉人id" prop="userId">
					<el-input v-model="dataForm.userId" placeholder="投诉人id"></el-input>
				</el-form-item>
				<el-form-item label="投诉类型(0:物业服务，1:社区服务)" prop="type">
					<el-input v-model="dataForm.type" placeholder="投诉类型(0:物业服务，1:社区服务)"></el-input>
				</el-form-item>
				<el-form-item label="投诉标题" prop="titile">
					<el-input v-model="dataForm.titile" placeholder="投诉标题"></el-input>
				</el-form-item>
				<el-form-item label="投诉内容" prop="content">
					<el-input v-model="dataForm.content" placeholder="投诉内容"></el-input>
				</el-form-item>
				<el-form-item label="图片" prop="imgs">
					<el-input v-model="dataForm.imgs" placeholder="图片"></el-input>
				</el-form-item>
				<el-form-item label="处理状态（0：未处理，1：处理中，2：已处理，3：已评价）" prop="state">
					<el-input v-model="dataForm.state" placeholder="处理状态（0：未处理，1：处理中，2：已处理，3：已评价）"></el-input>
				</el-form-item>
				<el-form-item label="处理结果" prop="result">
					<el-input v-model="dataForm.result" placeholder="处理结果"></el-input>
				</el-form-item>
				<el-form-item label="处理人id，逗号分隔" prop="employeeIds">
					<el-input v-model="dataForm.employeeIds" placeholder="处理人id，逗号分隔"></el-input>
				</el-form-item>
				<el-form-item label="处理时间" prop="handleTime">
					<el-input v-model="dataForm.handleTime" placeholder="处理时间"></el-input>
				</el-form-item>
				<el-form-item label="评价内容" prop="evaluate">
					<el-input v-model="dataForm.evaluate" placeholder="评价内容"></el-input>
				</el-form-item>
				<el-form-item label="评价时间" prop="evaluateTime">
					<el-input v-model="dataForm.evaluateTime" placeholder="评价时间"></el-input>
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
import { useComplaintApi, useComplaintSubmitApi } from '@/api/property/complaint'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	communityId: '',
	userId: '',
	type: '',
	titile: '',
	content: '',
	imgs: '',
	state: '',
	result: '',
	employeeIds: '',
	handleTime: '',
	evaluate: '',
	evaluateTime: '',
	deleted: '',
	createTime: '',
	updateTime: '',
	creator: '',
	updater: ''})

const init = (id?: number) => {
	visible.value = true
	dataForm.id = ''

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}

	if (id) {
		getComplaint(id)
	}
}

const getComplaint = (id: number) => {
	useComplaintApi(id).then(res => {
		Object.assign(dataForm, res.data)
	})
}

const dataRules = ref({
})

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}

		useComplaintSubmitApi(dataForm).then(() => {
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
