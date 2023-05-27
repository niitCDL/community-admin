<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" @keyup.enter="submitHandle()">
			<el-form-item label="社区id" prop="communityId">
				<el-select v-model="dataForm.communityId" placeholder="请选择">
					<el-option label="请选择" value="0"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="报修人id" prop="userId">
				<el-input v-model="dataForm.userId" placeholder="报修人id"></el-input>
			</el-form-item>
			<el-form-item label="报修类别(0:公共报修，1：个人报修)" prop="type">
				<el-input v-model="dataForm.type" placeholder="报修类别(0:公共报修，1：个人报修)"></el-input>
			</el-form-item>
			<el-form-item label="报修类型(0:路灯，1：厕所)" prop="category">
				<el-input v-model="dataForm.category" placeholder="报修类型(0:路灯，1：厕所)"></el-input>
			</el-form-item>
			<el-form-item label="报修地址" prop="place">
				<el-input v-model="dataForm.place" placeholder="报修地址"></el-input>
			</el-form-item>
			<el-form-item label="报修标题" prop="title">
				<el-input v-model="dataForm.title" placeholder="报修标题"></el-input>
			</el-form-item>
			<el-form-item label="报修内容" prop="content">
				<el-input v-model="dataForm.content" placeholder="报修内容"></el-input>
			</el-form-item>
			<el-form-item label="图片" prop="imgs">
				<el-input v-model="dataForm.imgs" placeholder="图片"></el-input>
			</el-form-item>
			<el-form-item label="处理状态（0：未处理，1：处理中，2：已处理，3：已评价）" prop="state">
				<el-input v-model="dataForm.state" placeholder="处理状态（0：未处理，1：处理中，2：已处理，3：已评价）"></el-input>
			</el-form-item>
			<el-form-item label="处理人id，逗号分隔" prop="employeeIds">
				<el-input v-model="dataForm.employeeIds" placeholder="处理人id，逗号分隔"></el-input>
			</el-form-item>
			<el-form-item label="处理结果" prop="result">
				<el-input v-model="dataForm.result" placeholder="处理结果"></el-input>
			</el-form-item>
			<el-form-item label="处理时间" prop="handleTime">
				<el-input v-model="dataForm.handleTime" placeholder="处理时间"></el-input>
			</el-form-item>
			<el-form-item label="报修评价" prop="evaluate">
				<el-input v-model="dataForm.evaluate" placeholder="报修评价"></el-input>
			</el-form-item>
			<el-form-item label="报修评价时间" prop="evaluateTime">
				<el-input v-model="dataForm.evaluateTime" placeholder="报修评价时间"></el-input>
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
import { useRepairApi, useRepairSubmitApi } from '@/api/property/repair'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()

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

const dataRules = ref({})

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

defineExpose({
	init
})
</script>
